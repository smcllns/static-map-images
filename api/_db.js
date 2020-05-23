const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

// Initialize the app with a service account, granting admin privileges
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    databaseAuthVariableOverride: {
      uid: process.env.FIREBASE_AUTH_UID,
    },
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
