import { getWrapper } from "../utils/codeWrappers.js";
import judgeClient from "../utils/judgeApi.js";
import { db } from '../firebaseAdmin.js'; // Ensure this points to your Firestore in

const LANGUAGE_ID_TO_KEY = {
    63: 'javascript',
    71: 'python',
    62: 'java',
    54: 'cpp',
    50: 'c',
};
export const runBatchCode = async (req, res) => {
    try {
        const { submissions, problemId, functionName } = req.body;

        if (!submissions || !problemId) {
            return res.status(400).json({ error: "Missing submissions or problemId" });
        }

        // --- FIX IS HERE: Use Admin SDK Syntax ---
        // Old (Client SDK): const snap = await getDoc(doc(db, 'problems', problemId));
        // New (Admin SDK):
        const problemSnap = await db.collection('problems').doc(problemId).get();

        if (!problemSnap.exists) { // Note: Admin SDK uses .exists property, not .exists() function
            return res.status(404).json({ error: "Problem not found" });
        }

        const problemData = problemSnap.data();

        // 2. Process all submissions
        const processedSubmissions = submissions.map((sub) => {
            const langKey = LANGUAGE_ID_TO_KEY[sub.language_id];
            const langConfig = problemData.languages?.[langKey];

            if (!langConfig) {
                throw new Error(`Language ${langKey} not configured for this problem`);
            }

            // 3. Use getWrapper with the 4 ARGUMENTS
            const wrappedSource = getWrapper(
                sub.language_id,       
                sub.source_code,       
                functionName,          
                langConfig.wrapperTemplate 
            );

            return {
                source_code: wrappedSource,
                language_id: sub.language_id,
                stdin: sub.stdin,
                expected_output: sub.expected_output
            };
        });

        // 4. Send to Judge0 (assuming you have judgeClient configured)
        // If judgeClient isn't globally available, make sure to import it!
        // import api from '../lib/api.js' OR however you set up Axios for Judge0
        const postResponse = await judgeClient.post(
            "/submissions/batch/?base64_encoded=false&wait=false",
            { submissions: processedSubmissions }
        );

        return res.status(201).json(postResponse.data);

    } catch (error) {
        console.error("Backend Batch Error:", error.message);
        res.status(500).json({ 
            error: "Failed to process batch submission", 
            details: error.message 
        });
    }
};

export const checkBatchStatus = async (req, res) => {
    const { tokens } = req.query;
    if (!tokens) {
        return res.status(400).json({ error: "Missing tokens" });
    }
    try {
        const response = await judgeClient.get(
            `/submissions/batch?tokens=${tokens}&base64_encoded=false&fields=token,stdout,stderr,status,compile_output`
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Check Status Error:", error.message);
        return res.status(500).json({ error: "Failed to check status" });
    }
};

export const deleteCode = async (req, res) => {
    const { token } = req.body
    try {
        const response = await judgeClient.delete(`/submissions/${token}?base64_encoded=true`)
        console.log(response)
        res.send(response)
    } catch (error) {
        console.log(error)
    }
}