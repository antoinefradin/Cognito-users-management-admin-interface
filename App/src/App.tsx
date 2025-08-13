import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "@/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Enterprises from "@/pages/Enterprises";
import Licenses from "@/pages/Licenses";


const user_pool_id = import.meta.env.VITE_APP_USER_POOL_ID;
console.log('env');
console.log(user_pool_id);


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route - redirects to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard as default page */}
        <Route 
          path="/dashboard" 
          element={
            <Layout currentPageName="Dashboard">
              <Dashboard />
            </Layout>
          } 
        />

        {/* Enterprises page */}
        <Route 
          path="/enterprises" 
          element={
            <Layout currentPageName="Enterprises">
              <Enterprises />
            </Layout>
          } 
        />

        {/* Licenses page */}
        <Route 
          path="/licenses" 
          element={
            <Layout currentPageName="Licenses">
              <Licenses />
            </Layout>
          } 
        />
        
        
        
        {/* Catch-all route for 404 or redirect back to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;