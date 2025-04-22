import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Демонстраційні дані
const demoStudents = [
  { id: 1, name: "Анна Петренко" },
  { id: 2, name: "Іван Коваленко" },
  { id: 3, name: "Марія Шевченко" },
  { id: 4, name: "Олег Сидоренко" },
  { id: 5, name: "Юлія Мельник" }
];

const demoResults = [
  { studentId: 1, test: "Варіант 1", score: 85, maxScore: 100, date: "2025-03-01" },
  { studentId: 1, test: "Варіант 2", score: 90, maxScore: 100, date: "2025-03-15" },
  { studentId: 1, test: "Варіант 3", score: 88, maxScore: 100, date: "2025-04-01" },
  
  { studentId: 2, test: "Варіант 1", score: 70, maxScore: 100, date: "2025-03-01" },
  { studentId: 2, test: "Варіант 2", score: 80, maxScore: 100, date: "2025-03-15" },
  { studentId: 2, test: "Варіант 3", score: 85, maxScore: 100, date: "2025-04-01" },
  
  { studentId: 3, test: "Варіант 1", score: 95, maxScore: 100, date: "2025-03-01" },
  { studentId: 3, test: "Варіант 2", score: 92, maxScore: 100, date: "2025-03-15" },
  { studentId: 3, test: "Варіант 3", score: 96, maxScore: 100, date: "2025-04-01" },
  
  { studentId: 4, test: "Варіант 1", score: 65, maxScore: 100, date: "2025-03-01" },
  { studentId: 4, test: "Варіант 2", score: 75, maxScore: 100, date: "2025-03-15" },
  { studentId: 4, test: "Варіант 3", score: 78, maxScore: 100, date: "2025-04-01" },
  
  { studentId: 5, test: "Варіант 1", score: 80, maxScore: 100, date: "2025-03-01" },
  { studentId: 5, test: "Варіант 2", score: 85, maxScore: 100, date: "2025-03-15" },
  { studentId: 5, test: "Варіант 3", score: 90, maxScore: 100, date: "2025-04-01" }
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
    <div className="p-4 w-full bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Дашборд успішності учнів</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Виберіть учня</h2>
          <div className="space-y-2">
            {demoStudents.map(student => (
              <div 
                key={student.id} 
                className={`p-2 cursor-pointer rounded ${selectedStudent === student.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
                onClick={() => handleStudentSelect(student.id)}
              >
                <span className="font-medium">{student.name}</span>
                <span className="ml-2 text-sm text-gray-500">
                  (Середній бал: {getStudentAverage(student.id)})
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {selectedStudent && (
          <div className="bg-white p-4 rounded shadow md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">
              Персональний прогрес: {getStudentName(selectedStudent)}
            </h2>
            <div className="h-64">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Середні бали за варіантами</h2>
          <div className="h-64">
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
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Розподіл загальних балів</h2>
          <div className="h-64">
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
      
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Порівняння успішності всіх учнів</h2>
        <div className="h-64">
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