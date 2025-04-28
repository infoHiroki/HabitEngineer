import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FaCheck, FaCalendarAlt, FaChartLine, FaStopwatch } from 'react-icons/fa';
import { Card, FlexContainer, Text } from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDateToLocalYYYYMMDD, getTodayFormatted } from '../utils/dateUtils';

// スタイル付きコンポーネント
const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2.5)};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme, color }) => `${theme.colors[color || 'primary']}20`};
  color: ${({ theme, color }) => theme.colors[color || 'primary']};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  font-size: 1.5rem;
`;

const StatValue = styled(Text)`
  font-size: 2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  margin: ${({ theme }) => `${theme.spacing(0.5)} 0`};
`;

const StatLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
  text-align: center;
`;

const ProgressContainer = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  margin-top: ${({ theme }) => theme.spacing(1)};
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${({ percent }) => `${percent}%`};
  background-color: ${({ theme, color }) => theme.colors[color || 'primary']};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  transition: width 1s ease-in-out;
`;

/**
 * 統計情報表示コンポーネント
 * 習慣の達成状況や統計情報を表示
 */
const StatsView = ({ habits }) => {
  const { t } = useLanguage();
  const today = getTodayFormatted();
  
  // 統計情報の計算
  const stats = useMemo(() => {
    // 全習慣数
    const totalHabits = habits.length;
    
    // アクティブな習慣数
    const activeHabits = habits.filter(habit => habit.active).length;
    
    // 今日の完了率
    const todayHabits = habits.filter(habit => habit.active);
    const completedToday = todayHabits.filter(habit => 
      habit.completedDates.includes(today)
    ).length;
    
    const todayCompletionRate = todayHabits.length > 0 
      ? Math.round((completedToday / todayHabits.length) * 100) 
      : 0;
    
    // 最長の連続達成日数
    const longestStreak = habits.reduce((max, habit) => 
      habit.streak > max ? habit.streak : max, 0);
    
    // 全習慣の過去7日間の達成率
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return formatDateToLocalYYYYMMDD(date);
    });
    
    const weeklyCompletion = last7Days.map(date => {
      const dueHabits = habits.filter(habit => habit.active);
      if (dueHabits.length === 0) return 0;
      
      const completed = dueHabits.filter(habit => 
        habit.completedDates.includes(date)
      ).length;
      
      return Math.round((completed / dueHabits.length) * 100);
    });
    
    // 週間平均達成率
    const weeklyAverage = weeklyCompletion.reduce((sum, rate) => sum + rate, 0) / 7;
    
    return {
      totalHabits,
      activeHabits,
      todayCompletionRate,
      longestStreak,
      weeklyAverage: Math.round(weeklyAverage)
    };
  }, [habits, today]);
  
  return (
    <StatsContainer>
      <StatsGrid>
        <StatCard>
          <StatIcon color="primary">
            <FaCalendarAlt />
          </StatIcon>
          <StatValue>{stats.totalHabits}</StatValue>
          <StatLabel>{t.totalHabits}</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon color="secondary">
            <FaCheck />
          </StatIcon>
          <StatValue>{stats.todayCompletionRate}%</StatValue>
          <StatLabel>{t.completionRate}</StatLabel>
          <ProgressContainer>
            <ProgressBar 
              percent={stats.todayCompletionRate} 
              color="secondary" 
            />
          </ProgressContainer>
        </StatCard>
        
        <StatCard>
          <StatIcon color="accent">
            <FaStopwatch />
          </StatIcon>
          <StatValue>{stats.longestStreak}</StatValue>
          <StatLabel>{t.longestStreak}</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon color="primary">
            <FaChartLine />
          </StatIcon>
          <StatValue>{stats.weeklyAverage}%</StatValue>
          <StatLabel>{t.weeklyAverage || '週間平均'}</StatLabel>
          <ProgressContainer>
            <ProgressBar 
              percent={stats.weeklyAverage} 
              color="primary" 
            />
          </ProgressContainer>
        </StatCard>
      </StatsGrid>
    </StatsContainer>
  );
};

export default StatsView;
