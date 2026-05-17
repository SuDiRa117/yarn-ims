import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import StockView from './pages/StockView';
import Reports from './pages/Reports';
import './App.css';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useAuthStore();
  return user ? <Component /> : <Navigate to="/login" />;
};

function App() {
  const { loadAuth, user } = useAuthStore();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <BrowserRouter>
      <div className="app">
        {user && <Header />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
            <Route path="/data-entry" element={<ProtectedRoute component={DataEntry} />} />
            <Route path="/stock" element={<ProtectedRoute component={StockView} />} />
            <Route path="/reports" element={<ProtectedRoute component={Reports} />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
