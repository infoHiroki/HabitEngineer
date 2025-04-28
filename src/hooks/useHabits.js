import { useState, useEffect } from 'react';
import { createHabit, calculateStreak } from '../models/habitModel';

/**
 * 習慣データを管理するカスタムフック
 * ローカルストレージを使用してデータを保存
 * 将来的にはFirebaseと連携
 */
const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初期化時にローカルストレージからデータを読み込む
  useEffect(() => {
    const loadHabits = () => {
      try {
        setLoading(true);
        const savedHabits = localStorage.getItem('habits');
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
        setError(null);
      } catch (err) {
        console.error('習慣データの読み込みエラー:', err);
        setError('習慣データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  // 習慣データが変更されたらローカルストレージに保存
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, loading]);

  /**
   * 新しい習慣を追加
   * @param {Object} habitData - 習慣データ
   */
  const addHabit = (habitData) => {
    const newHabit = createHabit(habitData);
    setHabits(prevHabits => [...prevHabits, newHabit]);
    return newHabit;
  };

  /**
   * 習慣を更新
   * @param {string} id - 習慣ID
   * @param {Object} updates - 更新データ
   */
  const updateHabit = (id, updates) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
  };

  /**
   * 習慣を削除
   * @param {string} id - 習慣ID
   */
  const deleteHabit = (id) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  /**
   * 習慣の完了状態を切り替え
   * @param {string} id - 習慣ID
   * @param {string} dateString - ISO形式の日付文字列
   */
  const toggleHabitCompletion = (id, dateString) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id !== id) return habit;

        let updatedCompletedDates;
        if (habit.completedDates.includes(dateString)) {
          // 完了を取り消す
          updatedCompletedDates = habit.completedDates.filter(date => date !== dateString);
        } else {
          // 完了を追加
          updatedCompletedDates = [...habit.completedDates, dateString];
        }

        // 連続達成日数を更新
        const updatedHabit = {
          ...habit,
          completedDates: updatedCompletedDates
        };
        
        updatedHabit.streak = calculateStreak(updatedHabit);
        
        return updatedHabit;
      })
    );
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

export default useHabits;
