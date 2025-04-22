import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './StudentDashboard.css';

// Дані учнів
const demoStudents = [
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

// Категорії тестів
const testCategories = [
  { id: "own", name: "Власні варіанти" },
  { id: "training", name: "Тренувальні тести" }
];

// Тести
const tests = [
  // Власні варіанти
  { id: "own1", name: "Варіант 1", category: "own" },
  { id: "own2", name: "Варіант 2", category: "own" },
  { id: "own3", name: "Варіант 3", category: "own" },
  { id: "own4", name: "Варіант 4", category: "own" },
  { id: "own5", name: "Варіант 5", category: "own" },
  
  // Тренувальні тести (приклад перших 10 з 40)
  { id: "tr1", name: "Трен. тест 1", category: "training" },
  { id: "tr2", name: "Трен. тест 2", category: "training" },
  { id: "tr3", name: "Трен. тест 3", category: "training" },
  { id: "tr4", name: "Трен. тест 4", category: "training" },
  { id: "tr5", name: "Трен. тест 5", category: "training" },
  { id: "tr6", name: "Трен. тест 6", category: "training" },
  { id: "tr7", name: "Трен. тест 7", category: "training" },
  { id: "tr8", name: "Трен. тест 8", category: "training" },
  { id: "tr9", name: "Трен. тест 9", category: "training" },
  { id: "tr10", name: "Трен. тест 10", category: "training" },
  // ... можна додати решту тренувальних тестів
];

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

// Мінімальний прохідний бал (відповідно до таблиці конвертації)
const MIN_PASSING_TEST_SCORE = 5;
const MIN_PASSING_SCALED_SCORE = 100;

// Приклад результатів (для демонстрації)
const demoResults = [
  // Результати для "Власних варіантів"
  // Векерик Анастасія
  { studentId: 1, testId: "own1", score: 28, maxScore: 32, date: "2025-03-01" },
  { studentId: 1, testId: "own2", score: 30, maxScore: 32, date: "2025-03-15" },
  { studentId: 1, testId: "own3", score: 31, maxScore: 32, date: "2025-04-01" },
  { studentId: 1, testId: "own4", score: 29, maxScore: 32, date: "2025-04-15" },
  { studentId: 1, testId: "own5", score: 30, maxScore: 32, date: "2025-05-01" },
  
  // Результати для "Тренувальних тестів" (приклад перших 5)
  { studentId: 1, testId: "tr1", score: 26, maxScore: 32, date: "2025-05-05" },
  { studentId: 1, testId: "tr2", score: 27, maxScore: 32, date: "2025-05-10" },
  { studentId: 1, testId: "tr3", score: 28, maxScore: 32, date: "2025-05-15" },
  { studentId: 1, testId: "tr4", score: 29, maxScore: 32, date: "2025-05-20" },
  { studentId: 1, testId: "tr5", score: 30, maxScore: 32, date: "2025-05-25" },
  
  // Дидичин Катерина (аналогічно для всіх власних варіантів і кількох тренувальних)
  { studentId: 2, testId: "own1", score: 24, maxScore: 32, date: "2025-03-01" },
  { studentId: 2, testId: "own2", score: 26, maxScore: 32, date: "2025-03-15" },
  { studentId: 2, testId: "own3", score: 25, maxScore: 32, date: "2025-04-01" },
  { studentId: 2, testId: "own4", score: 27, maxScore: 32, date: "2025-04-15" },
  { studentId: 2, testId: "own5", score: 28, maxScore: 32, date: "2025-05-01" },
  { studentId: 2, testId: "tr1", score: 22, maxScore: 32, date: "2025-05-05" },
  { studentId: 2, testId: "tr2", score: 24, maxScore: 32, date: "2025-05-10" },
  
  // Жиляк Олександр
  { studentId: 3, testId: "own1", score: 18, maxScore: 32, date: "2025-03-01" },
  { studentId: 3, testId: "own2", score: 20, maxScore: 32, date: "2025-03-15" },
  { studentId: 3, testId: "own3", score: 22, maxScore: 32, date: "2025-04-01" },
  
  // Коцюр Артем
  { studentId: 4, testId: "own1", score: 19, maxScore: 32, date: "2025-03-01" },
  { studentId: 4, testId: "own2", score: 21, maxScore: 32, date: "2025-03-15" },
  { studentId: 4, testId: "own3", score: 23, maxScore: 32, date: "2025-04-01" },
  
  // Литвинський Максим
  { studentId: 5, testId: "own1", score: 25, maxScore: 32, date: "2025-03-01" },
  { studentId: 5, testId: "own2", score: 27, maxScore: 32, date: "2025-03-15" },
  { studentId: 5, testId: "own3", score: 26, maxScore: 32, date: "2025-04-01" },
  
  // Мацишин Яна
  { studentId: 6, testId: "own1", score: 30, maxScore: 32, date: "2025-03-01" },
  { studentId: 6, testId: "own2", score: 31, maxScore: 32, date: "2025-03-15" },
  { studentId: 6, testId: "own3", score: 32, maxScore: 32, date: "2025-04-01" },
  
  // Маціборко Тетяна
  { studentId: 7, testId: "own1", score: 23, maxScore: 32, date: "2025-03-01" },
  { studentId: 7, testId: "own2", score: 25, maxScore: 32, date: "2025-03-15" },
  { studentId: 7, testId: "own3", score: 24, maxScore: 32, date: "2025-04-01" },
  
  // Осадчий Максим
  { studentId: 8, testId: "own1", score: 22, maxScore: 32, date: "2025-03-01" },
  { studentId: 8, testId: "own2", score: 24, maxScore: 32, date: "2025-03-15" },
  { studentId: 8, testId: "own3", score: 26, maxScore: 32, date: "2025-04-01" },
  
  // Паращук Ангеліна
  { studentId: 9, testId: "own1", score: 28, maxScore: 32, date: "2025-03-01" },
  { studentId: 9, testId: "own2", score: 29, maxScore: 32, date: "2025-03-15" },
  { studentId: 9, testId: "own3", score: 30, maxScore: 32, date: "2025-04-01" },
  
  // Паращук Юлія
  { studentId: 10, testId: "own1", score: 26, maxScore: 32, date: "2025-03-01" },
  { studentId: 10, testId: "own2", score: 27, maxScore: 32, date: "2025-03-15" },
  { studentId: 10, testId: "own3", score: 28, maxScore: 32, date: "2025-04-01" },
  
  // Романюк Романа
  { studentId: 11, testId: "own1", score: 24, maxScore: 32, date: "2025-03-01" },
  { studentId: 11, testId: "own2", score: 26, maxScore: 32, date: "2025-03-15" },
  { studentId: 11, testId: "own3", score: 25, maxScore: 32, date: "2025-04-01" },
  
  // Соколишин Соломія
  { studentId: 12, testId: "own1", score: 29, maxScore: 32, date: "2025-03-01" },
  { studentId: 12, testId: "own2", score: 31, maxScore: 32, date: "2025-03-15" },
  { studentId: 12, testId: "own3", score: 30, maxScore: 32, date: "2025-04-01" },
  
  // Чобанюк Анастасія
  { studentId: 13, testId: "own1", score: 25, maxScore: 32, date: "2025-03-01" },
  { studentId: 13, testId: "own2", score: 27, maxScore: 32, date: "2025-03-15" },
  { studentId: 13, testId: "own3", score: 26, maxScore: 32, date: "2025-04-01" },
  
  // Чорнецька Анастасія
  { studentId: 14, testId: "own1", score: 27, maxScore: 32, date: "2025-03-01" },
  { studentId: 14, testId: "own2", score: 29, maxScore: 32, date: "2025-03-15" },
  { studentId: 14, testId: "own3", score: 28, maxScore: 32, date: "2025-04-01" },
  
  // Якубів Анастасія
  { studentId: 15, testId: "own1", score: 26, maxScore: 32, date: "2025-03-01" },
  { studentId: 15, testId: "own2", score: 28, maxScore: 32, date: "2025-03-15" },
  { studentId: 15, testId: "own3", score: 27, maxScore: 32, date: "2025-04-01" }
];

// Додамо декілька низьких результатів для демонстрації "не склав"
[...Array(5)].forEach((_, index) => {
  demoResults.push({
    studentId: 3 + index,
    testId: "tr1",
    score: 3,
    maxScore: 32,
    date: "2025-05-05"
  });
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StudentDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  useEffect(() => {
    // Встановлюємо першу категорію як вибрану за замовчуванням
    if (testCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(testCategories[0].id);
    }
    
    // Фільтруємо тести за вибраною категорією
    if (selectedCategory) {
      const filtered = tests.filter(test => test.category === selectedCategory);
      setFilteredTests(filtered);
    }
    
    // Встановлюємо першого студента як вибраного за замовчуванням
    if (demoStudents.length > 0 && !selectedStudent) {
      handleStudentSelect(demoStudents[0].id);
    }
  }, [selectedCategory, selectedStudent]);
  
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
      
      demoResults.forEach(result => {
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
      
      demoResults.forEach(result => {
        const range = scoreRanges.find(sr => 
          result.score >= sr.range[0] && result.score <= sr.range[1]
        );
        if (range) {
          range.count++;
        }
      });
      
      setOverallDistribution(scoreRanges);
    }
  }, [scoreType]);
  
  useEffect(() => {
    if (!selectedCategory) return;
    
    // Розраховуємо середні бали для тестів вибраної категорії
    const testsInCategory = tests.filter(test => test.category === selectedCategory);
    
    const avgByTest = testsInCategory.map(test => {
      const testResults = demoResults.filter(r => r.testId === test.id);
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
  }, [selectedCategory]);
  
  useEffect(() => {
    if (!selectedStudent || !selectedCategory) return;
    
    // Оновлюємо дані індивідуального прогресу при зміні студента або категорії
    updateIndividualProgress();
  }, [selectedStudent, selectedCategory, scoreType]);
  
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
    const studentResults = demoResults
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
    const student = demoStudents.find(s => s.id === id);
    return student ? student.name : "";
  };
  
  const getStudentAverage = (id, categoryId = null, useScaledScore = false) => {
    let relevantResults = demoResults.filter(r => r.studentId === id);
    
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
    let relevantResults = demoResults.filter(r => r.studentId === id);
    
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

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Дашборд успішності учнів</h1>
      
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
          {testCategories.map(category => (
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
          <h2 className="dashboard-card-title">Виберіть учня</h2>
          <div className="student-list">
            {demoStudents.map(student => (
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
            ))}
          </div>
        </div>
        
        {selectedStudent && (
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">
              Прогрес: {getStudentName(selectedStudent)} 
              <span className="category-label">
                ({testCategories.find(c => c.id === selectedCategory)?.name || 'Всі категорії'})
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
                      label={{ position: 'insideBottomRight', value: 'Мінімальний прохідний бал', fill: 'red', fontSize: 12 }} 
                    />
                  )}
                  {scoreType === "scaled" && (
                    <ReferenceLine y={MIN_PASSING_SCALED_SCORE} stroke="red" strokeDasharray="3 3" 
                      label={{ position: 'insideBottomRight', value: 'Мінімальний прохідний бал', fill: 'red', fontSize: 12 }} 
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
      
      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <h2 className="dashboard-card-title">
          Порівняння успішності всіх учнів
          <span className="category-label">
            ({testCategories.find(c => c.id === selectedCategory)?.name || 'Всі категорії'})
          </span>
        </h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demoStudents.map(student => ({
                name: student.name,
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
    </div>
  );
};

export default StudentDashboard;