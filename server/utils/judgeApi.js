import axios from 'axios';
const judgeClient = axios.create({
    baseURL: process.env.JUDGE0_API_URL || "http://localhost:2358",
    headers: {
        'Content-Type': 'application/json',
    }
});

judgeClient.interceptors.request.use((config) => {
    const apiKey = process.env.JUDGE0_API_KEY;
    if (apiKey) {
        config.headers['X-Auth-Token'] = apiKey; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default judgeClient;