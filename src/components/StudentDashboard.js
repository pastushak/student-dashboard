import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './StudentDashboard.css';

// Функція для отримання даних з локального сховища або використання демо-даних
const getStoredData = () => {
  const savedStudents = localStorage.getItem('students');
  const savedTests = localStorage.getItem('tests');
  const savedResults = localStorage.getItem('results');
  
  const defaultStudents = [
    { id: 1, name: "Векерик Анастасія" },
    { id: 2, name: "Дидичин Катерина" },
    { id: 3, name: "Жиляк Олександр" },
    { id: 4, name: "Коцюр Артем" },
    { id: 5, name: "Литвинський Максим" },
    { id: 6, name: "Мацишин Яна" },
    { id: 7, name: "Маціборко Тетяна" },
    { id: 8, name: "Осадчий Максим" },
    { id: 9, name: "Паращук Ангеліна" },
    { id: 10, name: "Паращук Юлія" },
    { id: 11, name: "Романюк Романа" },
    { id: 12, name: "Соколишин Соломія" },
    { id: 13, name: "Чобанюк Анастасія" },
    { id: 14, name: "Чорнецька Анастасія" },
    { id: 15, name: "Якубів Анастасія" }
  ];
  
  const defaultCategories = [
    { id: "own", name: "Власні варіанти" },
    { id: "training", name: "Тренувальні тести" }
  ];
  
  const defaultTests = [
    // Власні варіанти
    { id: "own1", name: "Тест 1", category: "own" },
    { id: "own2", name: "Тест 2", category: "own" },
    { id: "own3", name: "Тест 3", category: "own" },
    { id: "own4", name: "В3", category: "own" },
    { id: "own5", name: "В9", category: "own" },
    
    // Тренувальні тести
    { id: "tr01", name: "01", category: "training" },
    { id: "tr02", name: "02", category: "training" },
    // ... решта тестів
  ];
  
  // Початковий масив результатів (пустий)
  const defaultResults = [];
  
  return {
    students: savedStudents ? JSON.parse(savedStudents) : defaultStudents,
    categories: defaultCategories,
    tests: savedTests ? JSON.parse(savedTests) : defaultTests,
    results: savedResults ? JSON.parse(savedResults) : defaultResults
  };
};

// Таблиця переведення тестових балів у шкалу 100-200
const conversionTable = [
  { testScore: 0, scaledScore: 0 },
  { testScore: 1, scaledScore: 0 },
  // ... решта значень
  { testScore: 32, scaledScore: 200 }
];

// Мінімальний прохідний бал
const MIN_PASSING_TEST_SCORE = 5;
const MIN_PASSING_SCALED_SCORE = 100;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StudentDashboard = () => {
  // Отримуємо дані з локального сховища
  const { students, categories, tests, results } = getStoredData();
  const navigate = useNavigate();
  
  // Отримуємо дані авторизації
  const userRole = localStorage.getItem('userRole');
  const studentId = localStorage.getItem('studentId');
  
  // Стандартні стани дашборду
  const [selectedStudent, setSelectedStudent] = useState(userRole === 'student' ? parseInt(studentId) : null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scoreType, setScoreType] = useState("raw"); // "raw" або "scaled"
  const [filteredTests, setFilteredTests] = useState([]);
  const [averageScores, setAverageScores] = useState([]);
  const [individualProgress, setIndividualProgress] = useState([]);
  const [overallDistribution, setOverallDistribution] = useState([]);

  // Функція для конвертації тестового балу у шкалу 100-200
  const convertToScaledScore = (testScore) => {
    const entry = conversionTable.find(item => item.testScore === testScore);
    return entry ? entry.scaledScore : 0;
  };

  // Визначаємо, чи є результат "склав" або "не склав"
  const isPassing = (testScore) => {
    return testScore >= MIN_PASSING_TEST_SCORE;
  };
  
  // Функція для отримання тільки прізвища
  const getStudentSurname = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    return nameParts[0];
  };

  // Функція виходу
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentId');
    navigate('/login'); // перенаправлення на сторінку входу
  };

  useEffect(() => {
    // Встановлюємо першу категорію як вибрану за замовчуванням
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
    
    // Фільтруємо тести за вибраною категорією
    if (selectedCategory) {
      const filtered = tests.filter(test => test.category === selectedCategory);
      setFilteredTests(filtered);
    }
    
    // Встановлюємо першого студента як вибраного за замовчуванням для вчителя
    if (userRole === 'teacher' && students.length > 0 && !selectedStudent) {
      handleStudentSelect(students[0].id);
    }
  }, [selectedCategory, selectedStudent, categories, students, tests, userRole]);
  
  // ... інші useEffect і функції без змін ...
  
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    updateIndividualProgress(studentId);
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleScoreTypeToggle = () => {
    setScoreType(prev => prev === "raw" ? "scaled" : "raw");
  };

  // ... решта функцій без змін ...

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Дашборд успішності учнів</h1>
        <div className="dashboard-controls">
          {userRole === 'teacher' && (
            <Link to="/data-entry" className="data-entry-button">
              Внести результати
            </Link>
          )}
          <button onClick={handleLogout} className="logout-button">
            Вийти
          </button>
        </div>
      </header>
      
      <div className="score-toggle">
        <span className="score-toggle-label">Тип балів:</span>
        <button 
          className={`score-toggle-button ${scoreType === "raw" ? 'active' : ''}`}
          onClick={() => setScoreType("raw")}
        >
          Тестові бали (0-32)
        </button>
        <button 
          className={`score-toggle-button ${scoreType === "scaled" ? 'active' : ''}`}
          onClick={() => setScoreType("scaled")}
        >
          Шкала 100-200
        </button>
      </div>
      
      {/* Решта UI без змін */}
    </div>
  );
};

export default StudentDashboard;