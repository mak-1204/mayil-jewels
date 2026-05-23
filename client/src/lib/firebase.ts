import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { products as initialProducts } from "@/data/products";
import { categories as initialCategories } from "@/data/categories";
import type { Product, Category } from "@/types";

// Firebase Config from Vite Env or User Provided Defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyANJ7HbgkClNZGDG7bI0Vjg0Rl62V4AnrI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mayil-jewel-1a320.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mayil-jewel-1a320",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mayil-jewel-1a320.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "566510363884",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:566510363884:web:003ebe8ccb2ce4af8f31c9",
};

// Check if valid firebase configuration is provided
const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "mock-api-key" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "mock-project-id";

let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully with config.");
  } catch (error) {
    console.error("Failed to initialize actual Firebase, using mock fallback.", error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.log("Firebase credentials not configured in env. Running in local mock mode.");
}

// ==========================================
// MOCK DATABASE & AUTH IMPLEMENTATION (FALLBACK)
// ==========================================

const LOCAL_PRODUCTS_KEY = "mayil_mock_products";
const LOCAL_ORDERS_KEY = "mayil_mock_orders";
const LOCAL_USER_KEY = "mayil_mock_user";

// Seed local storage with default products if empty
function getLocalProducts(): Product[] {
  const data = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialProducts;
  }
}

function saveLocalProducts(products: Product[]) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
}

function getLocalOrders() {
  const data = localStorage.getItem(LOCAL_ORDERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: any[]) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
}

// Simulated Auth State
type AuthObserver = (user: any) => void;
const authObservers = new Set<AuthObserver>();
let mockCurrentUser: any = (() => {
  const saved = localStorage.getItem(LOCAL_USER_KEY);
  return saved ? JSON.parse(saved) : null;
})();

function notifyAuthObservers() {
  authObservers.forEach(cb => cb(mockCurrentUser));
}

// ==========================================
// CORE FIREBASE & MOCK DB OPERATIONS
// ==========================================

// Auto-seed Firestore on first query if configured and empty
let isSeeded = false;
async function ensureFirestoreSeeded() {
  if (!db || isSeeded) return;
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
      console.log("Firestore products collection is empty. Auto-seeding initial products...");
      for (const prod of initialProducts) {
        await setDoc(doc(db, "products", prod.id), prod);
      }
      console.log("Firestore successfully seeded!");
    }
    isSeeded = true;
  } catch (error) {
    console.error("Error checking or seeding Firestore products collection:", error);
  }
}

// 1. PRODUCTS SERVICES
export async function getFirebaseProducts(): Promise<Product[]> {
  if (db) {
    await ensureFirestoreSeeded();
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list: Product[] = [];
      querySnapshot.forEach((d) => {
        list.push({ ...d.data(), id: d.id } as Product);
      });
      return list;
    } catch (error) {
      console.error("Firestore getFirebaseProducts failed, falling back to local products", error);
      return getLocalProducts();
    }
  }
  return getLocalProducts();
}

export async function addFirebaseProduct(product: Omit<Product, "id"> & { id?: string }): Promise<Product> {
  const newId = product.id || String(Date.now());
  const finalProduct = { ...product, id: newId } as Product;

  if (db) {
    try {
      await setDoc(doc(db, "products", newId), finalProduct);
      return finalProduct;
    } catch (error) {
      console.error("Firestore addFirebaseProduct failed", error);
    }
  }

  const list = getLocalProducts();
  list.push(finalProduct);
  saveLocalProducts(list);
  return finalProduct;
}

export async function updateFirebaseProduct(id: string, updates: Partial<Product>): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, "products", id), updates as any);
      return;
    } catch (error) {
      console.error("Firestore updateFirebaseProduct failed", error);
    }
  }

  const list = getLocalProducts();
  const idx = list.findIndex(p => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalProducts(list);
  }
}

export async function deleteFirebaseProduct(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, "products", id));
      return;
    } catch (error) {
      console.error("Firestore deleteFirebaseProduct failed", error);
    }
  }

  const list = getLocalProducts();
  const filtered = list.filter(p => p.id !== id);
  saveLocalProducts(filtered);
}

