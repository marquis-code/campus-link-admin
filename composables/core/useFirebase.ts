import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const useFirebase = () => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  const isConfigured = !!firebaseConfig.apiKey;
  let app: any = null;
  let auth: any = null;
  let provider: any = null;

  try {
    if (isConfigured) {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      provider = new GoogleAuthProvider();
    }
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }

  const loginWithGoogle = async () => {
    if (!isConfigured || !auth || !provider) {
      throw new Error("Firebase is not configured. Missing environment variables.");
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      return idToken;
    } catch (error) {
      console.error("Firebase Social Login Failed", error);
      throw error;
    }
  };

  return {
    loginWithGoogle,
  };
};
