const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-crru9%40maps-d5e67.iam.gserviceaccount.com",
};

// Initialize the app with a service account, granting admin privileges
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://maps-d5e67.firebaseio.com/",
  });
}

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();

const firebaseSanitizeKey = (str = "") => {
  // Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
  return str
    .replace(/[,\.#:\$\[\]]/g, "")
    .replace(/\//g, "__")
    .replace(/[\?&]/g, "--");
};

module.exports = { db, makeFirebaseId: firebaseSanitizeKey };
