import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    { id: 01, name: "Векерик Анастасія" },
    { id: 02, name: "Дидичин Катерина" },
    { id: 03, name: "Жиляк Олександр" },
    { id: 04, name: "Коцюр Артем" },
    { id: 05, name: "Литвинський Максим" },
    { id: 06, name: "Мацишин Яна" },
    { id: 07, name: "Маціборко Тетяна" },
    { id: 08, name: "Осадчий Максим" },
    { id: 09, name: "Паращук Ангеліна" },
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
  { testScore: 2, scaledScore: 0 },
  { testScore: 3, scaledScore: 0 },
  { testScore: 4, scaledScore: 0 },
  { testScore: 5, scaledScore: 100 },
  { testScore: 6, scaledScore: 108 },
  { testScore: 7, scaledScore: 115 },
  { testScore: 8, scaledScore: 123 },
  { testScore: 9, scaledScore: 131 },
  { testScore: 10, scaledScore: 134 },
  { testScore: 11, scaledScore: 137 },
  { testScore: 12, scaledScore: 140 },
  { testScore: 13, scaledScore: 143 },
  { testScore: 14, scaledScore: 145 },
  { testScore: 15, scaledScore: 147 },
  { testScore: 16, scaledScore: 148 },
  { testScore: 17, scaledScore: 149 },
  { testScore: 18, scaledScore: 150 },
  { testScore: 19, scaledScore: 151 },
  { testScore: 20, scaledScore: 152 },
  { testScore: 21, scaledScore: 155 },
  { testScore: 22, scaledScore: 159 },
  { testScore: 23, scaledScore: 163 },
  { testScore: 24, scaledScore: 167 },
  { testScore: 25, scaledScore: 170 },
  { testScore: 26, scaledScore: 173 },
  { testScore: 27, scaledScore: 176 },
  { testScore: 28, scaledScore: 180 },
  { testScore: 29, scaledScore: 184 },
  { testScore: 30, scaledScore: 189 },
  { testScore: 31, scaledScore: 194 },
  { testScore: 32, scaledScore: 200 }
];

