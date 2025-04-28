import React from 'react';
import styled from 'styled-components';
import { FaListAlt, FaChartBar, FaCog } from 'react-icons/fa';
import { FlexContainer } from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';

// スタイル付きコンポーネント
const NavContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.background.paper};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const NavTabs = styled(FlexContainer)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const NavTab = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(0.5)};
  padding: ${({ theme }) => theme.spacing(1.5)};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.background.elevated}50`};
  }
`;

const TabIcon = styled.div`
  font-size: 1.2rem;
`;

const TabLabel = styled.span`
  font-size: 0.8rem;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`;

/**
 * ナビゲーションコンポーネント
 * アプリ内の異なるビュー間を切り替えるタブ
 */
const Navigation = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'habits', label: t.habits, icon: <FaListAlt /> },
    { id: 'stats', label: t.stats, icon: <FaChartBar /> },
    { id: 'settings', label: t.settings, icon: <FaCog /> }
  ];
  
  return (
    <NavContainer>
      <NavTabs>
        {tabs.map(tab => (
          <NavTab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            <TabIcon>{tab.icon}</TabIcon>
            <TabLabel>{tab.label}</TabLabel>
          </NavTab>
        ))}
      </NavTabs>
    </NavContainer>
  );
};

export default Navigation;
