import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { supabase } from '../supabase';

const AnalyticsDashboard = ({ userRole }) => {
  // Дані учнів
  const students = [
    { id: "01", name: "Векерик А." },
    { id: "02", name: "Дидичин К." },
    { id: "03", name: "Жиляк О." },
    { id: "04", name: "Коцюр А." },
    { id: "05", name: "Литвинський М." },
    { id: "06", name: "Мацишин Я." },
    { id: "07", name: "Маціборко Т." },
    { id: "08", name: "Осадчий М." },
    { id: "09", name: "Паращук А." },
    { id: "10", name: "Паращук Ю." },
    { id: "11", name: "Романюк Р." },
    { id: "12", name: "Соколишин С." },
    { id: "13", name: "Чобанюк А." },
    { id: "14", name: "Чорнецька А." },
    { id: "15", name: "Якубів А." }
  ];

  // Категорії тестів
  const categories = [
    { id: "own", name: "Вхідні варіанти" },
    { id: "training", name: "Тренувальні тести" }
  ];

  // Тести
  const tests = [
    // Вхідні варіанти
    { id: "own1", name: "Варіант 1", category: "own" },
    { id: "own2", name: "Варіант 2", category: "own" },
    { id: "own3", name: "Варіант 3", category: "own" },
    { id: "own4", name: "Варіант 4", category: "own" },
    { id: "own5", name: "Варіант 5", category: "own" },
    // Тренувальні тести (показуємо тільки перші 10 для спрощення)
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

  // Таблиця конвертації балів
  const conversionTable = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
    5: 100, 6: 108, 7: 115, 8: 123, 9: 131,
    10: 134, 11: 137, 12: 140, 13: 143, 14: 145,
    15: 147, 16: 148, 17: 149, 18: 150, 19: 151,
    20: 152, 21: 155, 22: 159, 23: 163, 24: 167,
    25: 170, 26: 173, 27: 176, 28: 180, 29: 184,
    30: 189, 31: 194, 32: 200
  };

  // Стан для зберігання результатів та налаштувань
  const [results, setResults] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("own");
  const [selectedChart, setSelectedChart] = useState("averageScores");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAllStudents, setShowAllStudents] = useState(true);
  const [timeRange, setTimeRange] = useState("all"); // all, last3, last5
  const [topStudentsCount, setTopStudentsCount] = useState(5);
  const [loading, setLoading] = useState(true);

  // Завантаження результатів з Supabase
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*');
        
        if (error) {
          console.error('Помилка при завантаженні даних:', error);
          return;
        }
        
        // Перетворюємо результати у потрібний формат
        const formattedResults = {};
        
        data.forEach(item => {
          if (!formattedResults[item.student_id]) {
            formattedResults[item.student_id] = {};
          }
          
          formattedResults[item.student_id][item.test_id] = item.score;
        });
        
        setResults(formattedResults);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Конвертація тестового балу в бал за шкалою 100-200
  const convertScore = (score) => {
    return conversionTable[score] || 0;
  };

  // Отримання середнього балу учня за категорією
  const getStudentAverage = (studentId, category) => {
    const studentResults = results[studentId] || {};
    const categoryTests = tests.filter(test => test.category === category);
    
    let totalScore = 0;
    let count = 0;
    
    categoryTests.forEach(test => {
      if (studentResults[test.id] !== undefined) {
        totalScore += convertScore(studentResults[test.id]);
        count++;
      }
    });
    
    return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
  };

  // Отримання даних для графіків
  const getChartData = () => {
    switch (selectedChart) {
      case "averageScores":
        return students.map(student => ({
          name: student.name,
          average: getStudentAverage(student.id, selectedCategory)
        })).sort((a, b) => b.average - a.average);
      
      case "scoreDistribution":
        // Розподіл оцінок за діапазонами (100-120, 120-140, ...)
        const ranges = [
          { range: "100-120", count: 0 },
          { range: "121-140", count: 0 },
          { range: "141-160", count: 0 },
          { range: "161-180", count: 0 },
          { range: "181-200", count: 0 }
        ];
        
        students.forEach(student => {
          const avg = getStudentAverage(student.id, selectedCategory);
          if (avg >= 100 && avg <= 120) ranges[0].count++;
          else if (avg > 120 && avg <= 140) ranges[1].count++;
          else if (avg > 140 && avg <= 160) ranges[2].count++;
          else if (avg > 160 && avg <= 180) ranges[3].count++;
          else if (avg > 180 && avg <= 200) ranges[4].count++;
        });
        
        return ranges;
      
      case "progressOverTime":
        if (selectedStudent) {
          const studentResults = results[selectedStudent] || {};
          return tests
            .filter(test => test.category === selectedCategory)
            .map(test => ({
              name: test.name,
              score: studentResults[test.id] ? convertScore(studentResults[test.id]) : 0
            }));
        }
        return [];
      
      case "compareStudents":
        // Порівняння вибраних учнів за категоріями
        return students.map(student => ({
          name: student.name,
          'Вхідні варіанти': getStudentAverage(student.id, "own"),
          'Тренувальні тести': getStudentAverage(student.id, "training")
        }));
      
      case "topStudents":
        // Топ учнів за середнім балом
        return students
          .map(student => ({
            name: student.name,
            average: getStudentAverage(student.id, selectedCategory)
          }))
          .filter(item => item.average > 0)
          .sort((a, b) => b.average - a.average)
          .slice(0, topStudentsCount);
          
      case "scoresPerTest":
        // Середній бал класу за кожним тестом
        return tests
          .filter(test => test.category === selectedCategory)
          .map(test => {
            let totalScore = 0;
            let count = 0;
            
            students.forEach(student => {
              if (results[student.id] && results[student.id][test.id] !== undefined) {
                totalScore += convertScore(results[student.id][test.id]);
                count++;
              }
            });
            
            return {
              name: test.category === "own" ? `Варіант ${test.name}` : `Тест ${test.name}`,
              average: count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0
            };
          });
      
      default:
        return [];
    }
  };

  // Отримання загальної статистики
  const getStats = () => {
    let totalScores = 0;
    let totalCount = 0;
    let highestScore = 0;
    let highestStudent = '';
    let lowestScore = 200;
    let lowestStudent = '';
    
    students.forEach(student => {
      const avg = getStudentAverage(student.id, selectedCategory);
      if (avg > 0) {
        totalScores += avg;
        totalCount++;
        
        if (avg > highestScore) {
          highestScore = avg;
          highestStudent = student.name;
        }
        
        if (avg < lowestScore && avg > 0) {
          lowestScore = avg;
          lowestStudent = student.name;
        }
      }
    });
    
    return {
      averageScore: totalCount > 0 ? (totalScores / totalCount).toFixed(2) : 0,
      highestScore: highestScore.toFixed(2),
      highestStudent,
      lowestScore: lowestScore < 200 ? lowestScore.toFixed(2) : 0,
      lowestStudent: lowestStudent || '-',
      studentsCount: totalCount
    };
  };

  // Отримання загальної динаміки класу
  const getClassProgress = () => {
    // Беремо тільки вхідні варіанти для аналізу прогресу
    const ownTests = tests.filter(t => t.category === "own");
    
    const data = ownTests.map(test => {
      let totalConverted = 0;
      let count = 0;
      
      students.forEach(student => {
        if (results[student.id] && results[student.id][test.id] !== undefined) {
          totalConverted += convertScore(results[student.id][test.id]);
          count++;
        }
      });
      
      const average = count > 0 ? totalConverted / count : 0;
      
      return {
        name: `Варіант ${test.name}`,
        average: parseFloat(average.toFixed(2))
      };
    });
    
    return data;
  };

  // Визначення зростання/спадання для учня
  const getStudentTrend = (studentId) => {
    const studentResults = results[studentId] || {};
    const categoryTests = tests
      .filter(test => test.category === selectedCategory)
      .sort((a, b) => {
        const aNum = parseInt(a.name.replace(/\D/g, ''));
        const bNum = parseInt(b.name.replace(/\D/g, ''));
        return aNum - bNum;
      });
    
    // Беремо тільки тести, для яких є результати
    const validTests = categoryTests.filter(test => 
      studentResults[test.id] !== undefined
    );
    
    if (validTests.length < 2) return "neutral"; // Недостатньо даних
    
    // Беремо перший і останній тест для аналізу тренду
    const firstTest = validTests[0];
    const lastTest = validTests[validTests.length - 1];
    
    const firstScore = convertScore(studentResults[firstTest.id]);
    const lastScore = convertScore(studentResults[lastTest.id]);
    
    if (lastScore > firstScore) return "up";
    if (lastScore < firstScore) return "down";
    return "neutral";
  };

  // Кольори для графіків
  const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

  // Графіки для відображення
  const charts = [
    { id: "averageScores", name: "Середні бали учнів" },
    { id: "scoreDistribution", name: "Розподіл оцінок" },
    { id: "progressOverTime", name: "Прогрес учня" },
    { id: "compareStudents", name: "Порівняння учнів" },
    { id: "topStudents", name: "Топ учнів" },
    { id: "scoresPerTest", name: "Результати за тестами" }
  ];

  // Отримуємо дані для поточного графіка
  const chartData = getChartData();
  const stats = getStats();

  // Рендеримо вибраний графік
  const renderChart = () => {
    switch (selectedChart) {
      case "averageScores":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 200]} />
              <Tooltip formatter={(value) => [`${value}`, 'Середній бал']} />
              <Bar dataKey="average" fill="#3498db" name="Середній бал" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "scoreDistribution":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="count"
                nameKey="range"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} учнів`, 'Кількість']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case "progressOverTime":
        return (
          <div>
            <div className="chart-controls">
              <select 
                value={selectedStudent || ""} 
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Виберіть учня</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            
            {selectedStudent ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart 
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 200]} />
                  <Tooltip formatter={(value) => [`${value}`, 'Бал']} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3498db" 
                    activeDot={{ r: 8 }} 
                    name="Бал" 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-student-selected">
                <p>Виберіть учня для перегляду прогресу</p>
              </div>
            )}
          </div>
        );
      
      case "compareStudents":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 200]} />
              <Radar 
                name="Вхідні варіанти" 
                dataKey="Вхідні варіанти" 
                stroke="#3498db" 
                fill="#3498db" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Тренувальні тести" 
                dataKey="Тренувальні тести" 
                stroke="#e74c3c" 
                fill="#e74c3c" 
                fillOpacity={0.6} 
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
        
      case "topStudents":
        return (
          <div>
            <div className="chart-controls">
              <label>
                Кількість учнів:
                <input 
                  type="number" 
                  min="1" 
                  max="15" 
                  value={topStudentsCount}
                  onChange={(e) => setTopStudentsCount(parseInt(e.target.value) || 5)}
                />
              </label>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 200]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}`, 'Середній бал']} />
                <Bar dataKey="average" fill="#2ecc71" name="Середній бал" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case "scoresPerTest":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 200]} />
              <Tooltip formatter={(value) => [`${value}`, 'Середній бал']} />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#9b59b6" 
                activeDot={{ r: 8 }} 
                name="Середній бал" 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div>Виберіть тип графіка для відображення</div>;
    }
  };

  // Відображення індикатора завантаження
  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-indicator">
          <p>Завантаження даних...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Аналітика результатів НМТ з математики</h1>
        <div className="category-selector">
          {categories.map(category => (
            <button
              key={category.id}
              className={selectedCategory === category.id ? "active" : ""}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </header>

      <div className="analytics-overview">
        <div className="overview-card">
          <h3>Загальна статистика</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Середній бал</span>
              <span className="stat-value">{stats.averageScore}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Найвищий бал</span>
              <span className="stat-value">{stats.highestScore}</span>
              <span className="stat-subtext">{stats.highestStudent}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Найнижчий бал</span>
              <span className="stat-value">{stats.lowestScore}</span>
              <span className="stat-subtext">{stats.lowestStudent}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Кількість учнів</span>
              <span className="stat-value">{stats.studentsCount}</span>
            </div>
          </div>
        </div>

        <div className="overview-card trend-card">
          <h3>Динаміка класу</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={getClassProgress()}>
              <XAxis dataKey="name" tick={false} />
              <YAxis domain={[0, 200]} hide />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#3498db" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-controls-container">
        <div className="chart-type-selector">
          {charts.map(chart => (
            <button
              key={chart.id}
              className={selectedChart === chart.id ? "active" : ""}
              onClick={() => setSelectedChart(chart.id)}
            >
              {chart.name}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <h2>{charts.find(c => c.id === selectedChart)?.name}</h2>
        {renderChart()}
      </div>

      <div className="student-trends">
        <h3>Тенденції учнів</h3>
        <div className="trends-grid">
          {students.map(student => {
            const trend = getStudentTrend(student.id);
            const average = getStudentAverage(student.id, selectedCategory);
            
            if (average === 0) return null; // Пропускаємо учнів без результатів
            
            return (
              <div key={student.id} className={`trend-card ${trend}`}>
                <h4>{student.name}</h4>
                <div className="trend-info">
                  <span className="trend-average">{average.toFixed(2)}</span>
                  <span className="trend-icon">
                    {trend === "up" && "↑"}
                    {trend === "down" && "↓"}
                    {trend === "neutral" && "→"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;