import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { products } from "../client/src/data/products";

const firebaseConfig = {
  apiKey: "AIzaSyANJ7HbgkClNZGDG7bI0Vjg0Rl62V4AnrI",
  authDomain: "mayil-jewel-1a320.firebaseapp.com",
  projectId: "mayil-jewel-1a320",
  storageBucket: "mayil-jewel-1a320.firebasestorage.app",
  messagingSenderId: "566510363884",
  appId: "1:566510363884:web:003ebe8ccb2ce4af8f31c9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding initial products into Firestore...");
  for (const prod of products) {
    try {
      await setDoc(doc(db, "products", prod.id), prod);
      console.log(`Successfully seeded product: ${prod.name}`);
    } catch (e: any) {
      console.error(`Error seeding product ${prod.name}:`, e.message || e);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Fatal seeding error:", err);
  process.exit(1);
});
