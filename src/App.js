import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import StatsView from './components/StatsView';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import PrivateRoute from './components/PrivateRoute';
import useFirestoreHabits from './hooks/useFirestoreHabits';
import { getTodayFormatted } from './utils/dateUtils';
import { Container, FlexContainer } from './styles/CommonStyles';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing(3)} 0`};
`;

const ContentWrapper = styled(Container)`
  max-width: 800px;
`;

const CalendarWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing(2)};
`;

function App() {
  // Firestore連携の習慣データ管理フック
  const { 
    habits, 
    loading,
    addHabit, 
    updateHabit, 
    deleteHabit, 
    toggleHabitCompletion,
    getHabitsStatusForDate
  } = useFirestoreHabits();
  
  // アクティブなタブの状態
  const [activeTab, setActiveTab] = useState('habits');
  
  // モーダルの状態
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  
  // 選択された日付
  const [selectedDate, setSelectedDate] = useState(getTodayFormatted());
  
  // 習慣追加ボタンがクリックされたとき
  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowModal(true);
  };
  
  // 習慣編集ボタンがクリックされたとき
  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowModal(true);
  };
  
  // 習慣削除ボタンがクリックされたとき
  const handleDeleteHabit = (habitId) => {
    // 本来は確認ダイアログを表示する
    if (window.confirm('本当に削除しますか？')) {
      deleteHabit(habitId);
    }
  };
  
  // フォーム送信時
  const handleFormSubmit = (habitData) => {
    if (editingHabit) {
      // 既存の習慣を更新
      updateHabit(habitData.id, habitData);
    } else {
      // 新しい習慣を追加
      addHabit(habitData);
    }
    
    setShowModal(false);
  };
  
  // モーダルをキャンセルしたとき
  const handleCancelModal = () => {
    setShowModal(false);
  };
  
  // 日付が選択されたとき
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // 習慣タブに切り替え
    setActiveTab('habits');
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <GlobalStyles />
          <AppContainer>
            <Header />
            
            <MainContent>
              <PrivateRoute>
                <ContentWrapper>
                  {/* 習慣タブ */}
                  {activeTab === 'habits' && (
                    <>
                      <CalendarWrapper>
                        <CalendarView 
                          habits={habits}
                          selectedDate={selectedDate}
                          onDateSelect={handleDateSelect}
                          getHabitsStatusForDate={getHabitsStatusForDate}
                        />
                      </CalendarWrapper>
                      
                      <HabitList 
                        habits={habits}
                        onToggleComplete={toggleHabitCompletion}
                        onAddHabit={handleAddHabit}
                        onEditHabit={handleEditHabit}
                        onDeleteHabit={handleDeleteHabit}
                        selectedDate={selectedDate}
                      />
                    </>
                  )}
                  
                  {/* 統計タブ */}
                  {activeTab === 'stats' && (
                    <StatsView habits={habits} />
                  )}
                  
                  {/* 設定タブ */}
                  {activeTab === 'settings' && (
                    <Settings />
                  )}
                </ContentWrapper>
              </PrivateRoute>
            </MainContent>
            
            <Navigation 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
            
            {/* 習慣追加/編集モーダル */}
            {showModal && (
              <Modal onClick={handleCancelModal}>
                <div onClick={e => e.stopPropagation()}>
                  <HabitForm 
                    habit={editingHabit}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelModal}
                  />
                </div>
              </Modal>
            )}
          </AppContainer>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;