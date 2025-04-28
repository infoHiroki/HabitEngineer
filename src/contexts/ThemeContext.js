import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme';

// テーマコンテキストを作成
const ThemeContext = createContext();

// テーマプロバイダーコンポーネント
export const ThemeProvider = ({ children }) => {
  // ローカルストレージからテーマ設定を読み込む
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? darkTheme : lightTheme;
  });

  // ダークモードかどうかのフラグ
  const isDarkMode = theme.name === 'dark';

  // テーマ変更時にローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('theme', theme.name);
    // ダークモード設定をhtml要素に反映
    document.documentElement.setAttribute('data-theme', theme.name);
  }, [theme]);

  // テーマ切り替え関数
  const toggleTheme = () => {
    setTheme(isDarkMode ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// テーマを使うためのカスタムフック
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
