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
    // 設定画面のデータ修正
    dataFix: 'データ修正',
    dataFixDescription: '不具合が発生した場合に使用してください。',
    fixHabitData: '習慣データ修正',
    fixing: '修正中...',
    fixSuccess: '件のデータを修正しました',
    fixError: 'エラー:',
    confirmDataFix: 'データ修正を実行しますか？\nこの処理は既存の習慣データにuserIDフィールドが欠けている場合に修正します。',
    // デバッグパネル
    debugPanel: 'デバッグパネル',
    viewAllDocs: '全ドキュメント表示',
    deleteDoc: 'ドキュメント削除',
    changeCompletionStatus: '完了状態変更',
    enterDocId: '削除するドキュメントIDを入力してください:',
    confirmDeleteDoc: '本当にドキュメント "%s" を削除しますか？',
    deletingDoc: 'ドキュメント %s を削除中...',
    docDeleted: 'ドキュメント %s を削除しました',
    enterHabitId: 'ドキュメントIDを入力してください:',
    enterDate: '日付を入力してください (YYYY-MM-DD形式):',
    changingStatus: 'ドキュメント %s の完了状態を変更中...',
    removingDate: '日付 %s を削除します',
    addingDate: '日付 %s を追加します',
    statusChanged: 'ドキュメント %s の完了状態を変更しました',
    completionDates: '変更後の完了日: %s',
    // 認証関連
    login: 'ログイン',
    signup: '新規登録',
    logout: 'ログアウト',
    loginWithGoogle: 'Googleでログイン',
    email: 'メールアドレス',
    password: 'パスワード',
    displayName: '表示名',
    noAccount: 'アカウントをお持ちでないですか？',
    hasAccount: '既にアカウントをお持ちですか？',
    loggedInAs: 'ログイン中:',
    account: 'アカウント',
    // デバッグパネルの追加翻訳
    loading: 'データを取得中...',
    notLoggedIn: 'エラー: ユーザーがログインしていません',
    documentsFound: '%s件のドキュメントが見つかりました:',
    name: '名前',
    userId: 'ユーザーID',
    completedDays: '完了日',
    unnamed: '名前なし',
    none: 'なし',
    // エラーメッセージ
    emailInUse: 'このメールアドレスは既に使用されています',
    invalidEmail: '無効なメールアドレスです',
    weakPassword: 'パスワードが弱すぎます',
    userNotFound: 'ユーザーが見つかりません',
    wrongPassword: 'パスワードが間違っています',
    tooManyRequests: 'アカウントが一時的に無効になっています。パスワードをリセットするか、後でもう一度お試しください',
    popupClosed: 'ログインウィンドウが閉じられました',
    popupCancelled: 'ログインリクエストがキャンセルされました',
    accountExistsWithDifferentCredential: '同じメールアドレスで別の認証方法が使用されています',
    authError: '認証エラーが発生しました',
    or: 'または'
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
    // Settings screen data fix
    dataFix: 'Data Fix',
    dataFixDescription: 'Use this when you encounter issues with the application.',
    fixHabitData: 'Fix Habit Data',
    fixing: 'Fixing...',
    fixSuccess: 'data items fixed',
    fixError: 'Error:',
    confirmDataFix: 'Do you want to execute data fix?\nThis process will fix habits that are missing the userID field.',
    // Debug panel
    debugPanel: 'Debug Panel',
    viewAllDocs: 'View All Documents',
    deleteDoc: 'Delete Document',
    changeCompletionStatus: 'Change Completion Status',
    enterDocId: 'Enter the document ID to delete:',
    confirmDeleteDoc: 'Are you sure you want to delete document "%s"?',
    deletingDoc: 'Deleting document %s...',
    docDeleted: 'Document %s has been deleted',
    enterHabitId: 'Enter the document ID:',
    enterDate: 'Enter the date (YYYY-MM-DD format):',
    changingStatus: 'Changing completion status of document %s...',
    removingDate: 'Removing date %s',
    addingDate: 'Adding date %s',
    statusChanged: 'Changed completion status of document %s',
    completionDates: 'Updated completion dates: %s',
    // Authentication
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    loginWithGoogle: 'Sign in with Google',
    email: 'Email',
    password: 'Password',
    displayName: 'Display Name',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    loggedInAs: 'Logged in as:',
    account: 'Account',
    // Additional debug panel translations
    loading: 'Loading data...',
    notLoggedIn: 'Error: User is not logged in',
    documentsFound: '%s documents found:',
    name: 'Name',
    userId: 'User ID',
    completedDays: 'Completed Days',
    unnamed: 'Unnamed',
    none: 'None',
    // Error messages
    emailInUse: 'This email is already in use',
    invalidEmail: 'Invalid email address',
    weakPassword: 'Password is too weak',
    userNotFound: 'User not found',
    wrongPassword: 'Incorrect password',
    tooManyRequests: 'Account temporarily disabled. Reset your password or try again later',
    popupClosed: 'Login window was closed',
    popupCancelled: 'Login request was cancelled',
    accountExistsWithDifferentCredential: 'An account already exists with the same email address but different sign-in credentials',
    authError: 'Authentication error occurred',
    or: 'or'
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