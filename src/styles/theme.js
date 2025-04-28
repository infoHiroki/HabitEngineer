/**
 * アプリケーション全体のテーマ設定
 * ライト/ダークモード対応
 */

export const lightTheme = {
  name: 'light',
  colors: {
    primary: '#4285F4',      // メインカラー（青）
    secondary: '#34A853',    // サブカラー（緑）
    accent: '#FBBC05',       // アクセントカラー（黄色）
    error: '#EA4335',        // エラーカラー（赤）
    
    text: {
      primary: '#202124',    // プライマリテキスト
      secondary: '#5F6368',  // セカンダリテキスト
      disabled: '#9AA0A6',   // 無効テキスト
      hint: '#80868B',       // ヒントテキスト
      inverse: '#FFFFFF',    // 反転テキスト（暗い背景用）
    },
    
    background: {
      main: '#FFFFFF',       // メイン背景
      paper: '#F1F3F4',      // ペーパー背景（カード等）
      elevated: '#E8EAED',   // 浮き上がり背景
    },
    
    divider: '#DADCE0',      // 区切り線
    
    status: {
      online: '#34A853',     // オンライン状態
      offline: '#9AA0A6',    // オフライン状態
      warning: '#FBBC05',    // 警告状態
      error: '#EA4335',      // エラー状態
    },
  },
  
  typography: {
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
  },
  
  spacing: (factor) => `${factor * 8}px`,
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  },
  
  shadows: {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    large: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
  },
  
  transitions: {
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: {
      short: '150ms',
      standard: '250ms',
      long: '375ms',
    },
  },
};

export const darkTheme = {
  name: 'dark',
  colors: {
    primary: '#8AB4F8',      // メインカラー（青）
    secondary: '#81C995',    // サブカラー（緑）
    accent: '#FDD663',       // アクセントカラー（黄色）
    error: '#F28B82',        // エラーカラー（赤）
    
    text: {
      primary: '#E8EAED',    // プライマリテキスト
      secondary: '#9AA0A6',  // セカンダリテキスト
      disabled: '#5F6368',   // 無効テキスト
      hint: '#80868B',       // ヒントテキスト
      inverse: '#202124',    // 反転テキスト（明るい背景用）
    },
    
    background: {
      main: '#202124',       // メイン背景
      paper: '#2D2E30',      // ペーパー背景（カード等）
      elevated: '#3C4043',   // 浮き上がり背景
    },
    
    divider: '#5F6368',      // 区切り線
    
    status: {
      online: '#81C995',     // オンライン状態
      offline: '#9AA0A6',    // オフライン状態
      warning: '#FDD663',    // 警告状態
      error: '#F28B82',      // エラー状態
    },
  },
  
  typography: {
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
  },
  
  spacing: (factor) => `${factor * 8}px`,
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  },
  
  shadows: {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.36)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.28), 0 2px 4px rgba(0, 0, 0, 0.24)',
    large: '0 10px 20px rgba(0, 0, 0, 0.28), 0 3px 6px rgba(0, 0, 0, 0.20)',
  },
  
  transitions: {
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: {
      short: '150ms',
      standard: '250ms',
      long: '375ms',
    },
  },
};

// デフォルトテーマをエクスポート（初期値はライトモード）
export default lightTheme;
