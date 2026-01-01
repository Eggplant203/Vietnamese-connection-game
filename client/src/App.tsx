import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;