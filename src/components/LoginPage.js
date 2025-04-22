else if (role === 'student') {
  // Перевірка, чи існує учень з таким кодом
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const student = students.find(s => s.id === accessCode);
  
  if (student) {
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('studentId', student.id);
    navigate('/'); // Перенаправлення на дашборд учня
  } else {
    setError('Неправильний код доступу. Спробуйте ще раз.');
  }
}