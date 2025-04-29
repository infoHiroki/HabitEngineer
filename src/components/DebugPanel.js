import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { Card, Button, Text } from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const DebugContainer = styled(Card)`
  margin-top: 16px;
  padding: 16px;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
`;

const ActionButton = styled(Button)`
  margin-right: 8px;
  margin-bottom: 8px;
`;

const ResultContainer = styled.div`
  margin-top: 16px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  white-space: pre-wrap;
`;

const DebugPanel = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Firestoreのデータをすべてリストアップするデバッグツール
  const listAllDocuments = async () => {
    setIsLoading(true);
    setResult(t.loading || 'データを取得中...');
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setResult(t.notLoggedIn || 'エラー: ユーザーがログインしていません');
        setIsLoading(false);
        return;
      }
      
      const habitsRef = collection(db, 'habits');
      const q = query(
        habitsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const foundCount = t.documentsFound || '%s件のドキュメントが見つかりました:';
      
      let resultText = foundCount.replace('%s', snapshot.docs.length) + '\n\n';
      snapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        resultText += `[${index + 1}] ID: ${doc.id}\n`;
        resultText += `  ${t.name || '名前'}: ${data.name || t.unnamed || '名前なし'}\n`;
        resultText += `  ${t.userId || 'ユーザーID'}: ${data.userId || t.none || 'なし'}\n`;
        resultText += `  ${t.completedDays || '完了日'}: ${(data.completedDates || []).join(', ') || t.none || 'なし'}\n`;
        resultText += '\n';
      });
      
      setResult(resultText);
    } catch (error) {
      setResult(`${t.fixError} ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 選択した習慣を直接削除するデバッグツール
  const deleteDocumentDirectly = async () => {
    const docId = window.prompt(t.enterDocId);
    if (!docId) return;
    
    const confirmMessage = t.confirmDeleteDoc.replace('%s', docId);
    if (!window.confirm(confirmMessage)) return;
    
    setIsLoading(true);
    const deletingMessage = t.deletingDoc.replace('%s', docId);
    setResult(deletingMessage);
    
    try {
      const docRef = doc(db, 'habits', docId);
      await deleteDoc(docRef);
      const deletedMessage = t.docDeleted.replace('%s', docId);
      setResult(deletedMessage);
    } catch (error) {
      setResult(`${t.fixError} ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 習慣の完了状態を直接切り替えるデバッグツール
  const toggleCompletionDirectly = async () => {
    const docId = window.prompt(t.enterHabitId);
    if (!docId) return;
    
    const dateString = window.prompt(t.enterDate);
    if (!dateString) return;
    
    setIsLoading(true);
    const changingMessage = t.changingStatus.replace('%s', docId);
    setResult(changingMessage);
    
    try {
      // 現在のドキュメントを取得
      const habitsRef = collection(db, 'habits');
      const q = query(habitsRef);
      const snapshot = await getDocs(q);
      const docSnapshot = snapshot.docs.find(doc => doc.id === docId);
      
      if (!docSnapshot) {
        setResult(`${t.fixError} ドキュメント ${docId} が見つかりません`);
        setIsLoading(false);
        return;
      }
      
      const data = docSnapshot.data();
      const completedDates = Array.isArray(data.completedDates) ? data.completedDates : [];
      
      // 完了状態を切り替え
      let updatedDates;
      if (completedDates.includes(dateString)) {
        updatedDates = completedDates.filter(date => date !== dateString);
        const removingMessage = t.removingDate.replace('%s', dateString);
        setResult(removingMessage);
      } else {
        updatedDates = [...completedDates, dateString];
        const addingMessage = t.addingDate.replace('%s', dateString);
        setResult(addingMessage);
      }
      
      // ドキュメント更新
      const docRef = doc(db, 'habits', docId);
      await updateDoc(docRef, {
        completedDates: updatedDates
      });
      
      const statusChangedMessage = t.statusChanged.replace('%s', docId);
      const completionDatesMessage = t.completionDates.replace('%s', updatedDates.join(', ') || t.none);
      setResult(`${statusChangedMessage}\n${completionDatesMessage}`);
    } catch (error) {
      setResult(`${t.fixError} ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DebugContainer>
      <Title>{t.debugPanel}</Title>
      
      <div>
        <ActionButton 
          onClick={listAllDocuments}
          disabled={isLoading}
        >
          {t.viewAllDocs}
        </ActionButton>
        
        <ActionButton 
          onClick={deleteDocumentDirectly}
          disabled={isLoading}
        >
          {t.deleteDoc}
        </ActionButton>
        
        <ActionButton 
          onClick={toggleCompletionDirectly}
          disabled={isLoading}
        >
          {t.changeCompletionStatus}
        </ActionButton>
      </div>
      
      {result && (
        <ResultContainer>
          {result}
        </ResultContainer>
      )}
    </DebugContainer>
  );
};

export default DebugPanel;