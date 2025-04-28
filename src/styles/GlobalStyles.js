import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* リセットCSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 16px;
    background-color: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background-color ${({ theme }) => theme.transitions.duration.standard} ${({ theme }) => theme.transitions.easing},
                color ${({ theme }) => theme.transitions.duration.standard} ${({ theme }) => theme.transitions.easing};
  }
  
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
    font-size: 1rem;
    border: none;
    outline: none;
    background: none;
    color: inherit;
  }
  
  button {
    cursor: pointer;
  }
  
  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* スクロールバーのスタイル */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.elevated};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.text.disabled};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.text.secondary};
    }
  }
  
  /* フォーカス時のスタイル */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  
  /* 選択時のスタイル */
  ::selection {
    background-color: ${({ theme }) => `${theme.colors.primary}40`}; /* 40は透明度 */
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export default GlobalStyles;
