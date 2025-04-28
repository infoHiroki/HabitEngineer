import { useState, useEffect, useCallback } from 'react';
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
  
  // 認証コンテキストを使用
  const auth = useAuth();
  const currentUser = auth?.currentUser;

  // ユーザーの習慣コレクションの参照
  const HABITS_COLLECTION = 'habits'; // Firestoreのコレクション名
  const habitsRef = collection(db, HABITS_COLLECTION);
  
  console.log('useFirestoreHabits初期化 - auth状態:', auth?.currentUser?.uid);
  console.log('Firestoreコレクション名:', HABITS_COLLECTION);

  // ユーザーのデータをリアルタイムで監視
  useEffect(() => {
    // 認証情報が取得できていない場合は処理しない
    if (!auth || auth.loading) {
      console.log('認証情報がロード中またはありません');
      return;
    }
    
    // ユーザーがログインしていない場合
    if (!currentUser) {
      console.log('ユーザーがログインしていません');
      setHabits([]);
      setLoading(false);
      return;
    }
    
    console.log('認証情報取得完了:', currentUser.uid);

    console.log('Firestoreからデータを取得開始...');
    setLoading(true);

    // ユーザーIDに基づくクエリを作成
    const q = query(
      habitsRef,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    console.log('クエリ作成:', currentUser.uid);

    // リアルタイム更新をリッスン
    console.log('リアルタイムリスナー設定開始', currentUser.uid);
    let isFirstLoad = true;
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('スナップショット受信:', isFirstLoad ? '初回読み込み' : '更新');
        console.log('Firestoreデータ更新:', snapshot.docs.length, '件');
        console.log('スナップショットタイプ:', snapshot.metadata.hasPendingWrites ? 'ローカル' : 'サーバー');
        
        if (snapshot.metadata.hasPendingWrites && !isFirstLoad) {
          console.log('ローカル変更のみなのでスキップします');
          return;
        }
        
        const habitsList = [];
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log(`ドキュメント ID: ${doc.id}`, data);
          // ここで必要なデータの始まり整備を行う
          if (!data.completedDates) {
            data.completedDates = [];
            console.log('注意: completedDatesが無いため空配列を設定');
          }
          
          habitsList.push({
            id: doc.id,
            ...data,
            completedDates: Array.isArray(data.completedDates) ? data.completedDates : [],
            streak: typeof data.streak === 'number' ? data.streak : 0,
            active: typeof data.active === 'boolean' ? data.active : true
          });
        });
        
        console.log('変換後のhabitsデータ:', habitsList);
        setHabits(habitsList);
        setLoading(false);
        setError(null);
        isFirstLoad = false;
      },
      (err) => {
        console.error('習慣データの取得エラー:', err);
        setError('習慣データの取得に失敗しました');
        setLoading(false);
      }
    );

    // コンポーネントのアンマウント時にリスナーを解除
    return () => unsubscribe();
  }, [currentUser, auth, habitsRef]); // habitsRefを依存配列に追加

  /**
   * 新しい習慣を追加
   * @param {Object} habitData - 習慣データ
   */
  const addHabit = useCallback(async (habitData) => {
    if (!currentUser) {
      console.log('ユーザーがログインしていないため、習慣を追加できません');
      return null;
    }

    try {
      console.log('習慣データを作成中...', habitData);
      // userIdが確実に含まれるようにする
      const newHabit = createHabit({
        ...habitData,
        userId: currentUser.uid
      });
      console.log('作成した習慣データ:', newHabit);
      console.log('ユーザーID確認:', newHabit.userId);

      console.log('Firestoreに保存中...');
      const docRef = await addDoc(habitsRef, newHabit);
      console.log('保存完了！ドキュメントID:', docRef.id);
      const addedHabit = { id: docRef.id, ...newHabit };
      
      // 追加されたデータを即座に確認
      console.log('追加完了後のデータを確認:', addedHabit);
      
      return addedHabit;
    } catch (err) {
      console.error('習慣の追加エラー:', err);
      setError('習慣の追加に失敗しました');
      throw err;
    }
  }, [currentUser, habitsRef]);

  /**
   * 習慣を更新
   * @param {string} id - 習慣ID
   * @param {Object} updates - 更新データ
   */
  const updateHabit = useCallback(async (id, updates) => {
    if (!currentUser) {
      console.log('ユーザーがログインしていないため、習慣を更新できません');
      return;
    }

    try {
      console.log('習慣を更新中...', id, updates);
      const habitRef = doc(db, 'habits', id);
      await updateDoc(habitRef, updates);
      console.log('習慣の更新が完了しました:', id, updates);
    } catch (err) {
      console.error('習慣の更新エラー:', err);
      setError('習慣の更新に失敗しました');
      throw err;
    }
  }, [currentUser]);

  /**
   * 習慣を削除
   * @param {string} id - 習慣ID
   */
  const deleteHabit = useCallback(async (id) => {
    if (!currentUser) {
      console.log('ユーザーがログインしていないため、習慣を削除できません');
      return;
    }

    try {
      console.log('習慣を削除中...', id);
      
      // 存在確認
      const habitExists = habits.some(habit => habit.id === id);
      if (!habitExists) {
        console.log('削除する習慣が見つかりません:', id);
        return;
      }
      
      // ドキュメント参照を作成して削除
      const habitRef = doc(db, 'habits', id);
      console.log('ドキュメント削除実行:', id);
      await deleteDoc(habitRef);
      console.log('習慣の削除が完了しました:', id);
    } catch (err) {
      console.error('習慣の削除エラー:', err);
      setError('習慣の削除に失敗しました');
      throw err;
    }
  }, [currentUser]);

  /**
   * 習慣の完了状態を切り替え
   * @param {string} id - 習慣ID
   * @param {string} dateString - ISO形式の日付文字列
   */
  const toggleHabitCompletion = useCallback(async (id, dateString) => {
    if (!currentUser) {
      console.log('ユーザーがログインしていないため、完了状態を変更できません');
      return;
    }

    try {
      console.log('習慣の完了状態を切り替え中...', id, dateString);
      const habit = habits.find(h => h.id === id);
      if (!habit) {
        console.log('該当する習慣が見つかりません:', id);
        return;
      }

      // completedDatesが配列であることを確認
      const completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
      console.log('現在の完了日:', completedDates);

      let updatedCompletedDates;
      if (completedDates.includes(dateString)) {
        // 完了を取り消す
        updatedCompletedDates = completedDates.filter(date => date !== dateString);
        console.log('完了を取り消します');
      } else {
        // 完了を追加
        updatedCompletedDates = [...completedDates, dateString];
        console.log('完了を追加します');
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
      console.log('更新後の習慣データ:', updatedHabit);

      // Firestoreで更新
      const habitRef = doc(db, 'habits', id);
      console.log('ドキュメント更新中:', id);
      
      // 更新データを明示的に確認
      const updateData = {
        completedDates: updatedCompletedDates,
        streak: updatedHabit.streak
      };
      console.log('送信する更新データ:', updateData);
      
      await updateDoc(habitRef, updateData);
      console.log('完了状態の更新が完了しました');
    } catch (err) {
      console.error('習慣の完了状態更新エラー:', err);
      setError('習慣の完了状態の更新に失敗しました');
      throw err;
    }
  }, [habits]);

  /**
   * 特定の日付の習慣達成状況を取得
   * @param {string} dateString - ISO形式の日付文字列
   * @returns {Object} - 日付ごとの習慣達成状況
   */
  const getHabitsStatusForDate = useCallback((dateString) => {
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
  }, [habits]);

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