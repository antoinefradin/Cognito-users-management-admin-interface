import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ErrorFallback from '@/pages/ErrorFallback';
import Layout from "@/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Enterprises from "@/pages/Enterprises";
import Licenses from "@/pages/Licenses";

import { useAuth } from "react-oidc-context";



const App: React.FC = () => {

  const auth = useAuth();

  // Custom sign-out redirect function using Cognito logout endpoint
  const signOutRedirect = (): void => {
    const clientId = import.meta.env.VITE_APP_USER_POOL_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_APP_REDIRECT_SIGNOUT_URL;
    const cognitoDomain = import.meta.env.VITE_APP_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Handle authentication errors
  if (auth.error) {
    return <ErrorFallback />;
  }

  // If user is authenticated, show the main application
  if (auth.isAuthenticated) {
    return (
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Router>
          <Routes>
            {/* Default Route - to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard Page */}
            <Route 
              path="/dashboard" 
              element={
                <Layout currentPageName="Dashboard">
                  <Dashboard />
                </Layout>
              } 
            />

            {/* Enterprises Page */}
            <Route 
              path="/enterprises" 
              element={
                <Layout currentPageName="Enterprises">
                  <Enterprises />
                </Layout>
              } 
            />

            {/* Licenses Page */}
            <Route 
              path="/licenses" 
              element={
                <Layout currentPageName="Licenses">
                  <Licenses />
                </Layout>
              } 
            />
            
            {/* Route catch-all for 404 or Dahboard redirection */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    );
  }


  // If user is not authenticated, redirect to managed login UI
  if (!auth.isLoading) {
    auth.signinRedirect();
  }
  return (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <div></div>
  </ErrorBoundary>
  );
};

export default App;