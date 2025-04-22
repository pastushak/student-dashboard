function LoginPage() {
    const [accessCode, setAccessCode] = useState('');
    const [role, setRole] = useState('student'); // 'student' або 'teacher'
    
    const handleLogin = () => {
      if (role === 'teacher' && accessCode === 'TEACHER_SECRET_CODE') {
        localStorage.setItem('userRole', 'teacher');
        // Перенаправлення на дашборд вчителя
      } else {
        // Перевірка, чи існує учень з таким кодом
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        const student = students.find(s => s.id.toString() === accessCode);
        
        if (student) {
          localStorage.setItem('userRole', 'student');
          localStorage.setItem('studentId', student.id);
          // Перенаправлення на дашборд учня
        } else {
          // Показати помилку
        }
      }
    };
    
    return (
      <div className="login-container">
        <h1>Вхід до дашборду успішності</h1>
        
        <div className="role-selector">
          <button 
            className={role === 'student' ? 'active' : ''}
            onClick={() => setRole('student')}
          >
            Я учень
          </button>
          <button 
            className={role === 'teacher' ? 'active' : ''}
            onClick={() => setRole('teacher')}
          >
            Я вчитель
          </button>
        </div>
        
        <div className="form-group">
          <label>Введіть код доступу:</label>
          <input 
            type="text" 
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder={role === 'student' ? "Ваш персональний код" : "Код вчителя"}
          />
        </div>
        
        <button onClick={handleLogin} className="login-button">
          Увійти
        </button>
      </div>
    );
  }