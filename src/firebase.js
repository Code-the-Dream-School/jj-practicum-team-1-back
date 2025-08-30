const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");

const fs = require("fs");

let serviceAccount;

if (fs.existsSync("/etc/secrets/firebase-key.json")) {
  serviceAccount = require("/etc/secrets/firebase-key.json");
} else {
  serviceAccount = require("./firebase-key.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "plant-app-4a554.firebasestorage.app",
});

const bucket = getStorage().bucket();

module.exports = bucket;
