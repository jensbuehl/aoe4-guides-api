import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "./aoe4-guides-dev-firebase-adminsdk-7l6v8-0e88eb6085.json" assert { type: "json" };

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = getFirestore(app);

export { db };
