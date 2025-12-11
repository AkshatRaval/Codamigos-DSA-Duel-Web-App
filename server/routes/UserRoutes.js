import Router from 'express'
import { db } from '../firebaseAdmin';
const userRoutes = Router()
// POST /check-in
userRoutes.post("/check-in", async (req, res) => {
    try {
        const uid = req.user.uid; // you already attach req.user in your auth middleware
        const userRef = db.collection("users").doc(uid);

        await db.runTransaction(async (tx) => {
            const snap = await tx.get(userRef);
            if (!snap.exists) throw new Error("User not found");

            const user = snap.data();
            const now = new Date();
            const todayStr = now.toDateString();

            const lastCheck = user.lastCheckInDate?.toDate?.() || null;
            const lastStr = lastCheck ? lastCheck.toDateString() : null;

            // If already checked in today → do nothing (idempotent)
            if (todayStr === lastStr) return;

            // ---------- ACTUAL STREAK LOGIC ----------
            let newCurrent = 1;
            if (lastCheck) {
                const diff = now - lastCheck;
                const oneDay = 24 * 60 * 60 * 1000;

                // If yesterday → streak continues
                if (diff > oneDay && diff <= oneDay * 2) {
                    newCurrent = (user.streak?.current || 0) + 1;
                }
            }

            const newBest = Math.max(user.streak?.best || 0, newCurrent);

            // ---------- UPDATE FIELDS ----------
            tx.update(userRef, {
                "streak.current": newCurrent,
                "streak.best": newBest,
                "streak.lastActivityDate": admin.firestore.FieldValue.serverTimestamp(),
                coins: (user.coins || 0) + 10,
                lastCheckInDate: admin.firestore.FieldValue.serverTimestamp(),
            });
        });

        // Fetch updated data to return to client
        const updated = (await db.collection("users").doc(uid).get()).data();

        return res.json({
            success: true,
            already: false,
            coins: updated.coins,
            streak: updated.streak,
        });

    } catch (err) {
        console.error("Check-in error:", err);
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// userRoutes.delete('/delete-code', deleteCode)

export default userRoutes