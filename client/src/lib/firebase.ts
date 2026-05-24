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
import { normalizeProduct } from "@/lib/normalizeProduct";

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
    const parsed = JSON.parse(data) as Record<string, unknown>[];
    return parsed.map((p) => normalizeProduct(p));
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
        list.push(normalizeProduct({ ...d.data(), id: d.id }));
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
      await setDoc(doc(db, "products", id), updates as any, { merge: true });
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
      await setDoc(doc(db, "categories", id), updates as any, { merge: true });
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

// 3. WORLD COLLECTIONS SERVICES
import { worldCollections as initialWorldCollections } from "@/data/categories";
import type { WorldCollection, HeroBanner } from "@/types";

const LOCAL_WORLD_KEY = "mayil_world_collections_v2";
const LOCAL_BANNER_KEY = "mayil_hero_banners";

function getLocalWorldCollections(): WorldCollection[] {
  const data = localStorage.getItem(LOCAL_WORLD_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_WORLD_KEY, JSON.stringify(initialWorldCollections));
    return initialWorldCollections as WorldCollection[];
  }
  try {
    const list = JSON.parse(data) as WorldCollection[];
    return list.map((item) => {
      const seed = initialWorldCollections.find((w) => w.id === item.id);
      return { ...seed, ...item };
    });
  } catch {
    return initialWorldCollections as WorldCollection[];
  }
}

function saveLocalWorldCollections(items: WorldCollection[]) {
  localStorage.setItem(LOCAL_WORLD_KEY, JSON.stringify(items));
}

export async function getFirebaseWorldCollections(): Promise<WorldCollection[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "worldCollections"));
      if (!snap.empty) {
        const list: WorldCollection[] = [];
        snap.forEach((d) => {
          const item = d.data();
          const seed = initialWorldCollections.find((w) => w.id === d.id);
          
          const oldImages = [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop",
            "https://images.unsplash.com/photo-1617038260897-41a9ef663135?w=600&h=800&fit=crop",
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=800&fit=crop",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=800&fit=crop",
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1920&h=800&fit=crop&q=85",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&h=800&fit=crop&q=85",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=800&fit=crop&q=85",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920&h=800&fit=crop&q=85"
          ];

          const isOldImage = !item.image || oldImages.includes(item.image);
          const isOldBanner = !item.bannerImage || oldImages.includes(item.bannerImage);

          const finalImage = isOldImage && seed ? seed.image : item.image;
          const finalBannerImage = isOldBanner && seed ? seed.bannerImage : item.bannerImage;

          list.push({
            ...seed,
            ...item,
            image: finalImage,
            bannerImage: finalBannerImage,
            id: d.id
          } as WorldCollection);
        });
        list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        return list;
      }
      // Auto-seed
      for (let i = 0; i < initialWorldCollections.length; i++) {
        const w = initialWorldCollections[i];
        await setDoc(doc(db, "worldCollections", w.id), { ...w, order: i });
      }
      return initialWorldCollections as WorldCollection[];
    } catch (error) {
      console.error("Firestore getFirebaseWorldCollections failed:", error);
    }
  }
  return getLocalWorldCollections();
}

export async function addFirebaseWorldCollection(item: Omit<WorldCollection, "id"> & { id?: string }): Promise<WorldCollection> {
  const newId = item.id || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const final = { ...item, id: newId } as WorldCollection;
  if (db) {
    try { await setDoc(doc(db, "worldCollections", newId), final); return final; }
    catch (e) { console.error("addFirebaseWorldCollection failed:", e); throw e; }
  }
  const list = getLocalWorldCollections();
  list.push(final);
  saveLocalWorldCollections(list);
  return final;
}

export async function updateFirebaseWorldCollection(id: string, updates: Partial<WorldCollection>): Promise<void> {
  if (db) {
    try { await setDoc(doc(db, "worldCollections", id), updates as any, { merge: true }); return; }
    catch (e) { console.error("updateFirebaseWorldCollection failed:", e); throw e; }
  }
  const list = getLocalWorldCollections();
  const idx = list.findIndex(w => w.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; saveLocalWorldCollections(list); }
}

export async function deleteFirebaseWorldCollection(id: string): Promise<void> {
  if (db) {
    try { await deleteDoc(doc(db, "worldCollections", id)); return; }
    catch (e) { console.error("deleteFirebaseWorldCollection failed:", e); throw e; }
  }
  saveLocalWorldCollections(getLocalWorldCollections().filter(w => w.id !== id));
}

// 4. HERO BANNER SERVICES
const defaultBanners: HeroBanner[] = [
  {
    id: "summer-collection",
    title: "New Summer Collection",
    subtitle: "Discover our latest antique & imitation pieces crafted for the season",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&h=600&fit=crop",
    ctaText: "Shop Now",
    ctaHref: "/collections?new=true",
    active: true,
    order: 0,
  },
];

