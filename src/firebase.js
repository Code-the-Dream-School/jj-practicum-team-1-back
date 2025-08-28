const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");


const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "plant-app-4a554.firebasestorage.app",
});

const bucket = getStorage().bucket();

module.exports = bucket;