// Мінімальний прохідний бал
const MIN_PASSING_TEST_SCORE = 5;
const MIN_PASSING_SCALED_SCORE = 100;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StudentDashboard = () => {
  // Отримуємо дані з локального сховища
  const { students, categories, tests, results } = getStoredData();
  
  // Отримуємо дані авторизації
  const userRole = localStorage.getItem('userRole');
  const studentId = localStorage.getItem('studentId');
  
  // Додаємо стани для авторизації
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(userRole));
  const [loginCode, setLoginCode] = useState('');
  const [loginError, setLoginError] = useState('');
  
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

  // Функція входу
  const handleLogin = () => {
    // Перевірка коду вчителя (можна змінити на будь-який інший код)
    if (loginCode === 'teacher123') {
      localStorage.setItem('userRole', 'teacher');
      setIsLoggedIn(true);
      return;
    }
    
    // Перевірка коду учня (використовуємо ID)
    const studentIds = students.map(s => s.id.toString());
    if (studentIds.includes(loginCode)) {
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('studentId', loginCode);
      setIsLoggedIn(true);
      setSelectedStudent(parseInt(loginCode));
      return;
    }
    
    // Якщо код не підходить
    setLoginError('Невірний код доступу. Спробуйте ще раз.');
  };

  // Функція виходу
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentId');
    setIsLoggedIn(false);
    setLoginCode('');
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
  
  useEffect(() => {
    // Розрахунок розподілу балів за шкалою 100-200
    if (scoreType === "scaled") {
      const scoreRanges = [
        { name: "180-200", range: [180, 200], count: 0 },
        { name: "160-179", range: [160, 179], count: 0 },
        { name: "140-159", range: [140, 159], count: 0 },
        { name: "120-139", range: [120, 139], count: 0 },
        { name: "100-119", range: [100, 119], count: 0 },
        { name: "Не склав", range: [0, 99], count: 0 }
      ];
      
      // Фільтруємо результати за роллю
      let relevantResults = results;
      if (userRole === 'student') {
        relevantResults = results.filter(r => r.studentId === parseInt(studentId));
      }
      
      relevantResults.forEach(result => {
        const scaledScore = convertToScaledScore(result.score);
        const range = scoreRanges.find(sr => 
          scaledScore >= sr.range[0] && scaledScore <= sr.range[1]
        );
        if (range) {
          range.count++;
        }
      });
      
      setOverallDistribution(scoreRanges);
    } else {
      // Розрахунок розподілу тестових балів
      const scoreRanges = [
        { name: "28-32", range: [28, 32], count: 0 },
        { name: "22-27", range: [22, 27], count: 0 },
        { name: "16-21", range: [16, 21], count: 0 },
        { name: "10-15", range: [10, 15], count: 0 },
        { name: "5-9", range: [5, 9], count: 0 },
        { name: "Не склав", range: [0, 4], count: 0 }
      ];
      
      // Фільтруємо результати за роллю
      let relevantResults = results;
      if (userRole === 'student') {
        relevantResults = results.filter(r => r.studentId === parseInt(studentId));
      }
      
      relevantResults.forEach(result => {
        const range = scoreRanges.find(sr => 
          result.score >= sr.range[0] && result.score <= sr.range[1]
        );
        if (range) {
          range.count++;
        }
      });
      
      setOverallDistribution(scoreRanges);
    }
  }, [scoreType, results, userRole, studentId]);
  
  useEffect(() => {
    if (!selectedCategory) return;
    
    // Розраховуємо середні бали для тестів вибраної категорії
    const testsInCategory = tests.filter(test => test.category === selectedCategory);
    
    const avgByTest = testsInCategory.map(test => {
      // Фільтруємо результати за роллю
      let testResults = results.filter(r => r.testId === test.id);
      if (userRole === 'student') {
        testResults = testResults.filter(r => r.studentId === parseInt(studentId));
      }
      
      if (testResults.length === 0) return { 
        test: test.name, 
        avgRawScore: 0,
        avgScaledScore: 0,
        passRate: 0
      };
      
      const totalRawScore = testResults.reduce((sum, result) => sum + result.score, 0);
      const avgRawScore = Math.round((totalRawScore / testResults.length) * 10) / 10;
      
      const totalScaledScore = testResults.reduce((sum, result) => sum + convertToScaledScore(result.score), 0);
      const avgScaledScore = Math.round((totalScaledScore / testResults.length) * 10) / 10;
      
      const passCount = testResults.filter(r => isPassing(r.score)).length;
      const passRate = Math.round((passCount / testResults.length) * 100);
      
      return { 
        test: test.name, 
        avgRawScore, 
        avgScaledScore,
        passRate
      };
    });
    
    setAverageScores(avgByTest);
  }, [selectedCategory, tests, results, userRole, studentId]);
  
  useEffect(() => {
    if (!selectedStudent || !selectedCategory) return;
    
    // Оновлюємо дані індивідуального прогресу при зміні студента або категорії
    updateIndividualProgress();
  }, [selectedStudent, selectedCategory, scoreType, tests, results]);
  
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
        maxScore: scoreType === "raw" ? r.maxScore : 200,
        passed,
        date: new Date(r.date).toLocaleDateString('uk-UA')
      };
    }));
  };
  
  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? student.name : "";
  };
  
  const getStudentAverage = (id, categoryId = null, useScaledScore = false) => {
    let relevantResults = results.filter(r => r.studentId === id);
    
    // Якщо вказана категорія, фільтруємо результати за нею
    if (categoryId) {
      const testsInCategory = tests.filter(test => test.category === categoryId);
      relevantResults = relevantResults.filter(r => 
        testsInCategory.some(test => test.id === r.testId)
      );
    }
    
    if (relevantResults.length === 0) return 0;
    
    if (useScaledScore) {
      const sum = relevantResults.reduce((total, r) => total + convertToScaledScore(r.score), 0);
      return Math.round((sum / relevantResults.length) * 10) / 10;
    } else {
      const sum = relevantResults.reduce((total, r) => total + r.score, 0);
      return Math.round((sum / relevantResults.length) * 10) / 10;
    }
  };
  
  const getStudentPassRate = (id, categoryId = null) => {
    let relevantResults = results.filter(r => r.studentId === id);
    
    // Якщо вказана категорія, фільтруємо результати за нею
    if (categoryId) {
      const testsInCategory = tests.filter(test => test.category === categoryId);
      relevantResults = relevantResults.filter(r => 
        testsInCategory.some(test => test.id === r.testId)
      );
    }
    
    if (relevantResults.length === 0) return "0%";
    
    const passCount = relevantResults.filter(r => isPassing(r.score)).length;
    const passRate = Math.round((passCount / relevantResults.length) * 100);
    
    return `${passRate}%`;
  };

  const getAverageLabel = () => {
    return scoreType === "raw" ? "Середній тестовий бал" : "Середній бал 100-200";
  };

  const getScoreLabel = () => {
    return scoreType === "raw" ? "Тестовий бал" : "Бал 100-200";
  };

  const getMaxScore = () => {
    return scoreType === "raw" ? 32 : 200;
  };

