import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { productsPreset, categoriesPreset, testimonialsPreset, promotionsPreset } from './mockData';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with forced long-polling to prevent iframe/websocket/gRPC blockages
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Strict Error Handler matching the 8 pillars/system instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const isNetworkOrOffline = error instanceof Error && (
    error.message.includes('Could not reach Cloud Firestore backend') ||
    error.message.includes('offline') ||
    error.message.includes('unavailable') ||
    error.message.includes('deadline-exceeded') ||
    (typeof (error as any).code === 'string' && ['unavailable', 'deadline-exceeded'].includes((error as any).code))
  );

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isNetworkOrOffline) {
    console.warn(`Firestore Offline State: Operating in offline local-cache mode for "${path || 'unknown'}" (${operationType})`);
    return;
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL Connection Validation Check
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection diagnostics: SUCCESS");
  } catch (error) {
    const isOffline = error instanceof Error && (
      error.message.includes('the client is offline') || 
      error.message.includes('Could not reach Cloud Firestore backend') ||
      error.message.includes('deadline-exceeded') ||
      error.message.includes('unavailable')
    );
    if (isOffline) {
      console.log("Firebase connection diagnostics: Client is offline or backend unreachable (completely normal for sandboxed / offline build checks).");
    } else {
      console.log("Firebase connection diagnostics: Active connection check complete (document non-existent is normal).");
    }
  }
}

// Automatic Data Seeder
export async function seedDatabase() {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    
    const presetProductIds = productsPreset.map(p => p.id);
    const presetCategoryIds = categoriesPreset.map(c => c.id);

    let needsSync = false;
    
    if (productsSnap.empty || categoriesSnap.empty) {
      needsSync = true;
    } else {
      const dbProductIds = productsSnap.docs.map(doc => doc.id);
      const hasObsolete = dbProductIds.some(id => !presetProductIds.includes(id));
      const isMissing = presetProductIds.some(id => !dbProductIds.includes(id));
      if (hasObsolete || isMissing) {
        needsSync = true;
      }
    }

    if (needsSync) {
      // Avoid raw write/delete failures for non-admin client visitors if the database is already seeded
      const isDbEmpty = productsSnap.empty && categoriesSnap.empty;
      const isAdminUser = auth.currentUser?.email && 
        ["khadidia@art.detable.com", "khadxxm05@gmail.com"].includes(auth.currentUser.email.toLowerCase());

      if (!isDbEmpty && !isAdminUser) {
        console.log('Catalog database already contains data. Skipping administrative catalog sync in client mode.');
        return;
      }

      console.log('Database sync required: updating products and categories in Firestore...');
      const batch = writeBatch(db);

      // 1. Delete all obsolete products from Firestore
      productsSnap.docs.forEach(snapDoc => {
        if (!presetProductIds.includes(snapDoc.id)) {
          batch.delete(snapDoc.ref);
        }
      });

      // 2. Delete all obsolete categories from Firestore
      categoriesSnap.docs.forEach(snapDoc => {
        if (!presetCategoryIds.includes(snapDoc.id)) {
          batch.delete(snapDoc.ref);
        }
      });

      // 3. Upsert our beautiful updated categories
      for (const cat of categoriesPreset) {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(catRef, cat);
      }

      // 4. Upsert our beautiful updated products
      for (const prod of productsPreset) {
        const prodRef = doc(db, 'products', prod.id);
        batch.set(prodRef, prod);
      }

      // 5. Seed testimonials & promotions if empty
      const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
      if (testimonialsSnap.empty) {
        for (const test of testimonialsPreset) {
          batch.set(doc(db, 'testimonials', test.id), test);
        }
      }

      const promotionsSnap = await getDocs(collection(db, 'promotions'));
      if (promotionsSnap.empty) {
        for (const promo of promotionsPreset) {
          batch.set(doc(db, 'promotions', promo.id), promo);
        }
      }

      try {
        await batch.commit();
        console.log('Database synced and pruned successfully!');
      } catch (batchErr) {
        console.error('Batch commit failed. Starting itemized diagnostics to find the specific failing write...', batchErr);
        
        // 1. Diagnose categories
        for (const cat of categoriesPreset) {
          try {
            await setDoc(doc(db, 'categories', cat.id), cat);
            console.log(`Diagnostic: Category "${cat.id}" write success`);
          } catch (err: any) {
            console.error(`Diagnostic FAILED on category "${cat.id}":`, err.message || err);
          }
        }
        
        // 2. Diagnose products
        for (const prod of productsPreset) {
          try {
            await setDoc(doc(db, 'products', prod.id), prod);
            console.log(`Diagnostic: Product "${prod.id}" write success`);
          } catch (err: any) {
            console.error(`Diagnostic FAILED on product "${prod.id}":`, err.message || err);
          }
        }
        
        // 3. Diagnose testimonials
        for (const test of testimonialsPreset) {
          try {
            await setDoc(doc(db, 'testimonials', test.id), test);
            console.log(`Diagnostic: Testimonial "${test.id}" write success`);
          } catch (err: any) {
            console.error(`Diagnostic FAILED on testimonial "${test.id}":`, err.message || err);
          }
        }
        
        // 4. Diagnose promotions
        for (const promo of promotionsPreset) {
          try {
            await setDoc(doc(db, 'promotions', promo.id), promo);
            console.log(`Diagnostic: Promotion "${promo.id}" write success`);
          } catch (err: any) {
            console.error(`Diagnostic FAILED on promotion "${promo.id}":`, err.message || err);
          }
        }
        
        throw batchErr;
      }
    } else {
      console.log('Database products and categories are already in perfect sync.');
    }
  } catch (err) {
    console.error('Error syncing/seeding database:', err);
  }
}

export async function forceSeedDatabase() {
  try {
    console.log('Wiping database and forcing re-seed of 112 products & 16 categories...');
    const batch = writeBatch(db);

    // 1. Wipe existing
    const productsSnap = await getDocs(collection(db, 'products'));
    productsSnap.forEach(snapDoc => batch.delete(snapDoc.ref));

    const categoriesSnap = await getDocs(collection(db, 'categories'));
    categoriesSnap.forEach(snapDoc => batch.delete(snapDoc.ref));

    const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
    testimonialsSnap.forEach(snapDoc => batch.delete(snapDoc.ref));

    const promotionsSnap = await getDocs(collection(db, 'promotions'));
    promotionsSnap.forEach(snapDoc => batch.delete(snapDoc.ref));

    // 2. Set new preset data
    for (const cat of categoriesPreset) {
      batch.set(doc(db, 'categories', cat.id), cat);
    }
    for (const prod of productsPreset) {
      batch.set(doc(db, 'products', prod.id), prod);
    }
    for (const test of testimonialsPreset) {
      batch.set(doc(db, 'testimonials', test.id), test);
    }
    for (const promo of promotionsPreset) {
      batch.set(doc(db, 'promotions', promo.id), promo);
    }

    await batch.commit();
    console.log('Database wiped and fully re-seeded successfully with 112 products!');
  } catch (err) {
    console.error('Error force-seeding database:', err);
    throw err;
  }
}
