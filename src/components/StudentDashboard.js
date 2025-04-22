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
    { id: "01", name: "Векерик Анастасія" },
    { id: "02", name: "Дидичин Катерина" },
    { id: "03", name: "Жиляк Олександр" },
    { id: "04", name: "Коцюр Артем" },
    { id: "05", name: "Литвинський Максим" },
    { id: "06", name: "Мацишин Яна" },
    { id: "07", name: "Маціборко Тетяна" },
    { id: "08", name: "Осадчий Максим" },
    { id: "09", name: "Паращук Ангеліна" },
    { id: "10", name: "Паращук Юлія" },
    { id: "11", name: "Романюк Романа" },
    { id: "12", name: "Соколишин Соломія" },
    { id: "13", name: "Чобанюк Анастасія" },
    { id: "14", name: "Чорнецька Анастасія" },
    { id: "15", name: "Якубів Анастасія" }
  ];
  
  const defaultCategories = [
    { id: "own", name: "Вхідні варіанти" },
    { id: "training", name: "Тренувальні тести" }
  ];
  
  const defaultTests = [
    // Вхідні варіанти
    { id: "own1", name: "Варіант 1", category: "own" },
    { id: "own2", name: "Варіант 2", category: "own" },
    { id: "own3", name: "Варіант 3", category: "own" },
    { id: "own4", name: "Варіант 4", category: "own" },
    { id: "own5", name: "Варіант 5", category: "own" },
    
    // Тренувальні тести (всі 40)
    { id: "tr01", name: "01", category: "training" },
    { id: "tr02", name: "02", category: "training" },
    { id: "tr03", name: "03", category: "training" },
    { id: "tr04", name: "04", category: "training" },
    { id: "tr05", name: "05", category: "training" },
    { id: "tr06", name: "06", category: "training" },
    { id: "tr07", name: "07", category: "training" },
    { id: "tr08", name: "08", category: "training" },
    { id: "tr09", name: "09", category: "training" },
    { id: "tr10", name: "10", category: "training" },
    { id: "tr11", name: "11", category: "training" },
    { id: "tr12", name: "12", category: "training" },
    { id: "tr13", name: "13", category: "training" },
    { id: "tr14", name: "14", category: "training" },
    { id: "tr15", name: "15", category: "training" },
    { id: "tr16", name: "16", category: "training" },
    { id: "tr17", name: "17", category: "training" },
    { id: "tr18", name: "18", category: "training" },
    { id: "tr19", name: "19", category: "training" },
    { id: "tr20", name: "20", category: "training" },
    { id: "tr21", name: "21", category: "training" },
    { id: "tr22", name: "22", category: "training" },
    { id: "tr23", name: "23", category: "training" },
    { id: "tr24", name: "24", category: "training" },
    { id: "tr25", name: "25", category: "training" },
    { id: "tr26", name: "26", category: "training" },
    { id: "tr27", name: "27", category: "training" },
    { id: "tr28", name: "28", category: "training" },
    { id: "tr29", name: "29", category: "training" },
    { id: "tr30", name: "30", category: "training" },
    { id: "tr31", name: "31", category: "training" },
    { id: "tr32", name: "32", category: "training" },
    { id: "tr33", name: "33", category: "training" },
    { id: "tr34", name: "34", category: "training" },
    { id: "tr35", name: "35", category: "training" },
    { id: "tr36", name: "36", category: "training" },
    { id: "tr37", name: "37", category: "training" },
    { id: "tr38", name: "38", category: "training" },
    { id: "tr39", name: "39", category: "training" },
    { id: "tr40", name: "40", category: "training" }
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

  const updateIndividualProgress = (studentId = selectedStudent) => {
    if (!studentId || !selectedCategory) return;
    
    // Отримуємо тести для вибраної категорії
    const testsInCategory = tests.filter(test => test.category === selectedCategory);
    
    // Фільтруємо результати для вибраного студента і тестів вибраної категорії
    const studentResults = results
      .filter(r => r.studentId === studentId && 
                  testsInCategory.some(test => test.id === r.testId))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setIndividualProgress(studentResults.map(r => {
      const test = tests.find(t => t.id === r.testId);
      const scaledScore = convertToScaledScore(r.score);
      const passed = isPassing(r.score);
      
      return {
        test: test ? test.name : r.testId,
        rawScore: r.score,
        scaledScore,
        score: scoreType === "raw" ? r.score : scaledScore,
        maxScore: scoreType === "raw" ? r.maxScore || 32 : 200,
        passed,
        date: new Date(r.date).toLocaleDateString('uk-UA')
      };
    }));
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