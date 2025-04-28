import { useState, useEffect } from 'react';
import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { createHabit, calculateStreak } from '../models/habitModel';

/**
 * Firebase Firestoreを使用して習慣データを管理するカスタムフック
 */
const useFirestoreHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // ユーザーの習慣コレクションの参照
  const habitsRef = collection(db, 'habits');

  // ユーザーのデータをリアルタイムで監視
  useEffect(() => {
    if (!currentUser) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // ユーザーIDに基づくクエリを作成
    const q = query(
      habitsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    // リアルタイム更新をリッスン
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const habitsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHabits(habitsList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('習慣データの取得エラー:', err);
        setError('習慣データの取得に失敗しました');
        setLoading(false);
      }
    );

    // コンポーネントのアンマウント時にリスナーを解除
    return () => unsubscribe();
  }, [currentUser]);

  /**
   * 新しい習慣を追加
   * @param {Object} habitData - 習慣データ
   */
  const addHabit = async (habitData) => {
    if (!currentUser) return null;

    try {
      const newHabit = createHabit({
        ...habitData,
        userId: currentUser.uid
      });

      const docRef = await addDoc(habitsRef, newHabit);
      return { id: docRef.id, ...newHabit };
    } catch (err) {
      console.error('習慣の追加エラー:', err);
      setError('習慣の追加に失敗しました');
      throw err;
    }
  };

  /**
   * 習慣を更新
   * @param {string} id - 習慣ID
   * @param {Object} updates - 更新データ
   */
  const updateHabit = async (id, updates) => {
    if (!currentUser) return;

    try {
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, updates);
    } catch (err) {
      console.error('習慣の更新エラー:', err);
      setError('習慣の更新に失敗しました');
      throw err;
    }
  };

  /**
   * 習慣を削除
   * @param {string} id - 習慣ID
   */
  const deleteHabit = async (id) => {
    if (!currentUser) return;

    try {
      const habitRef = doc(db, 'habits', id);
      await deleteDoc(habitRef);
    } catch (err) {
      console.error('習慣の削除エラー:', err);
      setError('習慣の削除に失敗しました');
      throw err;
    }
  };

  /**
   * 習慣の完了状態を切り替え
   * @param {string} id - 習慣ID
   * @param {string} dateString - ISO形式の日付文字列
   */
  const toggleHabitCompletion = async (id, dateString) => {
    if (!currentUser) return;

    try {
      const habit = habits.find(h => h.id === id);
      if (!habit) return;

      let updatedCompletedDates;
      if (habit.completedDates.includes(dateString)) {
        // 完了を取り消す
        updatedCompletedDates = habit.completedDates.filter(date => date !== dateString);
      } else {
        // 完了を追加
        updatedCompletedDates = [...habit.completedDates, dateString];
      }

      // 更新された習慣データ
      const updatedHabit = {
        ...habit,
        completedDates: updatedCompletedDates,
        streak: calculateStreak({
          ...habit,
          completedDates: updatedCompletedDates
        })
      };

      // Firestoreで更新
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, {
        completedDates: updatedCompletedDates,
        streak: updatedHabit.streak
      });
    } catch (err) {
      console.error('習慣の完了状態更新エラー:', err);
      setError('習慣の完了状態の更新に失敗しました');
      throw err;
    }
  };

  /**
   * 特定の日付の習慣達成状況を取得
   * @param {string} dateString - ISO形式の日付文字列
   * @returns {Object} - 日付ごとの習慣達成状況
   */
  const getHabitsStatusForDate = (dateString) => {
    const date = new Date(dateString);
    const result = {
      total: 0,
      completed: 0,
      habits: []
    };

    habits.forEach(habit => {
      if (habit.active) {
        const isCompleted = habit.completedDates.includes(dateString);
        result.habits.push({
          id: habit.id,
          name: habit.name,
          completed: isCompleted
        });
        
        result.total++;
        if (isCompleted) {
          result.completed++;
        }
      }
    });

    result.completionRate = result.total > 0 
      ? Math.round((result.completed / result.total) * 100) 
      : 0;

    return result;
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitsStatusForDate
  };
};

export default useFirestoreHabits;