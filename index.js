const functions = require("firebase-functions");
const express = require("express");
const multer = require("multer");
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const admin = require("firebase-admin");

admin.initializeApp();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const client = new ImageAnnotatorClient();

// Route for OCR text detection
app.post("/detect-text", upload.single("image"), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;

        // Detect text in the uploaded image
        const [result] = await client.textDetection(imageBuffer);
        const text = result.textAnnotations.length > 0 ? result.textAnnotations[0].description : "No text detected.";

        res.status(200).json({ text: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "OCR detection failed" });
    }
});

exports.ocrFunction = functions.https.onRequest(app);
