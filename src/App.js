import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import DataEntryPage from './components/DataEntryPage';
import StudentDashboard from './components/StudentDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { supabase } from './supabase'; // Імпортуйте supabase клієнт

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
          if (profileData.role === 'analytics') {
            setView('analytics');
          } else if (profileData.role === 'teacher') {
            setView('dataEntry');
          } else {
            setView('dashboard');
          }
        }
      }
    };
    
    checkSession();
  }, []);

  // Обробка входу користувача
  const handleLogin = async (userData) => {
    try {
      // Авторизація через Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });
      
      if (error) throw error;
      
      // Отримуємо профіль користувача
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Оновлюємо стан авторизації
      const newAuth = {
        isLoggedIn: true,
        role: profileData.role,
        studentId: profileData.student_id
      };
      
      setAuth(newAuth);
      
      // Встановлюємо початковий вид в залежності від ролі
      if (profileData.role === 'analytics') {
        setView('analytics');
      } else if (profileData.role === 'teacher') {
        setView('dataEntry');
      } else {
        setView('dashboard');
      }
      
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('Помилка входу: ' + error.message);
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