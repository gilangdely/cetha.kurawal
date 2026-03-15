const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function testApi() {
    try {
        console.log("Reading test.pdf...");
        const fileStream = fs.createReadStream('test.pdf');
        
        const form = new FormData();
        form.append('file', fileStream, 'test.pdf');

        console.log("Sending request to /api/upload...");
        // Assuming the app is running on localhost:3000
        const response = await axios.post('http://localhost:3000/api/upload', form, {
            headers: {
                ...form.getHeaders(),
                // We might need a session cookie if session check is strict, 
                // but let's see if it falls back to guest or throws 401/403.
            }
        });

        console.log("Response status:", response.status);
        console.log("Response data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.error("API Error Response:", error.response.status, error.response.data);
        } else {
            console.error("Request Error:", error.message);
        }
    }
}

testApi();
