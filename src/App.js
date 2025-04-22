import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import DataEntryPage from './components/DataEntryPage';
import LoginPage from './components/LoginPage';
import './App.css';

// Компонент для перевірки авторизації
function RequireAuth({ children }) {
  const userRole = localStorage.getItem('userRole');
  
  if (!userRole) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Компонент для захищених маршрутів (тільки для вчителя)
function TeacherRoute({ children }) {
  const userRole = localStorage.getItem('userRole');
  
  if (userRole !== 'teacher') {
    return <Navigate to="/" />;
  }
  
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Перевіряємо стан авторизації при завантаженні
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsLoggedIn(Boolean(userRole));
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Маршрут для сторінки входу */}
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />} 
          />
          
          {/* Головна сторінка з дашбордом - захищена */}
          <Route 
            path="/" 
            element={
              <RequireAuth>
                <StudentDashboard />
              </RequireAuth>
            } 
          />
          
          {/* Сторінка введення даних - доступна тільки для вчителя */}
          <Route 
            path="/data-entry" 
            element={
              <RequireAuth>
                <TeacherRoute>
                  <DataEntryPage />
                </TeacherRoute>
              </RequireAuth>
            } 
          />
          
          {/* Перенаправлення для невідомих маршрутів */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;