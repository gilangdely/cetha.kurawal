const { Client } = require("@gradio/client");

async function testGradio() {
    try {
        console.log("Connecting to Gradio...");
        const app = await Client.connect("firmanaziz/CV2");
        console.log("Connected. Root:", app.config?.root);
        
        if (!app.config?.root) {
            console.error("Root config missing!");
            return;
        }
        
        console.log("Gradio connection test PASSED");
    } catch (error) {
        console.error("Gradio connection test FAILED:", error);
    }
}

testGradio();
