import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
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

// Приклад результатів (для демонстрації)
const demoResults = [
  // Результати для "Власних варіантів"
  // Векерик Анастасія
  { studentId: 1, testId: "own1", score: 92, maxScore: 100, date: "2025-03-01" },
  { studentId: 1, testId: "own2", score: 94, maxScore: 100, date: "2025-03-15" },
  { studentId: 1, testId: "own3", score: 96, maxScore: 100, date: "2025-04-01" },
  { studentId: 1, testId: "own4", score: 95, maxScore: 100, date: "2025-04-15" },
  { studentId: 1, testId: "own5", score: 93, maxScore: 100, date: "2025-05-01" },
  
  // Результати для "Тренувальних тестів" (приклад перших 5)
  { studentId: 1, testId: "tr1", score: 88, maxScore: 100, date: "2025-05-05" },
  { studentId: 1, testId: "tr2", score: 90, maxScore: 100, date: "2025-05-10" },
  { studentId: 1, testId: "tr3", score: 89, maxScore: 100, date: "2025-05-15" },
  { studentId: 1, testId: "tr4", score: 92, maxScore: 100, date: "2025-05-20" },
  { studentId: 1, testId: "tr5", score: 94, maxScore: 100, date: "2025-05-25" },
  
  // Дидичин Катерина (аналогічно для всіх власних варіантів і кількох тренувальних)
  { studentId: 2, testId: "own1", score: 88, maxScore: 100, date: "2025-03-01" },
  { studentId: 2, testId: "own2", score: 91, maxScore: 100, date: "2025-03-15" },
  { studentId: 2, testId: "own3", score: 89, maxScore: 100, date: "2025-04-01" },
  { studentId: 2, testId: "own4", score: 90, maxScore: 100, date: "2025-04-15" },
  { studentId: 2, testId: "own5", score: 92, maxScore: 100, date: "2025-05-01" },
  { studentId: 2, testId: "tr1", score: 85, maxScore: 100, date: "2025-05-05" },
  { studentId: 2, testId: "tr2", score: 87, maxScore: 100, date: "2025-05-10" },
  
  // Аналогічно для інших учнів...
  // Додайте результати для решти учнів у такому ж форматі
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StudentDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredTests, setFilteredTests] = useState([]);
  const [averageScores, setAverageScores] = useState([]);
  const [individualProgress, setIndividualProgress] = useState([]);
  const [overallDistribution, setOverallDistribution] = useState([]);

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
    
    // Розрахунок розподілу загальних балів
    const scoreRanges = [
      { name: "90-100", range: [90, 100], count: 0 },
      { name: "80-89", range: [80, 89], count: 0 },
      { name: "70-79", range: [70, 79], count: 0 },
      { name: "60-69", range: [60, 69], count: 0 },
      { name: "<60", range: [0, 59], count: 0 }
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
    
    // Встановлюємо першого студента як вибраного за замовчуванням
    if (demoStudents.length > 0 && !selectedStudent) {
      handleStudentSelect(demoStudents[0].id);
    }
  }, [selectedCategory, selectedStudent]);
  
  useEffect(() => {
    if (!selectedCategory) return;
    
    // Розраховуємо середні бали для тестів вибраної категорії
    const testsInCategory = tests.filter(test => test.category === selectedCategory);
    
    const avgByTest = testsInCategory.map(test => {
      const testResults = demoResults.filter(r => r.testId === test.id);
      if (testResults.length === 0) return { test: test.name, avgScore: 0 };
      
      const avgScore = testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length;
      return { test: test.name, avgScore: Math.round(avgScore * 10) / 10 };
    });
    
    setAverageScores(avgByTest);
  }, [selectedCategory]);
  
  useEffect(() => {
    if (!selectedStudent || !selectedCategory) return;
    
    // Оновлюємо дані індивідуального прогресу при зміні студента або категорії
    updateIndividualProgress();
  }, [selectedStudent, selectedCategory]);
  
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    updateIndividualProgress(studentId);
  };
  
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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
      return {
        test: test ? test.name : r.testId,
        score: r.score,
        date: new Date(r.date).toLocaleDateString('uk-UA')
      };
    }));
  };
  
  const getStudentName = (id) => {
    const student = demoStudents.find(s => s.id === id);
    return student ? student.name : "";
  };
  
  const getStudentAverage = (id, categoryId = null) => {
    let relevantResults = demoResults.filter(r => r.studentId === id);
    
    // Якщо вказана категорія, фільтруємо результати за нею
    if (categoryId) {
      const testsInCategory = tests.filter(test => test.category === categoryId);
      relevantResults = relevantResults.filter(r => 
        testsInCategory.some(test => test.id === r.testId)
      );
    }
    
    if (relevantResults.length === 0) return 0;
    
    const sum = relevantResults.reduce((total, r) => total + r.score, 0);
    return Math.round((sum / relevantResults.length) * 10) / 10;
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Дашборд успішності учнів</h1>
      
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
                <span className="student-score">
                  (Сер. бал: {getStudentAverage(student.id, selectedCategory)})
                </span>
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
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Бали" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
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
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" name="Середній бал" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Розподіл загальних балів</h2>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                average: getStudentAverage(student.id, selectedCategory)
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" name="Середній бал" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;