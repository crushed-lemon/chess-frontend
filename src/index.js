import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "react-oidc-context";

const cognitoEndpoint = process.env.REACT_APP_COGNITO_ENDPOINT;
const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
const redirectUri = process.env.REACT_APP_COGNITO_REDIRECT_URI;

const cognitoAuthConfig = {
  authority: cognitoEndpoint,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "phone openid email",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
