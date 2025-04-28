import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEllipsisV, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { Card, FlexContainer, Text, IconButton, Button } from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDateToLocalYYYYMMDD, isToday } from '../utils/dateUtils';

// スタイル付きコンポーネント
const HabitListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const HabitCard = styled(Card)`
  position: relative;
  transition: all ${({ theme }) => theme.transitions.duration.standard} ${({ theme }) => theme.transitions.easing};
  border-left: 4px solid ${({ color }) => color || 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const HabitHeader = styled(FlexContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const HabitName = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  font-size: 1.1rem;
  margin: 0;
`;

const HabitDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  font-size: 0.9rem;
`;

const HabitStreak = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.5)};
  padding: ${({ theme }) => `${theme.spacing(0.25)} ${theme.spacing(1)}`};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => `${theme.colors.accent}20`};
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
`;

const MenuButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing(1)};
  right: ${({ theme }) => theme.spacing(1)};
`;

const AddHabitButton = styled(Button)`
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const EmptyState = styled(FlexContainer)`
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
`;

const CompleteButton = styled(IconButton)`
  color: ${({ completed, theme }) => 
    completed ? theme.colors.secondary : theme.colors.text.disabled};
  font-size: 1.5rem;
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing(5)};
  right: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: 10;
  overflow: hidden;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme, danger }) => danger ? theme.colors.error : theme.colors.text.primary};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.elevated};
  }
`;

/**
 * 習慣リストコンポーネント
 * 習慣の一覧を表示し、完了状態の切り替えや編集・削除が可能
 */
const HabitList = ({ habits, onToggleComplete, onAddHabit, onEditHabit, onDeleteHabit, selectedDate }) => {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(null);
  
  // デバッグ用ログ
  console.log('HabitListコンポーネント - 受け取ったhabits:', habits);
  console.log('HabitListコンポーネント - selectedDate:', selectedDate);
  
  // 今日の日付をYYYY-MM-DD形式で取得
  const today = formatDateToLocalYYYYMMDD(new Date());
  
  // 選択された日付、またはデフォルトで今日の日付
  const dateToShow = selectedDate || today;
  
  // メニューの表示/非表示を切り替える
  const toggleMenu = (habitId) => {
    setMenuOpen(menuOpen === habitId ? null : habitId);
  };
  
  // メニューの外側をクリックしたときにメニューを閉じる
  const handleClickOutside = () => {
    if (menuOpen) {
      setMenuOpen(null);
    }
  };
  
  // 完了状態の切り替え
  const handleToggleComplete = (habitId) => {
    console.log('完了状態の切り替えを呼び出します:', habitId, dateToShow);
    onToggleComplete(habitId, dateToShow);
  };
  
  // 編集ボタンがクリックされたとき
  const handleEdit = (habit) => {
    onEditHabit(habit);
    setMenuOpen(null);
  };
  
  // 削除ボタンがクリックされたとき
  const handleDelete = (habitId) => {
    console.log('削除ボタンがクリックされました:', habitId);
    onDeleteHabit(habitId);
    setMenuOpen(null);
  };
  
  // 習慣が空の場合の表示
  if (!habits || habits.length === 0) {
    console.log('HabitList: 習慣データが空です');
    return (
      <HabitListContainer>
        <EmptyState direction="column" align="center" justify="center">
          <Text variant="h5">{t.noHabits}</Text>
          <Text color="secondary">{t.addYourFirstHabit}</Text>
          <AddHabitButton onClick={onAddHabit}>
            <FaPlus size={14} />
            {t.addHabit}
          </AddHabitButton>
        </EmptyState>
      </HabitListContainer>
    );
  }
  
  return (
    <HabitListContainer onClick={handleClickOutside}>
      {habits.map(habit => {
        // 現在の習慣が選択された日付に完了しているかどうか
        const completedDates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
        const isCompleted = completedDates.includes(dateToShow);
        console.log(`習慣 ${habit.id} (${habit.name}) の完了状態:`, isCompleted, '日付:', dateToShow);
        console.log('完了日付一覧:', completedDates);
        
        return (
          <HabitCard key={habit.id} color={habit.color}>
            <HabitHeader justify="space-between" align="center">
              <FlexContainer align="center" gap={1}>
                <CompleteButton 
                  completed={isCompleted} 
                  onClick={() => {
                    console.log('完了ボタンクリック:', habit.id);
                    handleToggleComplete(habit.id);
                  }}
                >
                  {isCompleted ? <FaCheckCircle /> : <FaRegCircle />}
                </CompleteButton>
                <div>
                  <HabitName>{habit.name}</HabitName>
                  <HabitStreak>
                    {t.streak}: {habit.streak} {t.days}
                  </HabitStreak>
                </div>
              </FlexContainer>
              
              <MenuButton onClick={(e) => {
                e.stopPropagation();
                toggleMenu(habit.id);
              }}>
                <FaEllipsisV />
              </MenuButton>
              
              {menuOpen === habit.id && (
                <MenuDropdown>
                  <MenuItem onClick={() => handleEdit(habit)}>
                    {t.editHabit}
                  </MenuItem>
                  <MenuItem danger onClick={() => handleDelete(habit.id)}>
                    {t.deleteHabit}
                  </MenuItem>
                </MenuDropdown>
              )}
            </HabitHeader>
            
            {habit.description && (
              <HabitDescription>{habit.description}</HabitDescription>
            )}
          </HabitCard>
        );
      })}
      
      <AddHabitButton onClick={onAddHabit}>
        <FaPlus size={14} />
        {t.addHabit}
      </AddHabitButton>
    </HabitListContainer>
  );
};

export default HabitList;