function getLocalBanners(): HeroBanner[] {
  const data = localStorage.getItem(LOCAL_BANNER_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_BANNER_KEY, JSON.stringify(defaultBanners));
    return defaultBanners;
  }
  try { return JSON.parse(data); } catch { return defaultBanners; }
}

function saveLocalBanners(items: HeroBanner[]) {
  localStorage.setItem(LOCAL_BANNER_KEY, JSON.stringify(items));
}

export async function getFirebaseBanners(): Promise<HeroBanner[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "banners"));
      if (!snap.empty) {
        const list: HeroBanner[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as HeroBanner));
        list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        return list;
      }
      for (const b of defaultBanners) {
        await setDoc(doc(db, "banners", b.id), b);
      }
      return defaultBanners;
    } catch (e) {
      console.error("getFirebaseBanners failed:", e);
    }
  }
  return getLocalBanners();
}

export async function addFirebaseBanner(item: Omit<HeroBanner, "id"> & { id?: string }): Promise<HeroBanner> {
  const newId = item.id || "banner-" + Date.now();
  const final = { ...item, id: newId } as HeroBanner;
  if (db) {
    try { await setDoc(doc(db, "banners", newId), final); return final; }
    catch (e) { throw e; }
  }
  const list = getLocalBanners(); list.push(final); saveLocalBanners(list); return final;
}

export async function updateFirebaseBanner(id: string, updates: Partial<HeroBanner>): Promise<void> {
  if (db) {
    try { await setDoc(doc(db, "banners", id), updates as any, { merge: true }); return; }
    catch (e) { throw e; }
  }
  const list = getLocalBanners();
  const idx = list.findIndex(b => b.id === id);
  if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; saveLocalBanners(list); }
}

export async function deleteFirebaseBanner(id: string): Promise<void> {
  if (db) {
    try { await deleteDoc(doc(db, "banners", id)); return; }
    catch (e) { throw e; }
  }
  saveLocalBanners(getLocalBanners().filter(b => b.id !== id));
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

// ==========================================
// 5. COUPONS SERVICES
// ==========================================
import type { Coupon } from "@/types";

const LOCAL_COUPONS_KEY = "mayil_mock_coupons";

const defaultCoupons: Coupon[] = [
  { id: "MAYIL10", discountType: "percentage", discountValue: 10, active: true },
  { id: "WELCOME100", discountType: "fixed", discountValue: 100, active: true },
];

function getLocalCoupons(): Coupon[] {
  const data = localStorage.getItem(LOCAL_COUPONS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(defaultCoupons));
    return defaultCoupons;
  }
  try { return JSON.parse(data); } catch { return defaultCoupons; }
}

function saveLocalCoupons(items: Coupon[]) {
  localStorage.setItem(LOCAL_COUPONS_KEY, JSON.stringify(items));
}

export async function getFirebaseCoupons(): Promise<Coupon[]> {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "coupons"));
      if (!snap.empty) {
        const list: Coupon[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Coupon));
        return list;
      }
      // Seed default coupons if collection is empty
      for (const c of defaultCoupons) {
        await setDoc(doc(db, "coupons", c.id), c);
      }
      return defaultCoupons;
    } catch (e) {
      console.error("getFirebaseCoupons failed, using local fallback:", e);
    }
  }
  return getLocalCoupons();
}

export async function addFirebaseCoupon(item: Coupon): Promise<Coupon> {
  const code = item.id.toUpperCase().trim();
  const final = { ...item, id: code } as Coupon;
  if (db) {
    try {
      await setDoc(doc(db, "coupons", code), final);
      return final;
    } catch (e) {
      console.error("addFirebaseCoupon failed:", e);
      throw e;
    }
  }
  const list = getLocalCoupons();
  if (list.some(c => c.id === code)) {
    throw new Error("Coupon code already exists");
  }
  list.push(final);
  saveLocalCoupons(list);
  return final;
}

export async function updateFirebaseCoupon(id: string, updates: Partial<Coupon>): Promise<void> {
  if (db) {
    try {
      await setDoc(doc(db, "coupons", id), updates as any, { merge: true });
      return;
    } catch (e) {
      console.error("updateFirebaseCoupon failed:", e);
      throw e;
    }
  }
  const list = getLocalCoupons();
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updates };
    saveLocalCoupons(list);
  }
}

export async function deleteFirebaseCoupon(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, "coupons", id));
      return;
    } catch (e) {
      console.error("deleteFirebaseCoupon failed:", e);
      throw e;
    }
  }
  saveLocalCoupons(getLocalCoupons().filter(c => c.id !== id));
}

