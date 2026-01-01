import React from 'react';
import ReactDOM from 'react-dom/client';
import { GamePage } from './pages/GamePage';
import { AdminPage } from './pages/AdminPage';
import { AdminLogin } from './pages/AdminLogin';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Simple routing based on URL path
const App = () => {
  const path = window.location.pathname;
  
  if (path === '/admin/login') {
    return <AdminLogin />;
  }
  
  if (path === '/admin') {
    return <AdminPage />;
  }
  
  return <GamePage />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      containerStyle={{
        top: 80,
        zIndex: 9999,
      }}
      gutter={8}
      toastOptions={{
        duration: 2000,
        style: {
          background: '#fff',
          color: '#363636',
          fontWeight: '600',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxWidth: '400px',
        },
        success: {
          iconTheme: {
            primary: '#5bb462',
            secondary: '#fff',
          },
        },
        error: {
          duration: 2500,
          iconTheme: {
            primary: '#ef476f',
            secondary: '#fff',
          },
        },
      }}
    />
  </React.StrictMode>
);
