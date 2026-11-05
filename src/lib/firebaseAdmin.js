import fs from "fs";
import path from "path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function loadServiceAccount() {
  // Hosting (Vercel) ke liye: base64 env variable
  if (process.env.FB_SERVICE_ACCOUNT_B64) {
    return JSON.parse(Buffer.from(process.env.FB_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
  }
  // Local ke liye: project root ki JSON file
  const file = path.join(process.cwd(), "serviceAccountKey.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(loadServiceAccount()) });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);