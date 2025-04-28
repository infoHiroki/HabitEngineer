import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Card, 
  FlexContainer, 
  Button, 
  Input, 
  TextArea, 
  Select, 
  Label, 
  Checkbox,
  Text
} from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { DAYS_JP, DAYS_EN } from '../utils/dateUtils';

// スタイル付きコンポーネント
const FormContainer = styled(Card)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const FormTitle = styled(Text)`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  text-align: center;
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
`;

const CheckboxContainer = styled(FlexContainer)`
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const DayCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const ColorOption = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ color }) => color};
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.text.primary : 'transparent'};
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ButtonGroup = styled(FlexContainer)`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

// 習慣の色のオプション
const colorOptions = [
  '#4285F4', // 青
  '#34A853', // 緑
  '#FBBC05', // 黄
  '#EA4335', // 赤
  '#9C27B0', // 紫
  '#FF9800', // オレンジ
  '#795548', // 茶
  '#607D8B', // 青灰色
];

/**
 * 習慣フォームコンポーネント
 * 習慣の追加と編集に使用
 */
const HabitForm = ({ habit, onSubmit, onCancel }) => {
  const { t, language } = useLanguage();
  const isEditing = !!habit;
  
  // フォームの初期状態
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    color: '#4285F4',
    active: true,
  });
  
  // 編集モードの場合、既存の習慣データをフォームにセット
  useEffect(() => {
    if (habit) {
      setFormData({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        targetDays: [...habit.targetDays],
        color: habit.color,
        active: habit.active,
      });
    }
  }, [habit]);
  
  // 入力フィールドの変更ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 対象曜日のチェックボックスの変更ハンドラ
  const handleDayToggle = (dayIndex) => {
    const updatedTargetDays = [...formData.targetDays];
    
    if (updatedTargetDays.includes(dayIndex)) {
      // 既に選択されている場合は削除
      const index = updatedTargetDays.indexOf(dayIndex);
      updatedTargetDays.splice(index, 1);
    } else {
      // 選択されていない場合は追加
      updatedTargetDays.push(dayIndex);
      updatedTargetDays.sort((a, b) => a - b); // 日曜日から順に並べる
    }
    
    setFormData(prev => ({
      ...prev,
      targetDays: updatedTargetDays
    }));
  };
  
  // 色の選択ハンドラ
  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };
  
  // フォーム送信ハンドラ
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // 曜日の配列
  const daysArray = language === 'ja' ? DAYS_JP : DAYS_EN;
  
  return (
    <FormContainer as="form" onSubmit={handleSubmit} padding={3}>
      <FormTitle>
        {isEditing ? t.editHabit : t.addHabit}
      </FormTitle>
      
      <FormField>
        <Label htmlFor="name">{t.habitName} *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t.habitName}
          required
        />
      </FormField>
      
      <FormField>
        <Label htmlFor="description">{t.description}</Label>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t.description}
        />
      </FormField>
      
      <FormField>
        <Label htmlFor="frequency">{t.frequency}</Label>
        <Select
          id="frequency"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
        >
          <option value="daily">{t.daily}</option>
          <option value="weekly">{t.weekly}</option>
          <option value="custom">{t.custom}</option>
        </Select>
      </FormField>
      
      {formData.frequency === 'custom' && (
        <FormField>
          <Label>{t.targetDays}</Label>
          <CheckboxContainer>
            {daysArray.map((day, index) => (
              <DayCheckbox key={index}>
                <Checkbox
                  type="checkbox"
                  checked={formData.targetDays.includes(index)}
                  onChange={() => handleDayToggle(index)}
                  id={`day-${index}`}
                />
                <Label htmlFor={`day-${index}`} as="span">{day}</Label>
              </DayCheckbox>
            ))}
          </CheckboxContainer>
        </FormField>
      )}
      
      <FormField>
        <Label>{t.color}</Label>
        <ColorPicker>
          {colorOptions.map(color => (
            <ColorOption
              key={color}
              color={color}
              selected={formData.color === color}
              onClick={() => handleColorSelect(color)}
              type="button"
            />
          ))}
        </ColorPicker>
      </FormField>
      
      <ButtonGroup justify="flex-end" gap={2}>
        <Button type="button" variant="outlined" onClick={onCancel}>
          {t.cancel}
        </Button>
        <Button type="submit">
          {isEditing ? t.save : t.addHabit}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default HabitForm;
