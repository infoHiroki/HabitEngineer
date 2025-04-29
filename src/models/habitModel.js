/**
 * 習慣データのモデル定義
 * 
 * id: 一意の識別子
 * name: 習慣の名前
 * description: 習慣の説明
 * frequency: 習慣の頻度（daily, weekly, custom）
 * targetDays: 頻度がcustomの場合、対象となる曜日（0-6, 0は日曜）
 * createdAt: 作成日時
 * completedDates: 完了した日付のリスト（ISO形式の日付文字列）
 * color: 習慣に関連付けられた色
 * streak: 現在の連続達成日数
 * active: 習慣がアクティブかどうか
 */

/**
 * 新しい習慣オブジェクトを作成する
 * @param {Object} habitData - 習慣データ
 * @returns {Object} - 習慣オブジェクト
 */
export const createHabit = (habitData) => {
  const now = new Date().toISOString();
  
  // ユーザーIDが必ず含まれるように確認
  if (!habitData.userId) {
    console.error('警告: userIdが指定されていません');
  }
  
  return {
    // 一意のIDはクライアント側で事前生成しないようにする
    // Firestoreが生成するIDを使用する
    name: habitData.name || '',
    description: habitData.description || '',
    frequency: habitData.frequency || 'daily',
    targetDays: habitData.targetDays || [0, 1, 2, 3, 4, 5, 6],
    createdAt: habitData.createdAt || now,
    completedDates: habitData.completedDates || [],
    color: habitData.color || '#4285F4', // デフォルトは青色
    streak: habitData.streak || 0,
    active: habitData.active !== undefined ? habitData.active : true,
    userId: habitData.userId, // 重要: ユーザーIDを確実に含める
  };
};

/**
 * 習慣の完了状態を確認する
 * @param {Object} habit - 習慣オブジェクト
 * @param {string} dateString - ISO形式の日付文字列
 * @returns {boolean} - 指定した日付に習慣が完了しているかどうか
 */
export const isHabitCompletedOnDate = (habit, dateString) => {
  return habit.completedDates.includes(dateString);
};

/**
 * 習慣が指定した日に対象となるかどうかを確認する
 * @param {Object} habit - 習慣オブジェクト
 * @param {Date} date - 確認する日付
 * @returns {boolean} - 習慣が指定した日に対象となるかどうか
 */
export const isHabitDueOnDate = (habit, date) => {
  const dayOfWeek = date.getDay();

  if (habit.frequency === 'daily') {
    return true;
  }

  if (habit.frequency === 'weekly') {
    // 週の初日（日曜）を対象とする
    return dayOfWeek === 0;
  }

  if (habit.frequency === 'custom') {
    return habit.targetDays.includes(dayOfWeek);
  }

  return false;
};

/**
 * 習慣の連続達成日数を計算する
 * @param {Object} habit - 習慣オブジェクト
 * @returns {number} - 連続達成日数
 */
export const calculateStreak = (habit) => {
  if (!habit.completedDates.length) {
    return 0;
  }

  // 完了日を降順にソート
  const sortedDates = [...habit.completedDates].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 1;
  let currentDate = new Date(sortedDates[0]);
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i]);
    const diffDays = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 習慣の頻度に基づいて連続達成を判断
    if (habit.frequency === 'daily' && diffDays === 1) {
      streak++;
    } else if (habit.frequency === 'weekly' && diffDays === 7) {
      streak++;
    } else if (habit.frequency === 'custom') {
      // カスタム頻度の場合は別途ロジックが必要
      // ここでは簡略化のため、1日単位で計算
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    } else {
      break;
    }

    currentDate = prevDate;
  }

  return streak;
};
