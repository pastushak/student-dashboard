import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Припустимо, що у вас є цей файл стилів

function LoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [role, setRole] = useState('student'); // 'student' або 'teacher'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Очищаємо попередні помилки
    setError('');

    if (role === 'teacher' && accessCode === 'teacher123') { // Використовую код з вашого основного компонента
      localStorage.setItem('userRole', 'teacher');
      navigate('/'); // Перенаправлення на дашборд
    } else if (role === 'student') {
      // Перевірка, чи існує учень з таким кодом
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const student = students.find(s => s.id.toString() === accessCode);
      
      if (student) {
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('studentId', student.id);
        navigate('/'); // Перенаправлення на дашборд учня
      } else {
        setError('Неправильний код доступу. Спробуйте ще раз.');
      }
    } else {
      setError('Неправильний код доступу. Спробуйте ще раз.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Вхід до дашборду успішності</h1>
      
      {error && <div className="login-error">{error}</div>}
      
      <div className="role-selector">
        <button
          className={`role-button ${role === 'student' ? 'active' : ''}`}
          onClick={() => setRole('student')}
        >
          Я учень
        </button>
        <button
          className={`role-button ${role === 'teacher' ? 'active' : ''}`}
          onClick={() => setRole('teacher')}
        >
          Я вчитель
        </button>
      </div>
      
      <div className="login-form">
        <label className="login-label">
          Введіть код доступу:
          <input 
            type="text" 
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="login-input"
            placeholder={role === 'student' ? "Ваш персональний код" : "Код вчителя"}
          />
        </label>
        
        <button onClick={handleLogin} className="login-button">
          Увійти
        </button>
      </div>
      
      <div className="login-hint">
        <p>Для вчителя використовуйте код: teacher123</p>
        <p>Для учня використовуйте свій ID: 1, 2, 3, ...</p>
      </div>
    </div>
  );
}

export default LoginPage;