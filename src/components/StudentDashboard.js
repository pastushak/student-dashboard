import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './StudentDashboard.css';

// Демонстраційні дані
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

const demoResults = [
  // Векерик Анастасія
  { studentId: 1, test: "Варіант 1", score: 92, maxScore: 100, date: "2025-03-01" },
  { studentId: 1, test: "Варіант 2", score: 94, maxScore: 100, date: "2025-03-15" },
  { studentId: 1, test: "Варіант 3", score: 96, maxScore: 100, date: "2025-04-01" },
  
  // Дидичин Катерина
  { studentId: 2, test: "Варіант 1", score: 88, maxScore: 100, date: "2025-03-01" },
  { studentId: 2, test: "Варіант 2", score: 91, maxScore: 100, date: "2025-03-15" },
  { studentId: 2, test: "Варіант 3", score: 89, maxScore: 100, date: "2025-04-01" },
  
  // Жиляк Олександр
  { studentId: 3, test: "Варіант 1", score: 75, maxScore: 100, date: "2025-03-01" },
  { studentId: 3, test: "Варіант 2", score: 80, maxScore: 100, date: "2025-03-15" },
  { studentId: 3, test: "Варіант 3", score: 83, maxScore: 100, date: "2025-04-01" },
  
  // Коцюр Артем
  { studentId: 4, test: "Варіант 1", score: 79, maxScore: 100, date: "2025-03-01" },
  { studentId: 4, test: "Варіант 2", score: 82, maxScore: 100, date: "2025-03-15" },
  { studentId: 4, test: "Варіант 3", score: 85, maxScore: 100, date: "2025-04-01" },
  
  // Литвинський Максим
  { studentId: 5, test: "Варіант 1", score: 90, maxScore: 100, date: "2025-03-01" },
  { studentId: 5, test: "Варіант 2", score: 92, maxScore: 100, date: "2025-03-15" },
  { studentId: 5, test: "Варіант 3", score: 91, maxScore: 100, date: "2025-04-01" },
  
  // Мацишин Яна
  { studentId: 6, test: "Варіант 1", score: 95, maxScore: 100, date: "2025-03-01" },
  { studentId: 6, test: "Варіант 2", score: 97, maxScore: 100, date: "2025-03-15" },
  { studentId: 6, test: "Варіант 3", score: 96, maxScore: 100, date: "2025-04-01" },
  
  // Маціборко Тетяна
  { studentId: 7, test: "Варіант 1", score: 85, maxScore: 100, date: "2025-03-01" },
  { studentId: 7, test: "Варіант 2", score: 87, maxScore: 100, date: "2025-03-15" },
  { studentId: 7, test: "Варіант 3", score: 86, maxScore: 100, date: "2025-04-01" },
  
  // Осадчий Максим
  { studentId: 8, test: "Варіант 1", score: 84, maxScore: 100, date: "2025-03-01" },
  { studentId: 8, test: "Варіант 2", score: 86, maxScore: 100, date: "2025-03-15" },
  { studentId: 8, test: "Варіант 3", score: 88, maxScore: 100, date: "2025-04-01" },
  
  // Паращук Ангеліна
  { studentId: 9, test: "Варіант 1", score: 92, maxScore: 100, date: "2025-03-01" },
  { studentId: 9, test: "Варіант 2", score: 94, maxScore: 100, date: "2025-03-15" },
  { studentId: 9, test: "Варіант 3", score: 93, maxScore: 100, date: "2025-04-01" },
  
  // Паращук Юлія
  { studentId: 10, test: "Варіант 1", score: 88, maxScore: 100, date: "2025-03-01" },
  { studentId: 10, test: "Варіант 2", score: 90, maxScore: 100, date: "2025-03-15" },
  { studentId: 10, test: "Варіант 3", score: 91, maxScore: 100, date: "2025-04-01" },
  
  // Романюк Романа
  { studentId: 11, test: "Варіант 1", score: 86, maxScore: 100, date: "2025-03-01" },
  { studentId: 11, test: "Варіант 2", score: 89, maxScore: 100, date: "2025-03-15" },
  { studentId: 11, test: "Варіант 3", score: 88, maxScore: 100, date: "2025-04-01" },
  
  // Соколишин Соломія
  { studentId: 12, test: "Варіант 1", score: 94, maxScore: 100, date: "2025-03-01" },
  { studentId: 12, test: "Варіант 2", score: 96, maxScore: 100, date: "2025-03-15" },
  { studentId: 12, test: "Варіант 3", score: 95, maxScore: 100, date: "2025-04-01" },
  
  // Чобанюк Анастасія
  { studentId: 13, test: "Варіант 1", score: 89, maxScore: 100, date: "2025-03-01" },
  { studentId: 13, test: "Варіант 2", score: 91, maxScore: 100, date: "2025-03-15" },
  { studentId: 13, test: "Варіант 3", score: 90, maxScore: 100, date: "2025-04-01" },
  
  // Чорнецька Анастасія
  { studentId: 14, test: "Варіант 1", score: 91, maxScore: 100, date: "2025-03-01" },
  { studentId: 14, test: "Варіант 2", score: 93, maxScore: 100, date: "2025-03-15" },
  { studentId: 14, test: "Варіант 3", score: 92, maxScore: 100, date: "2025-04-01" },
  
  // Якубів Анастасія
  { studentId: 15, test: "Варіант 1", score: 90, maxScore: 100, date: "2025-03-01" },
  { studentId: 15, test: "Варіант 2", score: 92, maxScore: 100, date: "2025-03-15" },
  { studentId: 15, test: "Варіант 3", score: 91, maxScore: 100, date: "2025-04-01" }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StudentDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [averageScores, setAverageScores] = useState([]);
  const [individualProgress, setIndividualProgress] = useState([]);
  const [overallDistribution, setOverallDistribution] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // Отримуємо унікальні тести
    const uniqueTests = [...new Set(demoResults.map(r => r.test))];
    setTests(uniqueTests);
    
    // Розраховуємо середні бали по кожному тесту
    const avgByTest = uniqueTests.map(test => {
      const testResults = demoResults.filter(r => r.test === test);
      const avgScore = testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length;
      return { test, avgScore: Math.round(avgScore * 10) / 10 };
    });
    setAverageScores(avgByTest);
    
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
    if (demoStudents.length > 0) {
      handleStudentSelect(demoStudents[0].id);
    }
  }, []);
  
  const handleStudentSelect = (studentId) => {
    setSelectedStudent(studentId);
    
    // Фільтруємо результати для вибраного студента
    const studentResults = demoResults
      .filter(r => r.studentId === studentId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setIndividualProgress(studentResults.map(r => ({
      test: r.test,
      score: r.score,
      date: new Date(r.date).toLocaleDateString('uk-UA')
    })));
  };
  
  const getStudentName = (id) => {
    const student = demoStudents.find(s => s.id === id);
    return student ? student.name : "";
  };
  
  const getStudentAverage = (id) => {
    const studentResults = demoResults.filter(r => r.studentId === id);
    if (studentResults.length === 0) return 0;
    
    const sum = studentResults.reduce((total, r) => total + r.score, 0);
    return Math.round((sum / studentResults.length) * 10) / 10;
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Дашборд успішності учнів</h1>
      
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
                  (Середній бал: {getStudentAverage(student.id)})
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {selectedStudent && (
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">
              Персональний прогрес: {getStudentName(selectedStudent)}
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
        <h2 className="dashboard-card-title">Порівняння успішності всіх учнів</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demoStudents.map(student => ({
                name: student.name,
                average: getStudentAverage(student.id)
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