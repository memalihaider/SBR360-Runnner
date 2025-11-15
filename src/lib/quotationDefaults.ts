import { db, convertDatesToTimestamps, convertTimestampsToDates } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const COLLECTION = 'userPreferences';

export async function saveQuotationDefaultsToCloud(userId: string, defaults: any) {
  if (!userId) return;
  try {
    const ref = doc(db, COLLECTION, userId);
    const payload = { quotationDefaults: convertDatesToTimestamps(defaults) };
    await setDoc(ref, payload, { merge: true });
  } catch (e) {
    console.error('Error saving quotation defaults to cloud:', e);
    throw e;
  }
}

export async function loadQuotationDefaultsFromCloud(userId: string): Promise<any | null> {
  if (!userId) return null;
  try {
    const ref = doc(db, COLLECTION, userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return data?.quotationDefaults ? convertTimestampsToDates(data.quotationDefaults) : null;
  } catch (e) {
    console.error('Error loading quotation defaults from cloud:', e);
    return null;
  }
}

export default {};
