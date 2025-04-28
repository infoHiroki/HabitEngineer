import React from 'react';
import styled from 'styled-components';
import { FaMoon, FaSun, FaLanguage } from 'react-icons/fa';
import { FlexContainer, IconButton, Text } from '../styles/CommonStyles';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, LANGUAGES } from '../contexts/LanguageContext';

// スタイル付きコンポーネント
const HeaderContainer = styled.header`
  padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(3)}`};
  background-color: ${({ theme }) => theme.colors.background.paper};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const AppTitle = styled(Text)`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonGroup = styled(FlexContainer)`
  gap: ${({ theme }) => theme.spacing(1)};
`;

const LanguageButton = styled(IconButton)`
  position: relative;
  
  &::after {
    content: "${({ $language }) => $language.toUpperCase()}";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.6rem;
    font-weight: bold;
  }
`;

/**
 * ヘッダーコンポーネント
 * アプリのタイトルとテーマ切り替え、言語切り替えボタンを表示
 */
const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, language, changeLanguage } = useLanguage();
  
  // 言語切り替えハンドラ
  const handleLanguageToggle = () => {
    const newLanguage = language === LANGUAGES.JA ? LANGUAGES.EN : LANGUAGES.JA;
    changeLanguage(newLanguage);
  };
  
  return (
    <HeaderContainer>
      <FlexContainer $justify="space-between" $align="center">
        <AppTitle>{t.appName}</AppTitle>
        
        <ButtonGroup>
          <LanguageButton 
            onClick={handleLanguageToggle}
            $language={language}
            title={language === LANGUAGES.JA ? t.english : t.japanese}
          >
            <FaLanguage />
          </LanguageButton>
          
          <IconButton 
            onClick={toggleTheme}
            title={isDarkMode ? t.lightMode || 'ライトモード' : t.darkMode}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </IconButton>
        </ButtonGroup>
      </FlexContainer>
    </HeaderContainer>
  );
};

export default Header;