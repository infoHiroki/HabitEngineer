import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarDay,
  FaCheckCircle
} from 'react-icons/fa';
import { 
  Card, 
  FlexContainer, 
  Text, 
  IconButton 
} from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getCalendarDates,
  isSameMonth,
  isToday,
  formatDateToLocalYYYYMMDD,
  DAYS_JP,
  DAYS_EN,
  MONTHS_JP,
  MONTHS_EN
} from '../utils/dateUtils';

// スタイル付きコンポーネント
const CalendarContainer = styled(Card)`
  padding: ${({ theme }) => theme.spacing(2)};
`;

const CalendarHeader = styled(FlexContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const MonthText = styled(Text)`
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  margin: 0;
`;

const WeekdayHeader = styled(FlexContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const WeekdayCell = styled.div`
  flex: 1;
  text-align: center;
  font-size: 0.8rem;
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing(0.5)};
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing(0.5)};
`;

const DayCell = styled.div`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  background-color: ${({ 
    isCurrentMonth, 
    isSelected, 
    isToday: isTodayProp, 
    theme 
  }) => {
    if (isSelected) return `${theme.colors.primary}20`;
    if (isTodayProp) return `${theme.colors.accent}20`;
    return isCurrentMonth ? 'transparent' : `${theme.colors.background.elevated}`;
  }};
  color: ${({ 
    isCurrentMonth, 
    theme 
  }) => isCurrentMonth ? theme.colors.text.primary : theme.colors.text.disabled};
  border: ${({ 
    isSelected, 
    isToday: isTodayProp, 
    theme 
  }) => {
    if (isSelected) return `1px solid ${theme.colors.primary}`;
    if (isTodayProp) return `1px solid ${theme.colors.accent}`;
    return 'none';
  }};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, isSelected }) => 
      isSelected ? `${theme.colors.primary}30` : `${theme.colors.background.elevated}`};
  }
`;

const DayNumber = styled.span`
  font-size: 0.9rem;
  font-weight: ${({ isToday }) => isToday ? 'bold' : 'normal'};
`;

const CompletionDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 2px;
  background-color: ${({ theme, isComplete }) => 
    isComplete ? theme.colors.secondary : theme.colors.text.disabled};
`;

const CompletionIndicator = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.6rem;
`;

/**
 * カレンダーコンポーネント
 * 月ごとの習慣達成状況を表示
 */
const CalendarView = ({ 
  habits, 
  selectedDate, 
  onDateSelect,
  getHabitsStatusForDate 
}) => {
  const { t, language } = useLanguage();
  const today = new Date();
  
  // 表示する月と年
  const [viewDate, setViewDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth()
  });
  
  // 曜日の配列
  const daysArray = language === 'ja' ? DAYS_JP : DAYS_EN;
  
  // 月の配列
  const monthsArray = language === 'ja' ? MONTHS_JP : MONTHS_EN;
  
  // カレンダーに表示する日付の配列を計算
  const calendarDates = useMemo(() => {
    return getCalendarDates(viewDate.year, viewDate.month);
  }, [viewDate.year, viewDate.month]);
  
  // 前月へ
  const goToPreviousMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: newMonth };
    });
  };
  
  // 次月へ
  const goToNextMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: newMonth };
    });
  };
  
  // 日付をクリックしたとき
  const handleDateClick = (date) => {
    onDateSelect(formatDateToLocalYYYYMMDD(date));
  };
  
  return (
    <CalendarContainer>
      <CalendarHeader justify="space-between" align="center">
        <IconButton onClick={goToPreviousMonth}>
          <FaChevronLeft />
        </IconButton>
        <MonthText>
          {`${monthsArray[viewDate.month]} ${viewDate.year}`}
        </MonthText>
        <IconButton onClick={goToNextMonth}>
          <FaChevronRight />
        </IconButton>
      </CalendarHeader>
      
      <WeekdayHeader>
        {daysArray.map((day, index) => (
          <WeekdayCell key={index}>{day}</WeekdayCell>
        ))}
      </WeekdayHeader>
      
      <DaysGrid>
        {calendarDates.map((date, index) => {
          const dateString = formatDateToLocalYYYYMMDD(date);
          const isCurrentMonth = isSameMonth(date, viewDate.month, viewDate.year);
          const isTodayDate = isToday(date);
          const isSelectedDate = selectedDate === dateString;
          
          // 日付の習慣達成状況を取得
          const status = getHabitsStatusForDate(dateString);
          const hasCompletions = status.completed > 0;
          const allCompleted = status.completed === status.total && status.total > 0;
          
          return (
            <DayCell 
              key={index}
              isCurrentMonth={isCurrentMonth}
              isToday={isTodayDate}
              isSelected={isSelectedDate}
              onClick={() => handleDateClick(date)}
            >
              <DayNumber isToday={isTodayDate}>
                {date.getDate()}
              </DayNumber>
              {isCurrentMonth && status.total > 0 && (
                <>
                  {allCompleted && (
                    <CompletionIndicator>
                      <FaCheckCircle />
                    </CompletionIndicator>
                  )}
                  <CompletionDot isComplete={hasCompletions} />
                </>
              )}
            </DayCell>
          );
        })}
      </DaysGrid>
    </CalendarContainer>
  );
};

export default CalendarView;
