import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

// スタイル付きコンポーネント
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.background.elevated};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/**
 * 認証状態に基づいてコンテンツを表示するコンポーネント
 * 認証済みの場合は子コンポーネントを表示し、
 * 未認証の場合はログインフォームを表示
 */
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // ローディング中はローディング表示
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }
  
  // 認証済みの場合は子コンポーネントを表示
  if (currentUser) {
    return <>{children}</>;
  }
  
  // 未認証の場合はログインフォームを表示
  return <LoginForm />;
};

export default PrivateRoute;