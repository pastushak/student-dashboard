import React, { useState } from 'react';
import './LoginPage.css';
import logo from '../logo.svg';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Тестові облікові записи
  const accounts = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'analytics', password: 'analytics2025', role: 'analytics' }, // Роль для аналітики
    { username: 'teacher', password: 'teacher2025', role: 'teacher' }, // Роль для вводу даних
    // Облікові записи учнів, де username це їх id, а пароль - прізвище латиницею з малої літери
    { username: '01', password: 'vekeryk', role: 'student', id: '01' },
    { username: '02', password: 'dydychyn', role: 'student', id: '02' },
    { username: '03', password: 'zhyliak', role: 'student', id: '03' },
    { username: '04', password: 'kotsiur', role: 'student', id: '04' },
    { username: '05', password: 'lytvynskyi', role: 'student', id: '05' },
    { username: '06', password: 'matsyshyn', role: 'student', id: '06' },
    { username: '07', password: 'matsiborko', role: 'student', id: '07' },
    { username: '08', password: 'osadchyi', role: 'student', id: '08' },
    { username: '09', password: 'parashchuk', role: 'student', id: '09' },
    { username: '10', password: 'parashchuk', role: 'student', id: '10' },
    { username: '11', password: 'romaniuk', role: 'student', id: '11' },
    { username: '12', password: 'sokolyshyn', role: 'student', id: '12' },
    { username: '13', password: 'chobaniuk', role: 'student', id: '13' },
    { username: '14', password: 'chornetska', role: 'student', id: '14' },
    { username: '15', password: 'yakubiv', role: 'student', id: '15' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Пошук облікового запису
    const account = accounts.find(acc => acc.username === username && acc.password === password);
    
    if (account) {
      // Передаємо інформацію про роль і, якщо це учень, також його ідентифікатор
      onLogin({
        role: account.role,
        ...(account.role === 'student' && { studentId: account.id })
      });
    } else {
      setError('Невірний логін або пароль');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Логотип" className="login-logo" />
          <h1>Моніторинг НМТ з математики</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="username">Логін</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">Увійти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;