import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import '@aws-amplify/ui-react/styles.css';
import ErrorFallback from '@/pages/ErrorFallback';
import Layout from "@/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Enterprises from "@/pages/Enterprises";
import Licenses from "@/pages/Licenses";

import { useAuth } from "react-oidc-context";
import { setAuthTokenGetter } from './hooks/useHttp';



const App: React.FC = () => {

  const auth = useAuth();

  console.log(auth)
  
  // ============================================================================
  // SETUP TOKEN GETTER FOR AXIOS INTERCEPTOR
  // ============================================================================
  useEffect(() => {
    // Set up the token getter function for axios interceptor
    setAuthTokenGetter(() => {
      // Return the appropriate token (id_token for Cognito, access_token for APIs)
      return auth.user?.id_token || auth.user?.access_token || null;
    });
  }, [auth.user]);


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