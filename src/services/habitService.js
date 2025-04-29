/**
 * 習慣データのFirestore操作に関するサービス
 */
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { createHabit } from '../models/habitModel';

/**
 * ユーザーの習慣データを取得
 * @returns {Promise<Array>} 習慣データの配列
 */
export const fetchUserHabits = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('ユーザーがログインしていません');
      return [];
    }

    console.log('ユーザー習慣データを取得中:', currentUser.uid);
    const habitsRef = collection(db, 'habits');
    const q = query(
      habitsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    console.log('データ取得完了:', snapshot.docs.length, '件');

    // 各ドキュメントを正規化してマッピング
    const habits = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        frequency: data.frequency || 'daily',
        targetDays: Array.isArray(data.targetDays) ? data.targetDays : [0, 1, 2, 3, 4, 5, 6],
        createdAt: data.createdAt || new Date().toISOString(),
        completedDates: Array.isArray(data.completedDates) ? data.completedDates : [],
        color: data.color || '#4285F4',
        streak: typeof data.streak === 'number' ? data.streak : 0,
        active: typeof data.active === 'boolean' ? data.active : true,
        userId: data.userId || currentUser.uid,
      };
    });

    return habits;
  } catch (error) {
    console.error('習慣データの取得エラー:', error);
    throw error;
  }
};

/**
 * 新しい習慣を追加
 * @param {Object} habitData - 習慣データ
 * @returns {Promise<Object>} - 追加された習慣データ
 */
export const addHabit = async (habitData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('ユーザーがログインしていません');
      throw new Error('ユーザーがログインしていません');
    }

    console.log('習慣データを作成中...', habitData);
    const newHabit = createHabit({
      ...habitData,
      userId: currentUser.uid
    });
    console.log('正規化された習慣データ:', newHabit);

    // ユーザーIDを必ず含める
    if (!newHabit.userId) {
      newHabit.userId = currentUser.uid;
    }

    const habitsRef = collection(db, 'habits');
    const docRef = await addDoc(habitsRef, newHabit);
    console.log('習慣が追加されました:', docRef.id);

    // Firestoreが生成したIDを含めて返却
    return { 
      ...newHabit, 
      id: docRef.id 
    };
  } catch (error) {
    console.error('習慣の追加エラー:', error);
    throw error;
  }
};

/**
 * 習慣を更新
 * @param {string} id - 習慣ID
 * @param {Object} updates - 更新データ
 * @returns {Promise<void>}
 */
export const updateHabit = async (id, updates) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('ユーザーがログインしていません');
      throw new Error('ユーザーがログインしていません');
    }

    console.log('習慣を更新中...', id, updates);
    
    // 既存のデータを取得して確認
    const habitRef = doc(db, 'habits', id);
    const docSnap = await getDoc(habitRef);
    
    if (!docSnap.exists()) {
      console.error('更新する習慣が見つかりません:', id);
      throw new Error('習慣が見つかりません');
    }
    
    const data = docSnap.data();
    console.log('更新前のデータ:', data);
    
    // ユーザーIDを確認
    if (data.userId !== currentUser.uid) {
      console.error('このユーザーはこの習慣を更新する権限がありません');
      throw new Error('権限がありません');
    }
    
    await updateDoc(habitRef, updates);
    console.log('習慣の更新が完了しました:', id);
  } catch (error) {
    console.error('習慣の更新エラー:', error);
    throw error;
  }
};

/**
 * 習慣を削除
 * @param {string} id - 習慣ID
 * @returns {Promise<void>}
 */
export const deleteHabit = async (id) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('ユーザーがログインしていません');
      throw new Error('ユーザーがログインしていません');
    }

    console.log('習慣を削除中...', id);
    
    // 既存のデータを取得して確認
    const habitRef = doc(db, 'habits', id);
    const docSnap = await getDoc(habitRef);
    
    if (!docSnap.exists()) {
      console.error('削除する習慣が見つかりません:', id);
      throw new Error('習慣が見つかりません');
    }
    
    const data = docSnap.data();
    
    // ユーザーIDを確認
    if (data.userId !== currentUser.uid) {
      console.error('このユーザーはこの習慣を削除する権限がありません');
      throw new Error('権限がありません');
    }
    
    await deleteDoc(habitRef);
    console.log('習慣の削除が完了しました:', id);
  } catch (error) {
    console.error('習慣の削除エラー:', error);
    throw error;
  }
};

/**
 * 習慣の完了状態を切り替え
 * @param {string} id - 習慣ID
 * @param {string} dateString - ISO形式の日付文字列
 * @returns {Promise<Object>} - 更新された習慣データ
 */
export const toggleHabitCompletion = async (id, dateString) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('ユーザーがログインしていません');
      throw new Error('ユーザーがログインしていません');
    }

    console.log('習慣の完了状態を切り替え中...', id, dateString);
    
    // 既存のデータを取得して確認
    const habitRef = doc(db, 'habits', id);
    const docSnap = await getDoc(habitRef);
    
    if (!docSnap.exists()) {
      console.error('習慣が見つかりません:', id);
      throw new Error('習慣が見つかりません');
    }
    
    const data = docSnap.data();
    console.log('現在のデータ:', data);
    
    // ユーザーIDを確認
    if (data.userId !== currentUser.uid) {
      console.error('このユーザーはこの習慣を更新する権限がありません');
      throw new Error('権限がありません');
    }
    
    // completedDatesが配列であることを確認
    const completedDates = Array.isArray(data.completedDates) ? data.completedDates : [];
    console.log('現在の完了日:', completedDates);
    
    // 完了状態を切り替え
    let updatedDates;
    if (completedDates.includes(dateString)) {
      // 完了を取り消す
      updatedDates = completedDates.filter(date => date !== dateString);
      console.log('完了を取り消します:', dateString);
    } else {
      // 完了を追加
      updatedDates = [...completedDates, dateString];
      console.log('完了を追加します:', dateString);
    }
    
    console.log('更新する完了日:', updatedDates);
    
    // ストリークを再計算（ここでは簡易的な実装）
    let streak = 0;
    if (updatedDates.length > 0) {
      // 日付でソート
      const sortedDates = [...updatedDates].sort((a, b) => new Date(b) - new Date(a));
      streak = 1;
      
      // 連続した日数を計算（簡易実装）
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i-1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    // Firestoreで更新
    const updates = {
      completedDates: updatedDates,
      streak
    };
    
    console.log('更新データ:', updates);
    await updateDoc(habitRef, updates);
    console.log('完了状態の更新が完了しました');
    
    // 更新後のデータを返す
    return {
      ...data,
      id,
      completedDates: updatedDates,
      streak
    };
  } catch (error) {
    console.error('習慣の完了状態更新エラー:', error);
    throw error;
  }
};
