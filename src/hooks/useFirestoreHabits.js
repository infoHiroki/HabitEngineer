import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as habitService from '../services/habitService';

/**
 * Firebase Firestoreを使用して習慣データを管理するカスタムフック
 * habitServiceを使用して実装
 */
const useFirestoreHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 認証コンテキストを使用
  const auth = useAuth();
  const currentUser = auth?.currentUser;

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
    
    console.log('データ取得開始：', currentUser.uid);
    setLoading(true);

    // ローカルストレージからキャッシュされたデータを取得
    const cachedData = localStorage.getItem(`habits_${currentUser.uid}`);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        const cacheTimestamp = localStorage.getItem(`habits_timestamp_${currentUser.uid}`);
        const now = Date.now();
        
        // キャッシュが5分以内の場合はキャッシュを使用
        if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < 300000) { // 5分 = 300000ミリ秒
          console.log('キャッシュからデータを読み込み:', parsedData.length, '件');
          setHabits(parsedData);
          setLoading(false);
          return; // キャッシュが有効な場合はリクエストを送らない
        }
      } catch (err) {
        console.error('キャッシュの解析エラー:', err);
        // キャッシュの解析に失敗した場合は無視して通常のフェッチを行う
      }
    }

    // データを取得
    const fetchHabits = async () => {
      try {
        const habitsData = await habitService.fetchUserHabits();
        console.log('取得したデータ:', habitsData);
        
        // ローカルストレージにデータをキャッシュ
        try {
          localStorage.setItem(`habits_${currentUser.uid}`, JSON.stringify(habitsData));
          localStorage.setItem(`habits_timestamp_${currentUser.uid}`, Date.now().toString());
        } catch (err) {
          console.error('キャッシュ保存エラー:', err);
        }
        
        setHabits(habitsData);
        setError(null);
      } catch (err) {
        console.error('習慣データの取得エラー:', err);
        setError('習慣データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();

    // コンポーネントのアンマウント時にクリーンアップ
    return () => {
      console.log('useFirestoreHabits クリーンアップ');
    };
  }, [currentUser, auth]);

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
      console.log('習慣データを追加中...', habitData);
      
      // habitServiceを使用して習慣を追加
      const newHabit = await habitService.addHabit(habitData);
      console.log('新しい習慣が追加されました:', newHabit);
      
      // ローカルの習慣配列を更新
      setHabits(prev => [newHabit, ...prev]);
      
      return newHabit;
    } catch (err) {
      console.error('習慣の追加エラー:', err);
      setError('習慣の追加に失敗しました');
      throw err;
    }
  }, [currentUser]);

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
      
      // habitServiceを使用して習慣を更新
      await habitService.updateHabit(id, updates);
      
      // ローカルの習慣配列を更新
      setHabits(prev => 
        prev.map(habit => 
          habit.id === id ? { ...habit, ...updates } : habit
        )
      );
      
      console.log('習慣の更新が完了しました');
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
      
      // habitServiceを使用して習慣を削除
      await habitService.deleteHabit(id);
      
      // ローカルの習慣配列を更新
      setHabits(prev => prev.filter(habit => habit.id !== id));
      
      console.log('習慣の削除が完了しました');
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
      
      // ローカル更新を先に行い、UIの反応を早くする
      const targetHabit = habits.find(habit => habit.id === id);
      if (!targetHabit) {
        throw new Error(`習慣ID ${id} が見つかりません`);
      }
      
      const completedDates = Array.isArray(targetHabit.completedDates) ? [...targetHabit.completedDates] : [];
      let updatedDates;
      
      if (completedDates.includes(dateString)) {
        // 完了を取り消す
        updatedDates = completedDates.filter(date => date !== dateString);
      } else {
        // 完了を追加
        updatedDates = [...completedDates, dateString];
      }
      
      // ストリークを再計算（簡易実装）
      let streak = 0;
      if (updatedDates.length > 0) {
        const sortedDates = [...updatedDates].sort((a, b) => new Date(b) - new Date(a));
        streak = 1;
        
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
      
      // ローカルの状態を先に更新（オプティミスティック更新）
      const updatedHabit = {
        ...targetHabit,
        completedDates: updatedDates,
        streak
      };
      
      setHabits(prev => 
        prev.map(habit => 
          habit.id === id ? updatedHabit : habit
        )
      );
      
      // ローカルストレージのキャッシュも更新
      try {
        const cachedData = localStorage.getItem(`habits_${currentUser.uid}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const updatedCache = parsedData.map(habit => 
            habit.id === id ? updatedHabit : habit
          );
          localStorage.setItem(`habits_${currentUser.uid}`, JSON.stringify(updatedCache));
          localStorage.setItem(`habits_timestamp_${currentUser.uid}`, Date.now().toString());
        }
      } catch (err) {
        console.error('キャッシュ更新エラー:', err);
      }
      
      // オフラインモードが有効かどうか確認
      if (!navigator.onLine) {
        console.log('オフラインモードです。ローカルのみ更新します');
        return updatedHabit;
      }
      
      // サーバー側での更新
      const serverUpdatedHabit = await habitService.toggleHabitCompletion(id, dateString);
      
      console.log('完了状態の更新が完了しました');
      return serverUpdatedHabit;
    } catch (err) {
      console.error('習慣の完了状態更新エラー:', err);
      setError('習慣の完了状態の更新に失敗しました');
      throw err;
    }
  }, [currentUser, habits]);

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
        const completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
        const isCompleted = completedDates.includes(dateString);
        
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

  /**
   * 全てのデータを再取得
   */
  const refreshHabits = useCallback(async () => {
    if (!currentUser) {
      console.log('ユーザーがログインしていないため、データを再取得できません');
      return;
    }

    try {
      setLoading(true);
      const habitsData = await habitService.fetchUserHabits();
      console.log('データを再取得しました:', habitsData);
      setHabits(habitsData);
      setError(null);
    } catch (err) {
      console.error('データ再取得エラー:', err);
      setError('データの再取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitsStatusForDate,
    refreshHabits
  };
};

export default useFirestoreHabits;