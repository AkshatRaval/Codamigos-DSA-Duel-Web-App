import judgeClient from "../utils/judgeApi.js";

export const runBatchCode = async (req, res) => {
    // 1. Expect an object containing an array of submissions
    // Payload from Frontend should look like: { submissions: [{...}, {...}] }
    const { submissions } = req.body;

    try {
        // --- STEP 1: POST BATCH ---
        const postResponse = await judgeClient.post(
            "/submissions/batch/?base64_encoded=false&wait=false",
            { submissions }
        );

        // Judge0 returns an array: [{ "token": "..." }, { "token": "..." }]
        // We need to extract just the token strings
        const tokens = postResponse.data.map(t => t.token);
        const tokenString = tokens.join(","); // "token1,token2,token3"

        // --- STEP 2: POLLING LOOP ---
        let attempts = 0;
        const maxAttempts = 20;
        let isDone = false;
        let finalResults = [];

        while (!isDone && attempts < maxAttempts) {
            // Wait 1 second
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check status of ALL tokens at once
            const pollResponse = await judgeClient.get(
                `/submissions/batch?tokens=${tokenString}&base64_encoded=false&fields=token,stdout,stderr,status,compile_output`
            );

            // Judge0 returns { submissions: [...] }
            const results = pollResponse.data.submissions;

            // Check if ANY submission is still processing (Status ID 1 or 2)
            const stillProcessing = results.some(r => r.status.id <= 2);10,10,3,7,6

            if (!stillProcessing) {
                isDone = true;
                finalResults = results;
            }

            attempts++;
        }

        if (attempts >= maxAttempts) {
            return res.status(500).json({ error: "Code execution timed out" });
        }
        console.log(finalResults)
        // --- STEP 3: RETURN RESULTS ---
        res.status(200).json({ submissions: finalResults });

    } catch (error) {
        console.error("Backend Batch Error:", error);
        res.status(500).json({ error: "Failed to process batch submission" });
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