/**
 * 既存のFirestoreデータを修正するためのユーティリティ関数
 */
import { db, auth } from '../services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * 既存の習慣データにuserIdフィールドを追加する
 * @param {function} onComplete 完了時のコールバック
 */
export const fixHabitsUserIdField = async (onComplete = () => {}) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('修正できません: ユーザーがログインしていません');
      return;
    }

    // habits コレクションの全ドキュメントを取得
    const habitsRef = collection(db, 'habits');
    const snapshot = await getDocs(habitsRef);

    console.log(`${snapshot.docs.length}件のドキュメントを処理します...`);
    
    let updatedCount = 0;
    
    // 各ドキュメントをチェックして修正
    for (const docSnapshot of snapshot.docs) {
      const habitData = docSnapshot.data();
      
      // userIdフィールドが欠けている場合のみ更新
      if (!habitData.userId) {
        console.log(`ドキュメント ${docSnapshot.id} にuserIdを追加します...`);
        
        // ドキュメントを更新
        const docRef = doc(db, 'habits', docSnapshot.id);
        await updateDoc(docRef, {
          userId: currentUser.uid
        });
        
        updatedCount++;
        console.log(`ドキュメント ${docSnapshot.id} を更新しました`);
      }
    }
    
    console.log(`${updatedCount}件のドキュメントを更新しました`);
    onComplete(updatedCount);
    
  } catch (error) {
    console.error('データ修正エラー:', error);
    throw error;
  }
};
