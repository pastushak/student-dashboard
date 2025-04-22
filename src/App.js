import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import DataEntryPage from './components/DataEntryPage';
import StudentDashboard from './components/StudentDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    studentId: null
  });
  const [view, setView] = useState('dashboard'); // 'dashboard', 'dataEntry', 'analytics'

  // Перевіряємо, чи користувач вже увійшов в систему
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      setAuth(parsedAuth);
      
      // Встановлюємо початковий вид в залежності від ролі
      if (parsedAuth.role === 'analytics') {
        setView('analytics');
      } else if (parsedAuth.role === 'teacher') {
        setView('dataEntry');
      } else {
        setView('dashboard');
      }
    }
  }, []);

  // Обробка входу користувача
  const handleLogin = (userData) => {
    const newAuth = {
      isLoggedIn: true,
      role: userData.role,
      studentId: userData.studentId || null
    };
    
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
    
    // Встановлюємо початковий вид в залежності від ролі
    if (userData.role === 'analytics') {
      setView('analytics');
    } else if (userData.role === 'teacher') {
      setView('dataEntry');
    } else {
      setView('dashboard');
    }
  };

  // Обробка виходу користувача
  const handleLogout = () => {
    setAuth({
      isLoggedIn: false,
      role: null,
      studentId: null
    });
    setView('dashboard');
    localStorage.removeItem('auth');
  };

  // Вибір, який компонент відображати
  const renderContent = () => {
    if (!auth.isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    // Якщо користувач - учень, відображаємо тільки дашборд з його даними
    if (auth.role === 'student') {
      return (
        <div className="dashboard-wrapper">
          <div className="dashboard-navbar">
            <span className="user-role">Учень</span>
            <button className="logout-btn" onClick={handleLogout}>
              Вийти
            </button>
          </div>
          <StudentDashboard studentId={auth.studentId} userRole={auth.role} />
        </div>
      );
    }

    // Якщо користувач - аналітик, відображаємо тільки аналітику
    if (auth.role === 'analytics') {
      return (
        <div className="dashboard-wrapper">
          <div className="dashboard-navbar">
            <span className="user-role">Аналітик</span>
            <button 
              className={view === 'analytics' ? 'active' : ''}
              onClick={() => setView('analytics')}
            >
              Аналітика
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Вийти
            </button>
          </div>
          <AnalyticsDashboard userRole={auth.role} />
        </div>
      );
    }

    // Якщо користувач - вчитель, відображаємо тільки ввід даних
    if (auth.role === 'teacher') {
      return (
        <div className="dashboard-wrapper">
          <div className="dashboard-navbar">
            <span className="user-role">Вчитель</span>
            <button 
              className={view === 'dataEntry' ? 'active' : ''}
              onClick={() => setView('dataEntry')}
            >
              Ввід даних
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Вийти
            </button>
          </div>
          <DataEntryPage onLogout={handleLogout} userRole={auth.role} />
        </div>
      );
    }

    // Адміністратор має повний доступ
    if (auth.role === 'admin') {
      if (view === 'dataEntry') {
        return (
          <div className="dashboard-wrapper">
            <div className="dashboard-navbar">
              <span className="user-role">Адміністратор</span>
              <button 
                className={view === 'dashboard' ? 'active' : ''}
                onClick={() => setView('dashboard')}
              >
                Моніторинг
              </button>
              <button 
                className={view === 'analytics' ? 'active' : ''}
                onClick={() => setView('analytics')}
              >
                Аналітика
              </button>
              <button 
                className={view === 'dataEntry' ? 'active' : ''}
                onClick={() => setView('dataEntry')}
              >
                Ввід даних
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Вийти
              </button>
            </div>
            <DataEntryPage onLogout={handleLogout} userRole={auth.role} />
          </div>
        );
      } else if (view === 'analytics') {
        return (
          <div className="dashboard-wrapper">
            <div className="dashboard-navbar">
              <span className="user-role">Адміністратор</span>
              <button 
                className={view === 'dashboard' ? 'active' : ''}
                onClick={() => setView('dashboard')}
              >
                Моніторинг
              </button>
              <button 
                className={view === 'analytics' ? 'active' : ''}
                onClick={() => setView('analytics')}
              >
                Аналітика
              </button>
              <button 
                className={view === 'dataEntry' ? 'active' : ''}
                onClick={() => setView('dataEntry')}
              >
                Ввід даних
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Вийти
              </button>
            </div>
            <AnalyticsDashboard userRole={auth.role} />
          </div>
        );
      } else {
        return (
          <div className="dashboard-wrapper">
            <div className="dashboard-navbar">
              <span className="user-role">Адміністратор</span>
              <button 
                className={view === 'dashboard' ? 'active' : ''}
                onClick={() => setView('dashboard')}
              >
                Моніторинг
              </button>
              <button 
                className={view === 'analytics' ? 'active' : ''}
                onClick={() => setView('analytics')}
              >
                Аналітика
              </button>
              <button 
                className={view === 'dataEntry' ? 'active' : ''}
                onClick={() => setView('dataEntry')}
              >
                Ввід даних
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Вийти
              </button>
            </div>
            <StudentDashboard userRole={auth.role} />
          </div>
        );
      }
    }
  };

  return (
    <div className="app">
      {renderContent()}
    </div>
  );
}

export default App;