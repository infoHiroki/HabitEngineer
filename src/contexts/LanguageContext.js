import React, { createContext, useState, useContext, useEffect } from 'react';

// 言語オプション
export const LANGUAGES = {
  JA: 'ja',
  EN: 'en'
};

// 翻訳データ
export const translations = {
  [LANGUAGES.JA]: {
    appName: 'HabitEngineer',
    habits: '習慣',
    stats: '統計',
    settings: '設定',
    addHabit: '習慣を追加',
    editHabit: '習慣を編集',
    deleteHabit: '習慣を削除',
    habitName: '習慣名',
    description: '説明',
    frequency: '頻度',
    daily: '毎日',
    weekly: '毎週',
    custom: 'カスタム',
    targetDays: '対象曜日',
    color: '色',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    confirmDelete: '本当に削除しますか？',
    yes: 'はい',
    no: 'いいえ',
    today: '今日',
    completed: '完了',
    streak: '連続達成',
    days: '日',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    language: '言語',
    japanese: '日本語',
    english: '英語',
    completionRate: '達成率',
    totalHabits: '習慣の総数',
    activeHabits: 'アクティブな習慣',
    longestStreak: '最長連続達成',
    currentStreak: '現在の連続達成',
    weeklyAverage: '週間平均',
    sunday: '日',
    monday: '月',
    tuesday: '火',
    wednesday: '水',
    thursday: '木',
    friday: '金',
    saturday: '土',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月',
    noHabits: '習慣がありません',
    addYourFirstHabit: '最初の習慣を追加しましょう',
    // 認証関連
    login: 'ログイン',
    signup: '新規登録',
    logout: 'ログアウト',
    email: 'メールアドレス',
    password: 'パスワード',
    displayName: '表示名',
    noAccount: 'アカウントをお持ちでないですか？',
    hasAccount: '既にアカウントをお持ちですか？',
    loggedInAs: 'ログイン中:',
    account: 'アカウント',
    // エラーメッセージ
    emailInUse: 'このメールアドレスは既に使用されています',
    invalidEmail: '無効なメールアドレスです',
    weakPassword: 'パスワードが弱すぎます',
    userNotFound: 'ユーザーが見つかりません',
    wrongPassword: 'パスワードが間違っています',
    tooManyRequests: 'アカウントが一時的に無効になっています。パスワードをリセットするか、後でもう一度お試しください',
    authError: '認証エラーが発生しました',
  },
  [LANGUAGES.EN]: {
    appName: 'HabitEngineer',
    habits: 'Habits',
    stats: 'Stats',
    settings: 'Settings',
    addHabit: 'Add Habit',
    editHabit: 'Edit Habit',
    deleteHabit: 'Delete Habit',
    habitName: 'Habit Name',
    description: 'Description',
    frequency: 'Frequency',
    daily: 'Daily',
    weekly: 'Weekly',
    custom: 'Custom',
    targetDays: 'Target Days',
    color: 'Color',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete?',
    yes: 'Yes',
    no: 'No',
    today: 'Today',
    completed: 'Completed',
    streak: 'Streak',
    days: 'days',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    japanese: 'Japanese',
    english: 'English',
    completionRate: 'Completion Rate',
    totalHabits: 'Total Habits',
    activeHabits: 'Active Habits',
    longestStreak: 'Longest Streak',
    currentStreak: 'Current Streak',
    weeklyAverage: 'Weekly Average',
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    noHabits: 'No Habits',
    addYourFirstHabit: 'Add Your First Habit',
    // Authentication
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    displayName: 'Display Name',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    loggedInAs: 'Logged in as:',
    account: 'Account',
    // Error messages
    emailInUse: 'This email is already in use',
    invalidEmail: 'Invalid email address',
    weakPassword: 'Password is too weak',
    userNotFound: 'User not found',
    wrongPassword: 'Incorrect password',
    tooManyRequests: 'Account temporarily disabled. Reset your password or try again later',
    authError: 'Authentication error occurred',
  }
};

// 言語コンテキスト作成
const LanguageContext = createContext();

// 言語プロバイダーコンポーネント
export const LanguageProvider = ({ children }) => {
  // ブラウザの言語設定または保存された言語設定を取得
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && Object.values(LANGUAGES).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // ブラウザの言語設定を取得
    const browserLanguage = navigator.language.split('-')[0];
    return browserLanguage === 'ja' ? LANGUAGES.JA : LANGUAGES.EN;
  });

  // 言語変更時にローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('language', language);
    // HTMLのlang属性を更新
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // 言語を変更する関数
  const changeLanguage = (lang) => {
    if (Object.values(LANGUAGES).includes(lang)) {
      setLanguage(lang);
    }
  };

  // 現在の言語の翻訳データ
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 言語を使うためのカスタムフック
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;