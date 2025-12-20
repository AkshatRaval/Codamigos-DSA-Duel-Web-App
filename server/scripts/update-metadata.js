// scripts/update-metadata.mjs
import adminPkg from 'firebase-admin';
import { createRequire } from 'module';
import { configDotenv } from 'dotenv';
import path from 'path';

const require = createRequire(import.meta.url);
configDotenv();
const admin = adminPkg;

// 1. SETUP: Load Service Account
const svcPath = process.env.SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!svcPath) {
    console.error("❌ Error: SERVICE_ACCOUNT_PATH is missing in .env");
    process.exit(1);
}
const serviceAccount = require(path.resolve(svcPath));

// Initialize only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// 2. LOGIC: Update Metadata (Problems + Users + Leaderboard)
async function updateMetadata() {
    try {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 🚀 Starting Metadata Update...`);

        // --- PART A: PROBLEMS METADATA ---
        console.log("🔍 Scanning 'problems' collection...");
        const problemSnapshot = await db.collection('problems').get();

        const easy = [];
        const medium = [];
        const hard = [];
        const allProblems = [];



        problemSnapshot.forEach(doc => {
            const id = doc.id;
            const data = doc.data();
            const diff = (data.difficulty || 'easy').toLowerCase();

            const problemsMetadata = {
                id: doc.id,
                title: data.title,
                difficulty: diff,
                tags: data.tags,
                statement: data.statement
            }

            allProblems.push(problemsMetadata);
            if (diff === 'easy') easy.push(problemsMetadata);
            else if (diff === 'medium') medium.push(problemsMetadata);
            else if (diff === 'hard') hard.push(problemsMetadata);
        });

        // --- PART B: USERS METADATA & LEADERBOARD ---
        console.log("🔍 Scanning 'users' collection...");
        const userSnapshot = await db.collection('users').get();

        let allUsersRaw = [];
        let totalElo = 0;
        let usersWithElo = 0;

        userSnapshot.forEach(doc => {
            const data = doc.data();
            const elo = typeof data.elo === 'number' ? data.elo : 1200;

            // Stats Aggregation
            totalElo += elo;
            usersWithElo++;

            // Collect only necessary data for sorting/display
            allUsersRaw.push({
                uid: doc.id,
                username: data.username || data.name || "Anonymous",
                photoURL: data.avatarUrl || null,
                elo: elo,
                gamesPlayed: data.gamesPlayed || 0,
                wins: data.wins || 0
            });
        });

        const avgElo = usersWithElo > 0 ? Math.round(totalElo / usersWithElo) : 1200;

        // Sort by Elo descending for Leaderboard
        allUsersRaw.sort((a, b) => b.elo - a.elo);

        // Take Top 100 for the Leaderboard
        const top100Leaderboard = allUsersRaw.slice(0, 100);

        // --- PART C: SAVE EVERYTHING ---
        const payload = {
            // 1. Problem Metadata
            problemIds: {
                all: allProblems,
                easy,
                medium,
                hard
            },
            totalProblemsCount: allProblems.length,

            // 2. User Stats (Aggregated)
            usersSummary: {
                totalCount: allUsersRaw.length,
                avgElo: avgElo
            },

            // 3. The Leaderboard (Top 100)
            leaderboard: top100Leaderboard,

            // 4. System Info
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        // Write to 'system/metadata' (using merge: true to be safe, though set is fine too)
        await db.collection('system').doc('metadata').set(payload, { merge: true });

        console.log(`✅ Success! Metadata updated.`);
        console.log(`📊 Problems: ${allProblems.length} (Easy: ${easy.length}, Med: ${medium.length}, Hard: ${hard.length})`);
        console.log(`🏆 Users:    ${allUsersRaw.length} total. Leaderboard updated with Top ${top100Leaderboard.length}.`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Failed to update metadata:", error);
        process.exit(1);
    }
}

updateMetadata();