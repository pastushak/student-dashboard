import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import DataEntryPage from './components/DataEntryPage';
import StudentDashboard from './components/StudentDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import './mobile-fixes.css';
import { supabase } from './supabase';

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    studentId: null
  });
  const [view, setView] = useState('dashboard'); // 'dashboard', 'dataEntry', 'analytics'

  // Перевірка сесії при завантаженні
  useEffect(() => {
    const checkSession = async () => {
      // Отримуємо поточну сесію Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Отримуємо профіль користувача
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileData && !profileError) {
          // Встановлюємо стан авторизації
          const newAuth = {
            isLoggedIn: true,
            role: profileData.role,
            studentId: profileData.student_id
          };
          
          setAuth(newAuth);
          
          // Встановлюємо початковий вид в залежності від ролі
          if (profileData.role === 'student') {
            setView('dashboard');
          } else {
            // Для всіх адміністративних ролей показуємо дашборд як початковий вид
            setView('dashboard');
          }
        }
      }
    };
    
    checkSession();
  }, []);

  // Обробка входу користувача
  const handleLogin = (userData) => {
    // Оновлюємо стан авторизації без повторного виклику Supabase
    const newAuth = {
      isLoggedIn: true,
      role: userData.role === 'teacher' || userData.role === 'analytics' ? 'admin' : userData.role,
      studentId: userData.studentId
    };
    setAuth(newAuth);
  
    // Встановлюємо початковий вид в залежності від ролі
    if (userData.role === 'student') {
      setView('dashboard');
    } else {
      setView('dashboard');
    }
  };

  // Обробка виходу користувача
  const handleLogout = async () => {
    // Вихід з Supabase
    await supabase.auth.signOut();
    
    // Очищення стану
    setAuth({
      isLoggedIn: false,
      role: null,
      studentId: null
    });
    setView('dashboard');
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
            <div className="navbar-buttons-container">
              <button className="logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                <span className="button-text">Вийти</span>
              </button>
            </div>
          </div>
          <StudentDashboard studentId={auth.studentId} userRole={auth.role} />
        </div>
      );
    }

    // Для всіх адміністративних ролей (вчитель/аналітик/адмін) показуємо однаковий інтерфейс
    // з доступом до всіх функцій (об'єднуємо ролі)
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-navbar">
          <span className="user-role">Адміністратор</span>
          
          <div className="navbar-buttons-container">
            <button 
              className={view === 'dashboard' ? 'active' : ''}
              onClick={() => setView('dashboard')}
            >
              <i className="fas fa-chart-line"></i>
              <span className="button-text">Моніторинг</span>
            </button>
            
            <button 
              className={view === 'analytics' ? 'active' : ''}
              onClick={() => setView('analytics')}
            >
              <i className="fas fa-chart-pie"></i>
              <span className="button-text">Аналітика</span>
            </button>
            
            <button 
              className={view === 'dataEntry' ? 'active' : ''}
              onClick={() => setView('dataEntry')}
            >
              <i className="fas fa-edit"></i>
              <span className="button-text">Ввід даних</span>
            </button>
            
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="button-text">Вийти</span>
            </button>
          </div>
        </div>
        
        {/* Відображаємо відповідний компонент в залежності від обраного виду */}
        {view === 'dashboard' && <StudentDashboard userRole="admin" />}
        {view === 'analytics' && <AnalyticsDashboard userRole="admin" />}
        {view === 'dataEntry' && <DataEntryPage onLogout={handleLogout} userRole="admin" />}
      </div>
    );
  };

  return (
    <div className="app">
      {renderContent()}
    </div>
  );
}

export default App;