// 2. CATEGORIES SERVICES
export async function getFirebaseCategories(): Promise<Category[]> {
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      if (!querySnapshot.empty) {
        const list: Category[] = [];
        querySnapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Category);
        });
        // Sort by order field if present, otherwise by name
        list.sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99));
        return list;
      }
      // Auto-seed if empty
      console.log("Firestore categories empty. Auto-seeding...");
      for (const cat of initialCategories) {
        await setDoc(doc(db, "categories", cat.id), { ...cat, order: initialCategories.indexOf(cat) });
      }
      return initialCategories;
    } catch (error) {
      console.error("Firestore getFirebaseCategories failed, using local:", error);
    }
  }
  return initialCategories;
}

export async function updateFirebaseCategory(id: string, updates: Partial<Category & { order?: number }>): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, "categories", id), updates as any);
      return;
    } catch (error) {
      console.error("Firestore updateFirebaseCategory failed:", error);
      throw error;
    }
  }
  throw new Error("Firebase not configured");
}

export async function addFirebaseCategory(category: Omit<Category, "id"> & { id?: string; order?: number }): Promise<Category> {
  const newId = category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const finalCat = { ...category, id: newId } as Category;
  if (db) {
    try {
      await setDoc(doc(db, "categories", newId), finalCat);
      return finalCat;
    } catch (error) {
      console.error("Firestore addFirebaseCategory failed:", error);
      throw error;
    }
  }
  throw new Error("Firebase not configured");
}

export async function deleteFirebaseCategory(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, "categories", id));
      return;
    } catch (error) {
      console.error("Firestore deleteFirebaseCategory failed:", error);
      throw error;
    }
  }
  throw new Error("Firebase not configured");
}

// 3. INQUIRIES / ORDERS SERVICES
export async function getFirebaseOrders(): Promise<any[]> {
  if (db) {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((d) => {
        list.push({ ...d.data(), id: d.id });
      });
      return list;
    } catch (error) {
      console.error("Firestore getFirebaseOrders failed", error);
      return getLocalOrders();
    }
  }
  return getLocalOrders().sort((a: any, b: any) => b.createdAt - a.createdAt);
}

export async function addFirebaseOrder(order: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{ productId: string; quantity: number; price: number; name: string }>;
  totalAmount: number;
}): Promise<any> {
  const newOrder = {
    ...order,
    status: "pending",
    orderSource: "whatsapp",
    createdAt: Date.now(),
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      return { ...newOrder, id: docRef.id };
    } catch (error) {
      console.error("Firestore addFirebaseOrder failed", error);
    }
  }

  const mockOrder = { ...newOrder, id: String(Date.now()) };
  const list = getLocalOrders();
  list.push(mockOrder);
  saveLocalOrders(list);
  return mockOrder;
}

export async function updateFirebaseOrderStatus(id: string, status: string): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      return;
    } catch (error) {
      console.error("Firestore updateFirebaseOrderStatus failed", error);
    }
  }

  const list = getLocalOrders();
  const idx = list.findIndex((o: any) => o.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    saveLocalOrders(list);
  }
}

// 3. AUTHENTICATION SERVICES
export function onFirebaseAuthStateChanged(callback: (user: any) => void) {
  if (auth) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase User to our Admin structure
        callback({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Admin",
          email: firebaseUser.email,
          role: "admin", // Standardized to admin for access control
        });
      } else {
        callback(null);
      }
    });
  }

  // Fallback observer pattern
  authObservers.add(callback);
  callback(mockCurrentUser);
  return () => {
    authObservers.delete(callback);
  };
}

export async function signinFirebase(email: string, password: string): Promise<any> {
  if (auth) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return {
      id: credential.user.uid,
      name: credential.user.displayName || credential.user.email?.split("@")[0] || "Admin",
      email: credential.user.email,
      role: "admin",
    };
  }

  // Fallback email/password matching
  if (email === "admin@mayiljewels.com" && password === "password") {
    mockCurrentUser = {
      id: "mock-admin-id",
      name: "Mayil Admin",
      email: "admin@mayiljewels.com",
      role: "admin",
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockCurrentUser));
    notifyAuthObservers();
    return mockCurrentUser;
  }
  throw new Error("Invalid admin credentials. Use admin@mayiljewels.com / password.");
}

export async function signoutFirebase(): Promise<void> {
  if (auth) {
    await signOut(auth);
    return;
  }

  mockCurrentUser = null;
  localStorage.removeItem(LOCAL_USER_KEY);
  notifyAuthObservers();
}

// Export raw services if needed elsewhere
export { auth, db };
