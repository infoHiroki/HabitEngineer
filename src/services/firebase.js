// Firebase設定ファイル
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定情報
const firebaseConfig = {
  apiKey: "AIzaSyA1qGy9QMuEef9uKg_ObFihpgGHy_OjzWo",
  authDomain: "habitengineer-6b91f.firebaseapp.com",
  projectId: "habitengineer-6b91f",
  storageBucket: "habitengineer-6b91f.firebasestorage.app",
  messagingSenderId: "119309471654",
  appId: "1:119309471654:web:2e85708e1994294f444967",
  measurementId: "G-888HKN7NRJ"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// 各サービスのインスタンスをエクスポート
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;