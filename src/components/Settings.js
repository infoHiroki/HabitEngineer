import React from 'react';
import styled from 'styled-components';
import { 
  FaMoon, 
  FaSun, 
  FaLanguage, 
  FaInfoCircle, 
  FaGithub, 
  FaUserCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import { Card, FlexContainer, Text, Button } from '../styles/CommonStyles';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// スタイル付きコンポーネント
const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const SettingCard = styled(Card)`
  transition: transform 0.2s ease;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SettingHeader = styled(FlexContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const SettingTitle = styled(Text)`
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  font-size: 1.1rem;
  margin: 0;
`;

const SettingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme, color }) => 
    color ? `${theme.colors[color]}20` : `${theme.colors.primary}20`};
  color: ${({ theme, color }) => 
    color ? theme.colors[color] : theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing(1.5)};
`;

const SettingContent = styled.div`
  padding: ${({ theme }) => `0 ${theme.spacing(1.5)}`};
`;

const OptionButton = styled(Button)`
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.text.inverse : theme.colors.text.primary};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.divider};
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : `${theme.colors.background.elevated}`};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const UserEmail = styled(Text)`
  font-size: 0.9rem;
  margin: 0;
`;

const LogoutButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(1.5)};
`;

const AppInfo = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const AppVersion = styled.div`
  font-size: 0.8rem;
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`;

const GithubLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/**
 * 設定画面コンポーネント
 * アプリのテーマ、言語、その他設定を変更する
 */
const Settings = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { t, language, changeLanguage } = useLanguage();
  const { currentUser, logout } = useAuth();
  
  // ログアウト処理
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('ログアウトエラー:', err);
    }
  };
  
  return (
    <SettingsContainer>
      {/* アカウント設定 */}
      {currentUser && (
        <SettingCard>
          <SettingHeader align="center">
            <SettingIcon color="secondary">
              <FaUserCircle />
            </SettingIcon>
            <SettingTitle>{t.account}</SettingTitle>
          </SettingHeader>
          <SettingContent>
            <UserInfo>
              <UserEmail>
                {t.loggedInAs} {currentUser.displayName || currentUser.email}
              </UserEmail>
              <LogoutButton 
                variant="outlined"
                onClick={handleLogout}
              >
                <FaSignOutAlt style={{ marginRight: '8px' }} />
                {t.logout}
              </LogoutButton>
            </UserInfo>
          </SettingContent>
        </SettingCard>
      )}
      
      {/* テーマ設定 */}
      <SettingCard>
        <SettingHeader align="center">
          <SettingIcon>
            {isDarkMode ? <FaMoon /> : <FaSun />}
          </SettingIcon>
          <SettingTitle>{t.darkMode}</SettingTitle>
        </SettingHeader>
        <SettingContent>
          <FlexContainer wrap="wrap">
            <OptionButton 
              size="small" 
              active={!isDarkMode} 
              onClick={() => !isDarkMode || toggleTheme()}
            >
              <FaSun size={14} style={{ marginRight: '4px' }} />
              {t.lightMode}
            </OptionButton>
            <OptionButton 
              size="small" 
              active={isDarkMode} 
              onClick={() => isDarkMode || toggleTheme()}
            >
              <FaMoon size={14} style={{ marginRight: '4px' }} />
              {t.darkMode}
            </OptionButton>
          </FlexContainer>
        </SettingContent>
      </SettingCard>
      
      {/* 言語設定 */}
      <SettingCard>
        <SettingHeader align="center">
          <SettingIcon>
            <FaLanguage />
          </SettingIcon>
          <SettingTitle>{t.language}</SettingTitle>
        </SettingHeader>
        <SettingContent>
          <FlexContainer wrap="wrap">
            <OptionButton 
              size="small" 
              active={language === LANGUAGES.JA} 
              onClick={() => changeLanguage(LANGUAGES.JA)}
            >
              🇯🇵 {t.japanese}
            </OptionButton>
            <OptionButton 
              size="small" 
              active={language === LANGUAGES.EN} 
              onClick={() => changeLanguage(LANGUAGES.EN)}
            >
              🇺🇸 {t.english}
            </OptionButton>
          </FlexContainer>
        </SettingContent>
      </SettingCard>
      
      {/* アプリ情報 */}
      <AppInfo>
        <Text variant="body2" noMargin>
          <FaInfoCircle style={{ marginRight: '4px' }} />
          HabitEngineer
        </Text>
        <AppVersion>Version 0.1.0</AppVersion>
        <GithubLink 
          href="https://github.com/username/HabitEngineer" 
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub /> GitHub
        </GithubLink>
      </AppInfo>
    </SettingsContainer>
  );
};

export default Settings;