export async function validateFirebaseCoupon(code: string): Promise<Coupon | null> {
  const cleanCode = code.toUpperCase().trim();
  if (db) {
    try {
      const docRef = doc(db, "coupons", cleanCode);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const coupon = snap.data() as Coupon;
        if (coupon.active) return { ...coupon, id: snap.id };
      }
      return null;
    } catch (e) {
      console.error("validateFirebaseCoupon failed, checking local:", e);
    }
  }
  const localList = getLocalCoupons();
  const coupon = localList.find(c => c.id === cleanCode);
  if (coupon && coupon.active) return coupon;
  return null;
}

// ==========================================
// 6. DELIVERY SETTINGS SERVICES
// ==========================================
export type DeliverySettings = {
  itemCharges: { count: number; charge: number }[];
  freeThreshold: number;
};

const LOCAL_DELIVERY_SETTINGS_KEY = "mayil_delivery_settings";

const defaultDeliverySettings: DeliverySettings = {
  itemCharges: [
    { count: 1, charge: 0 }
  ],
  freeThreshold: 0,
};

export async function getFirebaseDeliverySettings(): Promise<DeliverySettings> {
  if (db) {
    try {
      const docRef = doc(db, "settings", "delivery");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as DeliverySettings;
      }
      // Seed default settings if empty
      await setDoc(docRef, defaultDeliverySettings);
      return defaultDeliverySettings;
    } catch (e) {
      console.error("getFirebaseDeliverySettings failed, using local:", e);
    }
  }
  const data = localStorage.getItem(LOCAL_DELIVERY_SETTINGS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_DELIVERY_SETTINGS_KEY, JSON.stringify(defaultDeliverySettings));
    return defaultDeliverySettings;
  }
  try { return JSON.parse(data); } catch { return defaultDeliverySettings; }
}

export async function updateFirebaseDeliverySettings(settings: DeliverySettings): Promise<void> {
  if (db) {
    try {
      const docRef = doc(db, "settings", "delivery");
      await setDoc(docRef, settings, { merge: true });
      return;
    } catch (e) {
      console.error("updateFirebaseDeliverySettings failed:", e);
      throw e;
    }
  }
  localStorage.setItem(LOCAL_DELIVERY_SETTINGS_KEY, JSON.stringify(settings));
}

// ==========================================
// 7. ENQUIRIES (LEADS) SERVICES
// ==========================================
export type Enquiry = {
  id?: string;
  name: string;
  phone: string;
  createdAt: number;
  status: "new" | "contacted" | "resolved";
};

const LOCAL_ENQUIRIES_KEY = "mayil_mock_enquiries";

function getLocalEnquiries(): Enquiry[] {
  const data = localStorage.getItem(LOCAL_ENQUIRIES_KEY);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

function saveLocalEnquiries(items: Enquiry[]) {
  localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(items));
}

export async function getFirebaseEnquiries(): Promise<Enquiry[]> {
  if (db) {
    try {
      const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: Enquiry[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Enquiry));
      return list;
    } catch (e) {
      console.error("getFirebaseEnquiries failed, using local:", e);
    }
  }
  return getLocalEnquiries().sort((a, b) => b.createdAt - a.createdAt);
}

export async function addFirebaseEnquiry(item: Omit<Enquiry, "id" | "createdAt" | "status">): Promise<Enquiry> {
  const newEnquiry: Enquiry = {
    ...item,
    createdAt: Date.now(),
    status: "new",
  };
  
  if (db) {
    try {
      const docRef = await addDoc(collection(db, "enquiries"), newEnquiry);
      return { ...newEnquiry, id: docRef.id };
    } catch (e) {
      console.error("addFirebaseEnquiry failed:", e);
    }
  }
  const final = { ...newEnquiry, id: String(Date.now()) };
  const list = getLocalEnquiries();
  list.push(final);
  saveLocalEnquiries(list);
  return final;
}

export async function updateFirebaseEnquiryStatus(id: string, status: Enquiry["status"]): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, "enquiries", id), { status });
      return;
    } catch (e) {
      console.error("updateFirebaseEnquiryStatus failed:", e);
    }
  }
  const list = getLocalEnquiries();
  const idx = list.findIndex(e => e.id === id);
  if (idx !== -1) {
    list[idx].status = status;
    saveLocalEnquiries(list);
  }
}

export async function deleteFirebaseEnquiry(id: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, "enquiries", id));
      return;
    } catch (e) {
      console.error("deleteFirebaseEnquiry failed:", e);
    }
  }
  saveLocalEnquiries(getLocalEnquiries().filter(e => e.id !== id));
}

// Export raw services if needed elsewhere
export { auth, db };
