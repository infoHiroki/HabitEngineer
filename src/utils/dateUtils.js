/**
 * 日付操作のユーティリティ関数
 */

// 曜日の配列（日本語）
export const DAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];

// 曜日の配列（英語）
export const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 月の配列（日本語）
export const MONTHS_JP = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

// 月の配列（英語）
export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * 日付をYYYY-MM-DD形式の文字列に変換
 * @param {Date} date - 日付オブジェクト
 * @returns {string} - YYYY-MM-DD形式の文字列
 */
export const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 日付をYYYY-MM-DD形式の文字列に変換し、ローカルタイムゾーンを考慮
 * @param {Date} date - 日付オブジェクト
 * @returns {string} - YYYY-MM-DD形式の文字列
 */
export const formatDateToLocalYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD形式の文字列から日付オブジェクトを作成
 * @param {string} dateString - YYYY-MM-DD形式の文字列
 * @returns {Date} - 日付オブジェクト
 */
export const parseYYYYMMDDToDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 * @returns {string} - 今日の日付（YYYY-MM-DD形式）
 */
export const getTodayFormatted = () => {
  return formatDateToLocalYYYYMMDD(new Date());
};

/**
 * 2つの日付の間の日数を計算
 * @param {Date|string} dateA - 日付Aまたは日付文字列
 * @param {Date|string} dateB - 日付Bまたは日付文字列
 * @returns {number} - 日数差
 */
export const getDaysDifference = (dateA, dateB) => {
  const dateAObj = dateA instanceof Date ? dateA : parseYYYYMMDDToDate(dateA);
  const dateBObj = dateB instanceof Date ? dateB : parseYYYYMMDDToDate(dateB);
  
  // 時間、分、秒をリセットして日付だけを比較
  const dateAResetTime = new Date(dateAObj.getFullYear(), dateAObj.getMonth(), dateAObj.getDate());
  const dateBResetTime = new Date(dateBObj.getFullYear(), dateBObj.getMonth(), dateBObj.getDate());
  
  const difference = Math.abs(dateAResetTime - dateBResetTime);
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

/**
 * 指定された日数分、日付を加算または減算
 * @param {Date} date - 基準となる日付
 * @param {number} days - 加算日数（負の値で減算）
 * @returns {Date} - 計算後の日付
 */
export const addDaysToDate = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 現在の週の日付を配列で取得（日曜始まり）
 * @param {Date} [baseDate=new Date()] - 基準となる日付
 * @returns {Array<Date>} - 週の日付の配列
 */
export const getCurrentWeekDates = (baseDate = new Date()) => {
  const current = new Date(baseDate);
  const dayOfWeek = current.getDay();
  
  // 週の初日（日曜）を計算
  const sunday = new Date(current);
  sunday.setDate(current.getDate() - dayOfWeek);
  
  // 週の各日を配列に格納
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

/**
 * 月の最初の日と最後の日を取得
 * @param {number} year - 年
 * @param {number} month - 月（0-11）
 * @returns {Object} - 月の最初と最後の日
 */
export const getMonthStartAndEnd = (year, month) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
};

/**
 * 月のカレンダーに表示する日付の配列を取得
 * @param {number} year - 年
 * @param {number} month - 月（0-11）
 * @returns {Array<Date>} - カレンダーに表示する日付の配列
 */
export const getCalendarDates = (year, month) => {
  const { start, end } = getMonthStartAndEnd(year, month);
  
  const dates = [];
  
  // 月の初日の曜日（0:日曜, 1:月曜, ..., 6:土曜）
  const firstDayOfWeek = start.getDay();
  
  // 前月の日を追加
  for (let i = 0; i < firstDayOfWeek; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() - (firstDayOfWeek - i));
    dates.push(date);
  }
  
  // 当月の日を追加
  for (let i = 1; i <= end.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }
  
  // 翌月の日を追加（6行×7列=42マスになるように）
  const daysToAdd = 42 - dates.length;
  for (let i = 1; i <= daysToAdd; i++) {
    const date = new Date(end);
    date.setDate(end.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

/**
 * 日付が今日かどうかを判定
 * @param {Date} date - 判定する日付
 * @returns {boolean} - 今日ならtrue
 */
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * 日付が同じ月かどうかを判定
 * @param {Date} date - 判定する日付
 * @param {number} month - 月（0-11）
 * @param {number} year - 年
 * @returns {boolean} - 同じ月ならtrue
 */
export const isSameMonth = (date, month, year) => {
  return date.getMonth() === month && date.getFullYear() === year;
};
