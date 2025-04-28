import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { 
  Card, 
  FlexContainer, 
  Button, 
  Input, 
  Label, 
  Text 
} from '../styles/CommonStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

// スタイル付きコンポーネント
const FormContainer = styled(Card)`
  width: 100%;
  max-width: 400px;
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
  position: relative;
`;

const InputWithIcon = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing(1)};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledInput = styled(Input)`
  padding-left: ${({ theme }) => theme.spacing(4)};
`;

const ErrorMessage = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-size: 0.9rem;
`;

const SwitchFormText = styled(Text)`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
  font-size: 0.9rem;
`;

const SwitchFormButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => `${theme.colors.background.paper}80`};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.background.elevated};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/**
 * ログイン/登録フォームコンポーネント
 */
const LoginForm = () => {
  const { t } = useLanguage();
  const { signup, login, error: authError } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // フォーム入力の変更ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // フォーム送信ハンドラ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      
      if (isLogin) {
        // ログイン
        await login(formData.email, formData.password);
      } else {
        // 新規登録
        await signup(formData.email, formData.password, formData.displayName);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // ログイン/登録フォームの切り替え
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  return (
    <FormContainer as="form" onSubmit={handleSubmit} padding={3}>
      <FormTitle>
        {isLogin ? t.login || 'ログイン' : t.signup || '新規登録'}
      </FormTitle>
      
      {(error || authError) && (
        <ErrorMessage>{error || authError}</ErrorMessage>
      )}
      
      {!isLogin && (
        <FormField>
          <Label htmlFor="displayName">{t.displayName || '表示名'}</Label>
          <InputWithIcon>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <StyledInput
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder={t.displayName || '表示名'}
            />
          </InputWithIcon>
        </FormField>
      )}
      
      <FormField>
        <Label htmlFor="email">{t.email || 'メールアドレス'}</Label>
        <InputWithIcon>
          <IconWrapper>
            <FaEnvelope />
          </IconWrapper>
          <StyledInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t.email || 'メールアドレス'}
            required
          />
        </InputWithIcon>
      </FormField>
      
      <FormField>
        <Label htmlFor="password">{t.password || 'パスワード'}</Label>
        <InputWithIcon>
          <IconWrapper>
            <FaLock />
          </IconWrapper>
          <StyledInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t.password || 'パスワード'}
            required
          />
        </InputWithIcon>
      </FormField>
      
      <Button type="submit" disabled={loading}>
        {isLogin ? t.login || 'ログイン' : t.signup || '新規登録'}
      </Button>
      
      <SwitchFormText>
        {isLogin 
          ? (t.noAccount || 'アカウントをお持ちでないですか？') 
          : (t.hasAccount || '既にアカウントをお持ちですか？')}
        {' '}
        <SwitchFormButton type="button" onClick={toggleForm}>
          {isLogin ? t.signup || '新規登録' : t.login || 'ログイン'}
        </SwitchFormButton>
      </SwitchFormText>
      
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
    </FormContainer>
  );
};

export default LoginForm;