// Екран входу, якщо користувач не авторизований
if (!isLoggedIn) {
  return (
    <div className="login-container">
      <h1 className="login-title">Вхід до дашборду успішності</h1>
      
      {loginError && <div className="login-error">{loginError}</div>}
      
      <div className="login-form">
        <label className="login-label">
          Введіть код доступу:
          <input 
            type="text" 
            value={loginCode}
            onChange={(e) => setLoginCode(e.target.value)}
            className="login-input"
            placeholder="Код учня або вчителя"
          />
        </label>
        
        <button 
          onClick={handleLogin} 
          className="login-button"
        >
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

// Основний дашборд для авторизованого користувача
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
    
    <div className="category-selector">
      <h2 className="dashboard-subtitle">Виберіть категорію тестів:</h2>
      <div className="category-buttons">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
    
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="dashboard-card-title">
          {userRole === 'teacher' ? 'Виберіть учня' : 'Ваш профіль'}
        </h2>
        <div className="student-list">
          {userRole === 'teacher' 
            ? students.map(student => (
                <div 
                  key={student.id} 
                  className={`student-item ${selectedStudent === student.id ? 'active' : ''}`}
                  onClick={() => handleStudentSelect(student.id)}
                >
                  <span className="student-name">{student.name}</span>
                  <div className="student-stats">
                    <span className="student-score">
                      {getScoreLabel()}: {
                        scoreType === "raw" 
                        ? getStudentAverage(student.id, selectedCategory) 
                        : getStudentAverage(student.id, selectedCategory, true)
                      }
                    </span>
                    <span className="student-pass-rate">
                      Склав: {getStudentPassRate(student.id, selectedCategory)}
                    </span>
                  </div>
                </div>
              ))
            : students
                .filter(student => student.id === parseInt(studentId))
                .map(student => (
                  <div 
                    key={student.id} 
                    className="student-item active"
                  >
                    <span className="student-name">{student.name}</span>
                    <div className="student-stats">
                      <span className="student-score">
                        {getScoreLabel()}: {
                          scoreType === "raw" 
                          ? getStudentAverage(student.id, selectedCategory) 
                          : getStudentAverage(student.id, selectedCategory, true)
                        }
                      </span>
                      <span className="student-pass-rate">
                        Склав: {getStudentPassRate(student.id, selectedCategory)}
                      </span>
                    </div>
                  </div>
                ))
          }
        </div>
      </div>
      
      {selectedStudent && (
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">
            Прогрес: {getStudentName(selectedStudent)} 
            <span className="category-label">
              ({categories.find(c => c.id === selectedCategory)?.name || 'Всі категорії'})
            </span>
          </h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={individualProgress}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis domain={[0, getMaxScore()]} />
                <Tooltip 
                  formatter={(value, name, props) => {
                    // Додаємо статус "склав"/"не склав" у тултіп
                    if (name === getScoreLabel()) {
                      const passed = props.payload.passed;
                      return [`${value} (${passed ? 'Склав' : 'Не склав'})`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                {scoreType === "raw" && (
                  <ReferenceLine y={MIN_PASSING_TEST_SCORE} stroke="red" strokeDasharray="3 3" 
                    label={{ position: 'insideBottomRight', value: 'Прохідний бал', fill: 'red', fontSize: 12 }} 
                  />
                )}
                {scoreType === "scaled" && (
                  <ReferenceLine y={MIN_PASSING_SCALED_SCORE} stroke="red" strokeDasharray="3 3" 
                    label={{ position: 'insideBottomRight', value: 'Прохідний бал', fill: 'red', fontSize: 12 }} 
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name={getScoreLabel()} 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                  // Встановлюємо колір точок залежно від того, склав студент тест чи ні
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={5} 
                        fill={payload.passed ? "#8884d8" : "#ff0000"}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>

    <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Середні бали за варіантами</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={averageScores}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis domain={[0, scoreType === "raw" ? 32 : 200]} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey={scoreType === "raw" ? "avgRawScore" : "avgScaledScore"} 
                  name={getAverageLabel()} 
                  fill="#82ca9d" 
                />
                {scoreType === "raw" && (
                  <ReferenceLine y={MIN_PASSING_TEST_SCORE} stroke="red" strokeDasharray="3 3" />
                )}
                {scoreType === "scaled" && (
                  <ReferenceLine y={MIN_PASSING_SCALED_SCORE} stroke="red" strokeDasharray="3 3" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Розподіл балів</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {overallDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === "Не склав" ? "#ff0000" : COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

{/* Діаграма порівняння успішності всіх учнів (тільки для ролі вчителя) */}
{userRole === 'teacher' && (
        <div className="dashboard-card" style={{ marginTop: '24px' }}>
          <h2 className="dashboard-card-title">
            Порівняння успішності всіх учнів
            <span className="category-label">
              ({categories.find(c => c.id === selectedCategory)?.name || 'Всі категорії'})
            </span>
          </h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={students.map(student => ({
                  name: getStudentSurname(student.name), // Показуємо тільки прізвище
                  average: scoreType === "raw" 
                    ? getStudentAverage(student.id, selectedCategory) 
                    : getStudentAverage(student.id, selectedCategory, true)
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, scoreType === "raw" ? 32 : 200]} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="average" 
                  name={getAverageLabel()} 
                  fill="#8884d8" 
                />
                {scoreType === "raw" && (
                  <ReferenceLine y={MIN_PASSING_TEST_SCORE} stroke="red" strokeDasharray="3 3" />
                )}
                {scoreType === "scaled" && (
                  <ReferenceLine y={MIN_PASSING_SCALED_SCORE} stroke="red" strokeDasharray="3 3" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;