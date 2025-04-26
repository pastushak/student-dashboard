import React, { useState } from 'react';
import './LoginPage.css';
import Logo from './Logo'; // Імпортуйте новий компонент
import { supabase } from '../supabase';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Перевірка значень перед відправкою
    if (!email || email.trim() === '') {
      setError('Email є обов\'язковим');
      setLoading(false);
      return;
    }
    
    // Перевірка підключення до інтернету
    if (!navigator.onLine) {
      setError('Немає з\'єднання з інтернетом. Перевірте підключення і спробуйте знову.');
      setLoading(false);
      return;
    }
    
    try {
      console.log("Спроба входу:", email);
      
      // Додайте цей рядок для детальнішого логування
      console.log("Дані для відправки:", { email, password: '****' });
      
      // Вхід користувача через Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Помилка при авторизації:", error);
        throw error;
      }

      console.log("Успішна авторизація:", data);
      
      // Отримуємо профіль користувача з таблиці profiles
      const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
  
      if (profileError) {
        console.error("Помилка отримання профілю:", profileError);
        throw profileError;
      }

      console.log("Профіль користувача:", profileData);
      
      // Трансформація ролі - всі адміністративні ролі конвертуються в "admin"
      let role = profileData.role;
      if (role === 'teacher' || role === 'analytics') {
        role = 'admin';
      }
      
      // Передаємо дані про користувача в батьківський компонент
      onLogin({
        role: profileData.role, // Передаємо оригінальну роль
        studentId: profileData.student_id
      });
      
    } catch (error) {
      console.error("Помилка входу:", error.message);
      setError(error.message || 'Невірний логін або пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Logo /> {/* Використовуйте компонент замість <img src={logo} /> */}
          <h1>Моніторинг НМТ з математики</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Введіть ваш email"
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
              autoComplete="current-password"
              placeholder="Введіть ваш пароль"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
        
        <div className="login-info">
          <p align="center">Для входу в персональний кабінет використовуйте надані Романом Васильовичем дані.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;