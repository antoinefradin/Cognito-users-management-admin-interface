import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";

import './index.css'
import App from './App.tsx'


const cognitoAuthConfig = {
  authority: `https://cognito-idp.eu-west-3.amazonaws.com/${import.meta.env.VITE_APP_USER_POOL_ID}`,
  client_id: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_APP_REDIRECT_SIGNIN_URL,
  post_logout_redirect_uri : `${encodeURIComponent(import.meta.env.VITE_APP_REDIRECT_SIGNIN_URL)}`,
  response_type: "code",
  scope: "email openid",
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure you have a div with id='root' in the index.html file.");
}

const root = createRoot(rootElement);

// wrap the application with AuthProvider
root.render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);