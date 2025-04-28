/**
 * デバッグユーティリティ関数
 */

// デバッグモード（本番環境ではfalseにする）
export const DEBUG_MODE = true;

/**
 * デバッグログを出力する関数
 * @param {string} component - ログを出力するコンポーネント名
 * @param {string} message - ログメッセージ
 * @param {any} data - オプションのデータ
 */
export const logDebug = (component, message, data) => {
  if (!DEBUG_MODE) return;
  
  if (data !== undefined) {
    console.log(`[${component}] ${message}`, data);
  } else {
    console.log(`[${component}] ${message}`);
  }
};

/**
 * デバッグエラーを出力する関数
 * @param {string} component - ログを出力するコンポーネント名
 * @param {string} message - エラーメッセージ
 * @param {Error} error - エラーオブジェクト
 */
export const logError = (component, message, error) => {
  if (!DEBUG_MODE) return;
  
  console.error(`[ERROR] [${component}] ${message}`, error);
};

/**
 * リクエスト情報をログ出力する関数
 * @param {string} component - ログを出力するコンポーネント名
 * @param {string} operation - 操作名（例: GET, POST, DELETE）
 * @param {string} resource - リソース名
 * @param {any} params - パラメータ
 */
export const logRequest = (component, operation, resource, params) => {
  if (!DEBUG_MODE) return;
  
  console.log(`[${component}] ${operation} ${resource}`, params);
};

/**
 * レスポンス情報をログ出力する関数
 * @param {string} component - ログを出力するコンポーネント名
 * @param {string} operation - 操作名（例: GET, POST, DELETE）
 * @param {string} resource - リソース名
 * @param {any} data - レスポンスデータ
 */
export const logResponse = (component, operation, resource, data) => {
  if (!DEBUG_MODE) return;
  
  console.log(`[${component}] ${operation} ${resource} RESPONSE:`, data);
};

/**
 * デバッグログをグループ化して出力する関数
 * @param {string} groupName - グループ名
 * @param {Function} loggerCallback - ログを出力するコールバック関数
 */
export const logGroup = (groupName, loggerCallback) => {
  if (!DEBUG_MODE) return;
  
  console.group(groupName);
  loggerCallback();
  console.groupEnd();
};
