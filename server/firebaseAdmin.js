import admin from "firebase-admin";
import dotenv from 'dotenv';
import { createRequire } from "module"; 

dotenv.config();
const require = createRequire(import.meta.url);

// CHANGE: Actually require the JSON file to get the object
const serviceAccount = require("./keyFirebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.RTDB_URL, 
});

export const db = admin.firestore();
export const rtdb = admin.database();