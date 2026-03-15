const { Client, handle_file } = require("@gradio/client");
const fs = require("fs");
const { Blob } = require("buffer");

async function testUpload() {
    try {
        console.log("Connecting to Gradio...");
        const app = await Client.connect("firmanaziz/CV2");
        const root = app.config?.root;
        console.log("Connected. Root:", root);
        
        const fileContent = fs.readFileSync("test.pdf");
        const blob = new Blob([fileContent], { type: "application/pdf" });
        // Mock File object
        blob.name = "test.pdf";

        console.log("Uploading file...");
        // upload_files is not directly available on Client in newer versions sometimes, 
        // it might be under 'upload' or similar. 
        // But the code uses upload_files.call(app, root, [file!])
        
        // Let's try to see if we can find upload_files
        const { upload_files } = require("@gradio/client");
        const { files } = await upload_files(root, [blob]);
        console.log("Upload success. Files:", files);
        
        const filename = files[0];
        const fileUrl = `https://firmanaziz-cv2.hf.space/gradio_api/file=${filename}`;
        console.log("File URL:", fileUrl);
        
        console.log("Predicting...");
        const result = await app.predict("/score_cv", [handle_file(fileUrl)]);
        console.log("Prediction success:", JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testUpload();
