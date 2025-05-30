import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useLanguage } from './LanguageContext';

// 認証コンテキストを作成
const AuthContext = createContext();

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ユーザー登録
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // ユーザープロフィールの更新
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential.user;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ログイン
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Googleログイン
  const googleLogin = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ログアウト
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // エラーメッセージの取得
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return t.emailInUse || 'このメールアドレスは既に使用されています';
      case 'auth/invalid-email':
        return t.invalidEmail || '無効なメールアドレスです';
      case 'auth/weak-password':
        return t.weakPassword || 'パスワードが弱すぎます';
      case 'auth/user-not-found':
        return t.userNotFound || 'ユーザーが見つかりません';
      case 'auth/wrong-password':
        return t.wrongPassword || 'パスワードが間違っています';
      case 'auth/too-many-requests':
        return t.tooManyRequests || 'アカウントが一時的に無効になっています。パスワードをリセットするか、後でもう一度お試しください';
      case 'auth/popup-closed-by-user':
        return t.popupClosed || 'ログインウィンドウが閉じられました';
      case 'auth/cancelled-popup-request':
        return t.popupCancelled || 'ログインリクエストがキャンセルされました';
      case 'auth/account-exists-with-different-credential':
        return t.accountExistsWithDifferentCredential || '同じメールアドレスで別の認証方法が使用されています';
      default:
        return t.authError || '認証エラーが発生しました';
    }
  };

  // 認証状態の監視
  useEffect(() => {
    console.log('AuthContext - 認証状態の監視開始');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthContext - 認証状態変更:', user?.uid || 'no user');
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    googleLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 認証を使うためのカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;