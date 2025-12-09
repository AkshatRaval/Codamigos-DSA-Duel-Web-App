// scripts/migrateUsers.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load service account
const serviceAccount = JSON.parse(
  readFileSync("./server/keyFirebase.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateUsers() {
  const usersSnap = await db.collection("users").get();

  if (usersSnap.empty) {
    console.log("No users found.");
    return;
  }

  console.log(`Found ${usersSnap.size} users. Starting migration...\n`);

  const batch = db.batch();
  let batchCount = 0;

  for (const doc of usersSnap.docs) {
    const user = doc.data();
    const userRef = db.collection("users").doc(doc.id);

    const updatedData = {};

    // ------------------------------
    // 🔥 FIELD-BY-FIELD MIGRATION
    // ------------------------------

    // 1) Role (default)
    if (!user.role) updatedData.role = "user";

    // 2) Friends & Requests
    if (!Array.isArray(user.friends)) updatedData.friends = [];
    if (!Array.isArray(user.incomingFriendReq)) updatedData.incomingFriendReq = [];
    if (!Array.isArray(user.outgoingFriendReq)) updatedData.outgoingFriendReq = [];

    // 3) Notifications
    if (user.unreadNotificationCount === undefined)
      updatedData.unreadNotificationCount = 0;

    // 4) Elo & Match Stats
    if (user.elo === undefined) updatedData.elo = 400;
    if (user.wins === undefined) updatedData.wins = 0;
    if (user.losses === undefined) updatedData.losses = 0;

    // 5) Streak System
    if (!user.streak) {
      updatedData.streak = {
        current: 0,
        best: 0,
        lastActivityDate: user.streak.lastActivityDate == null ? admin.firestore.FieldValue.serverTimestamp() : user.streak.lastActivityDate
      };
    }

    // 6) Coins system
    if (user.coins === undefined) updatedData.coins = 0;

    // 7) Solved Problems
    if (!user.solvedProblems) {
      updatedData.solvedProblems = {
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0,
      };
    }

    if (!user.socials) {
      updatedData.socials = {
        github: "",
        linkedin: "",
        twitter: "",
        website: "",
      };
    }

    if (!user.codingProfiles) {
      updatedData.codingProfiles = {
        leetcode: "",
        codeforces: "",
      };
    }

    if (Object.keys(updatedData).length > 0) {
      console.log(`Updating user: ${doc.id}`, updatedData);
      batch.update(userRef, updatedData);
      batchCount++;

      // Firestore batch limit = 500
      if (batchCount >= 450) {
        await batch.commit();
        console.log("Committed batch of 450 records.");
        batchCount = 0;
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log("Committed final batch.");
  }

  console.log("\n🔥 Migration complete!");
}

migrateUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
