import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = getFirestore(app);

export { db };
