import { rtdb } from "../firebaseAdmin.js";
import { generateRoomCode } from "../utils/generateRoomCode.js"

export const createRoom = async (req, res) => {
    try {
        const { roomName, mode, difficulty, user } = req.body || {};

        if (!user || !user.uid) {
            return res.status(400).json({ ok: false, message: "User is required" });
        }
        // const profile = await getUserProfile()
        let code;
        for (let attempt = 0; attempt < 5; attempt++) {
            const candidate = generateRoomCode();
            const snap = await rtdb.ref(`rooms/${candidate}`).get();
            if (!snap.exists()) {
                code = candidate;
                break;
            }
        }
        if (!code) {
            return res
                .status(500)
                .json({ ok: false, message: "Could not generate room code" });
        }

        const now = Date.now();

        const room = {
            code,
            roomName: roomName || "Untitled Room",
            mode: mode || "dsa",
            difficulty: difficulty || "mixed",
            status: "waiting", 
            createdAt: now,
            players: {
                [user.uid]: {
                    uid: user.uid,
                    name: user.name || "Host",
                    avatarUrl: user.avatarUrl || null,
                    isHost: true,
                    joinedAt: now,
                },
            },
            state: {
                currentProblemIndex: 0,
                totalProblems: 4,
            },
        };
        await rtdb.ref(`rooms/${code}`).set(room);

        return res.status(201).json({ ok: true, room });
    } catch (err) {
        console.error("createRoom error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
}

export const joinRoom = async (req, res) => {
    try {
        const { code, user } = req.body;
        if (!code || !user?.uid) {
            return res.status(400).json({ ok: false, message: "Code And User Are required" });
        }
        const upperCode = code.toUpperCase()
        const roomRef = rtdb.ref(`rooms/${upperCode}`)
        const snap = await roomRef.get()

        if (!snap.exists()) {
            return res.status(404).json({ ok: false, message: "Room Not Found" });
        }

        const room = snap.val()
        if (room.status !== 'waiting') {
            return res
                .status(400)
                .json({ ok: false, message: "Room already started" });
        }

        const now = Date.now();
        const playerRef = rtdb.ref(`rooms/${upperCode}/players/${user.uid}`);
        await playerRef.set({
            uid: user.uid,
            name: user.name || "Guest",
            avatarUrl: user.avatarUrl || null,
            isHost: false,
            joinedAt: now,
        })
        const updatedSnap = await roomRef.get();
        const updatedRoom = updatedSnap.val();

        return res.json({ ok: true, room: updatedRoom })
    } catch (err) {
        console.error("joinRoom error:", err);
        return res
            .status(500)
            .json({ ok: false, message: err.message || "Server error" });
    }
}