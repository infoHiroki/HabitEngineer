import styled from 'styled-components';

// コンテナ
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing(2)};
`;

// フレックスコンテナ
export const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'stretch'};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};
  gap: ${({ gap, theme }) => gap ? theme.spacing(gap) : '0'};
`;

// グリッドコンテナ
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || 'repeat(1, 1fr)'};
  grid-gap: ${({ gap, theme }) => gap ? theme.spacing(gap) : '0'};
`;

// カード
export const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme, elevation }) => elevation ? theme.shadows[elevation] : theme.shadows.small};
  padding: ${({ theme, padding }) => padding ? theme.spacing(padding) : theme.spacing(2)};
  transition: all ${({ theme }) => theme.transitions.duration.standard} ${({ theme }) => theme.transitions.easing};
  
  &:hover {
    box-shadow: ${({ theme, hoverElevation }) => hoverElevation ? theme.shadows[hoverElevation] : theme.shadows.medium};
  }
`;

// ボタン
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme, size }) => size === 'small' ? `${theme.spacing(0.5)} ${theme.spacing(1)}` 
    : size === 'large' ? `${theme.spacing(1.5)} ${theme.spacing(3)}`
    : `${theme.spacing(1)} ${theme.spacing(2)}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
  background-color: ${({ theme, variant }) => 
    variant === 'outlined' ? 'transparent' 
    : variant === 'text' ? 'transparent'
    : theme.colors.primary};
  color: ${({ theme, variant }) => 
    variant === 'outlined' ? theme.colors.primary 
    : variant === 'text' ? theme.colors.primary
    : theme.colors.text.inverse};
  border: ${({ theme, variant }) => 
    variant === 'outlined' ? `1px solid ${theme.colors.primary}` 
    : 'none'};
  
  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'outlined' ? `${theme.colors.primary}10` 
      : variant === 'text' ? `${theme.colors.primary}10`
      : `${theme.colors.primary}E6`}; /* E6は透明度90% */
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: ${({ theme, variant }) => 
      variant === 'outlined' ? 'transparent' 
      : variant === 'text' ? 'transparent'
      : theme.colors.text.disabled};
    color: ${({ theme }) => theme.colors.text.disabled};
    border-color: ${({ theme, variant }) => 
      variant === 'outlined' ? theme.colors.text.disabled 
      : 'transparent'};
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

// アイコンボタン
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme, size }) => size === 'small' ? theme.spacing(4) 
    : size === 'large' ? theme.spacing(6)
    : theme.spacing(5)};
  height: ${({ theme, size }) => size === 'small' ? theme.spacing(4) 
    : size === 'large' ? theme.spacing(6)
    : theme.spacing(5)};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.text.primary}10`}; /* 10は透明度 */
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

// 入力フィールド
export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => `${theme.colors.primary}40`};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.hint};
  }
`;

// テキストエリア
export const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
  resize: vertical;
  min-height: ${({ theme }) => theme.spacing(10)};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => `${theme.colors.primary}40`};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.hint};
  }
`;

// セレクト
export const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(1.5)}`};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
  appearance: none;
  background-image: ${({ theme }) => `linear-gradient(45deg, transparent 50%, ${theme.colors.text.secondary} 50%), 
                     linear-gradient(135deg, ${theme.colors.text.secondary} 50%, transparent 50%)`};
  background-position: calc(100% - 15px) calc(1em + 2px), calc(100% - 10px) calc(1em + 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => `${theme.colors.primary}40`};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

// チェックボックス
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1px solid ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background.paper};
  transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
  position: relative;
  cursor: pointer;
  
  &:checked {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
    }
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    border-color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    
    &:checked {
      background-color: ${({ theme }) => theme.colors.text.disabled};
      &::after {
        opacity: 0.7;
      }
    }
  }
`;

// ラベル
export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// 見出し
export const Heading = styled.h1`
  font-size: ${({ theme, level }) => theme.typography[`h${level || 1}`].fontSize};
  font-weight: ${({ theme, level }) => theme.typography[`h${level || 1}`].fontWeight};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// テキスト
export const Text = styled.p`
  font-size: ${({ theme, variant }) => theme.typography[variant || 'body1'].fontSize};
  font-weight: ${({ theme, variant }) => theme.typography[variant || 'body1'].fontWeight};
  margin-bottom: ${({ theme, noMargin }) => noMargin ? '0' : theme.spacing(1)};
  color: ${({ theme, color }) => color ? theme.colors.text[color] : theme.colors.text.primary};
`;

// 区切り線
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider};
  margin: ${({ theme, vertical }) => vertical ? `0 ${theme.spacing(1)}` : `${theme.spacing(2)} 0`};
`;

// バッジ
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing(0.25)} ${theme.spacing(1)}`};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  background-color: ${({ theme, color }) => color ? theme.colors[color] : theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
`;

// アバター
export const Avatar = styled.div`
  width: ${({ theme, size }) => size === 'small' ? theme.spacing(3)
    : size === 'large' ? theme.spacing(5)
    : theme.spacing(4)};
  height: ${({ theme, size }) => size === 'small' ? theme.spacing(3)
    : size === 'large' ? theme.spacing(5)
    : theme.spacing(4)};
  border-radius: ${({ theme, square }) => square ? theme.borderRadius.small : theme.borderRadius.round};
  background-color: ${({ theme, color }) => color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// ツールチップ
export const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  
  &::before {
    content: "${({ content }) => content}";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(1)}`};
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    font-size: ${({ theme }) => theme.typography.caption.fontSize};
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all ${({ theme }) => theme.transitions.duration.short} ${({ theme }) => theme.transitions.easing};
    z-index: 1000;
  }
  
  &:hover::before {
    opacity: 1;
    visibility: visible;
  }
`;

// ローディングスピナー
export const Spinner = styled.div`
  width: ${({ theme, size }) => size === 'small' ? theme.spacing(2)
    : size === 'large' ? theme.spacing(4)
    : theme.spacing(3)};
  height: ${({ theme, size }) => size === 'small' ? theme.spacing(2)
    : size === 'large' ? theme.spacing(4)
    : theme.spacing(3)};
  border: 2px solid ${({ theme }) => theme.colors.background.elevated};
  border-top: 2px solid ${({ theme, color }) => color ? theme.colors[color] : theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
