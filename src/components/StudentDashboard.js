import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import './ResponsiveResultsTable.css'; // Додаємо нові стилі
import './ViewToggleStyles.css'; // Додаємо стилі для режимів перегляду
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { supabase } from '../supabase';

const StudentDashboard = ({ studentId, userRole }) => {
  // Дані учнів
  const students = [
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
  // Стани компонента
  const [results, setResults] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("own");
  const [selectedStudent, setSelectedStudent] = useState(studentId || null);
  const [showAddResult, setShowAddResult] = useState(false);
  const [newResult, setNewResult] = useState({
    studentId: "",
    testId: "",
    score: 0
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [allResults, setAllResults] = useState({});
  const [loading, setLoading] = useState(true);
  // Стан для відстеження розгорнутих карток
  const [expandedCards, setExpandedCards] = useState({});

  // Фільтруємо учнів відповідно до ролі
  const displayStudents = userRole === 'student' 
    ? students.filter(s => s.id === studentId)
    : students;  // Для ролі admin показуємо всіх учнів

  // Кольори для графіків
  const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];
  // Завантаження збережених результатів з Supabase
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Отримуємо всі результати тестів або тільки для конкретного учня
        let query = supabase.from('test_results').select('*');
        
        // Якщо це учень, фільтруємо результати тільки для цього учня
        if (userRole === 'student' && studentId) {
          query = query.eq('student_id', studentId);
        }
        
        const { data, error } = await query; // Отримуємо дані з запиту
        
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
        
        // Для учня також завантажуємо всі результати для порівняння
        if (userRole === 'student') {
          const { data: allData, error: allError } = await supabase
            .from('test_results')
            .select('*');
            
          if (!allError) {
            const allFormattedResults = {};
            
            allData.forEach(item => {
              if (!allFormattedResults[item.student_id]) {
                allFormattedResults[item.student_id] = {};
              }
              
              allFormattedResults[item.student_id][item.test_id] = item.score;
            });
            
            setAllResults(allFormattedResults);
          }
        }
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userRole, studentId]);

  // Встановлюємо вибраного учня при першому завантаженні, якщо це учень
  useEffect(() => {
    if (userRole === 'student' && studentId) {
      setSelectedStudent(studentId);
    }
  }, [userRole, studentId]);

  // Конвертація тестового балу в бал за шкалою 100-200
  const convertScore = (score) => {
    return conversionTable[score] || 0;
  };

  // Додавання нового результату через Supabase
  const handleAddResult = async () => {
    if (newResult.studentId && newResult.testId && newResult.score >= 0 && newResult.score <= 32) {
      try {
        // Додаємо/оновлюємо результат через Supabase
        const { error } = await supabase
          .from('test_results')
          .upsert({
            student_id: newResult.studentId,
            test_id: newResult.testId,
            score: parseInt(newResult.score)
          }, { 
            onConflict: 'student_id,test_id',
            ignoreDuplicates: false
          });
        
        if (error) throw error;
        
        // Оновлюємо локальний стан для оновлення інтерфейсу без перезавантаження
        setResults(prev => ({
          ...prev,
          [newResult.studentId]: {
            ...(prev[newResult.studentId] || {}),
            [newResult.testId]: parseInt(newResult.score)
          }
        }));
        
        setNewResult({ studentId: "", testId: "", score: 0 });
        setShowAddResult(false);
      } catch (error) {
        console.error('Помилка при збереженні результату:', error);
        alert('Помилка при збереженні результату: ' + error.message);
      }
    } else {
      alert("Будь ласка, заповніть всі поля коректно. Кількість балів має бути від 0 до 32.");
    }
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
    
    return count > 0 ? (totalScore / count).toFixed(2) : "-";
  };

  // Отримання результату певного тесту для учня
  const getTestResult = (studentId, testId) => {
    return results[studentId] && results[studentId][testId] !== undefined 
      ? results[studentId][testId] 
      : "-";
  };

  // Отримання конвертованого результату певного тесту для учня
  const getConvertedTestResult = (studentId, testId) => {
    const rawScore = getTestResult(studentId, testId);
    return rawScore !== "-" ? convertScore(rawScore) : "-";
  };
  // Отримання рейтингу учня відносно інших
  const getStudentRank = (studentId, category) => {
    const studentAvg = parseFloat(getStudentAverage(studentId, category));
    if (studentAvg === 0 || isNaN(studentAvg)) return '-';
    
    const allAverages = students.map(s => {
      const avg = parseFloat(getStudentAverage(s.id, category));
      return { id: s.id, avg: avg === '-' ? 0 : avg };
    }).filter(item => item.avg > 0);
    
    // Сортуємо за середнім балом
    allAverages.sort((a, b) => b.avg - a.avg);
    
    // Знаходимо позицію учня
    const rank = allAverages.findIndex(item => item.id === studentId) + 1;
    
    return rank > 0 ? `${rank} з ${allAverages.length}` : '-';
  };

  // Отримання даних для прогресу учня
  const getStudentProgress = (studentId) => {
    const studentResults = results[studentId] || {};
    const categoryTests = tests
      .filter(test => test.category === selectedCategory)
      .sort((a, b) => {
        const aNum = parseInt(a.name.replace(/\D/g, ''));
        const bNum = parseInt(b.name.replace(/\D/g, ''));
        return aNum - bNum;
      });
    
    return categoryTests
      .filter(test => studentResults[test.id] !== undefined)
      .map(test => ({
        name: test.category === 'own' ? `${test.name}` : `${test.name}`,
        score: convertScore(studentResults[test.id])
      }));
  };

  // Отримання порівняльних даних з середнім по класу
  const getComparisonData = (studentId) => {
    const studentResults = results[studentId] || {};
    const categoryTests = tests
      .filter(test => test.category === selectedCategory)
      .sort((a, b) => {
        const aNum = parseInt(a.name.replace(/\D/g, ''));
        const bNum = parseInt(b.name.replace(/\D/g, ''));
        return aNum - bNum;
      });
    
    return categoryTests
      .filter(test => studentResults[test.id] !== undefined)
      .map(test => {
        // Обчислюємо середній бал класу для цього тесту
        let totalClassScore = 0;
        let count = 0;
        
        students.forEach(student => {
          if (results[student.id] && results[student.id][test.id] !== undefined) {
            totalClassScore += convertScore(results[student.id][test.id]);
            count++;
          }
        });
        
        const classAverage = count > 0 ? totalClassScore / count : 0;
        
        return {
          name: test.category === 'own' ? `${test.name}` : `${test.name}`,
          'Ваш бал': convertScore(studentResults[test.id]),
          'Середній бал класу': parseFloat(classAverage.toFixed(2))
        };
      });
  };

  // Отримання розподілу балів за діапазонами
  const getScoreDistribution = (studentId) => {
    const studentResults = results[studentId] || {};
    const categoryTests = tests.filter(test => test.category === selectedCategory);
    
    const distributionData = [
      { range: "100-120", count: 0 },
      { range: "121-140", count: 0 },
      { range: "141-160", count: 0 },
      { range: "161-180", count: 0 },
      { range: "181-200", count: 0 }
    ];
    
    categoryTests.forEach(test => {
      if (studentResults[test.id] !== undefined) {
        const score = convertScore(studentResults[test.id]);
        
        if (score >= 100 && score <= 120) distributionData[0].count++;
        else if (score > 120 && score <= 140) distributionData[1].count++;
        else if (score > 140 && score <= 160) distributionData[2].count++;
        else if (score > 160 && score <= 180) distributionData[3].count++;
        else if (score > 180 && score <= 200) distributionData[4].count++;
      }
    });
    
    return distributionData;
  };

  // Визначення прогресу учня (зростання/спадання)
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
  // Створення карток для відображення
  const renderStudentCards = () => {
    // Фільтруємо тести за вибраною категорією
    const filteredTests = tests.filter(test => test.category === selectedCategory);
        
    // Функція для перемикання розгорнутого стану картки
    const toggleCardExpand = (studentId) => {
      setExpandedCards(prev => ({
        ...prev,
        [studentId]: !prev[studentId]
      }));
    };
    
    return (
      <div className="results-cards">
        {displayStudents.map(student => {
          const studentAvg = getStudentAverage(student.id, selectedCategory);
          const isExpanded = expandedCards[student.id] || false;
          
          // Визначаємо скільки тестів показувати
          const testsToShow = isExpanded ? filteredTests : filteredTests.slice(0, 5);
          
          return (
            <div 
              key={student.id} 
              className={`student-card ${selectedStudent === student.id ? "selected-student" : ""}`}
              onClick={() => userRole !== 'student' && setSelectedStudent(student.id)}
            >
              <div className="student-card-header">
                <div className="student-card-name">{student.name}</div>
                <div className="student-card-average">
                  {studentAvg !== "-" ? studentAvg : "-"}
                </div>
              </div>
              
              <div className="student-card-results">
                {testsToShow.map(test => {
                  const rawScore = getTestResult(student.id, test.id);
                  const convertedScore = getConvertedTestResult(student.id, test.id);
                  
                  return (
                    <div key={test.id} className="test-result-item">
                      <div className="test-result-name">{test.name}</div>
                      <div className="test-result-score">{rawScore}</div>
                      <div className="test-result-converted">{convertedScore}</div>
                    </div>
                  );
                })}
              </div>
              
              {filteredTests.length > 5 && (
                <div className="show-more-results">
                  <button 
                    className="show-more-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Зупиняємо подію кліка, щоб вона не впливала на вибір студента
                      toggleCardExpand(student.id);
                    }}
                  >
                    {isExpanded ? "Показати менше" : "Показати більше..."}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Відображення індикатора завантаження
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-indicator">
          <p>Завантаження даних...</p>
        </div>
      </div>
    );
  }

  // Фільтруємо тести за вибраною категорією
  const filteredTests = tests.filter(test => test.category === selectedCategory);
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Моніторинг НМТ з математики</h1>
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

      {/* Кнопка додавання результату тільки для адміна */}
      {userRole === 'admin' && (
        <div className="dashboard-actions">
          <button 
            className="add-result-btn"
            onClick={() => setShowAddResult(true)}
          >
            Додати результат
          </button>
        </div>
      )}

      {/* Кнопка перегляду аналітики для учня */}
      {userRole === 'student' && (
        <div className="dashboard-actions">
          <button 
            className={`analytics-toggle-btn ${showAnalytics ? 'active' : ''}`}
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? 'Сховати аналітику' : 'Показати аналітику'}
          </button>
        </div>
      )}

      {showAddResult && (
        <div className="add-result-modal">
          <div className="add-result-content">
            <h2>Додати новий результат</h2>
            <select
              value={newResult.studentId}
              onChange={(e) => setNewResult({...newResult, studentId: e.target.value})}
            >
              <option value="">Виберіть учня</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
            <select
              value={newResult.testId}
              onChange={(e) => setNewResult({...newResult, testId: e.target.value})}
            >
              <option value="">Виберіть тест</option>
              {tests.map(test => (
                <option key={test.id} value={test.id}>
                  {test.category === "own" ? "Варіант " + test.name : "Тренувальний " + test.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              max="32"
              value={newResult.score}
              onChange={(e) => setNewResult({...newResult, score: e.target.value})}
              placeholder="Бали (0-32)"
            />
            <div className="add-result-buttons">
              <button onClick={handleAddResult}>Зберегти</button>
              <button onClick={() => setShowAddResult(false)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}

      {/* Відображення результатів у вигляді карток */}
      {renderStudentCards()}
  {/* Розширена аналітика для учня */}
  {userRole === 'student' && showAnalytics && selectedStudent && (
    <div className="student-analytics">
      <h2>Ваша аналітика</h2>
      
      <div className="analytics-overview">
        <div className="overview-card">
          <h3>Загальна статистика</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Середній бал (вхідні)</span>
              <span className="stat-value">{getStudentAverage(selectedStudent, "own")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Середній бал (тренувальні)</span>
              <span className="stat-value">{getStudentAverage(selectedStudent, "training")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Місце у рейтингу (вхідні)</span>
              <span className="stat-value">{getStudentRank(selectedStudent, "own")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Місце у рейтингу (тренувальні)</span>
              <span className="stat-value">{getStudentRank(selectedStudent, "training")}</span>
            </div>
          </div>
        </div>
        
        <div className="overview-card trend-card">
          <h3>Ваш прогрес</h3>
          <div className="trend-info">
            <span className="trend-label">Тенденція:</span>
            <span className={`trend-value ${getStudentTrend(selectedStudent)}`}>
              {getStudentTrend(selectedStudent) === "up" && "Зростання ↑"}
              {getStudentTrend(selectedStudent) === "down" && "Спадання ↓"}
              {getStudentTrend(selectedStudent) === "neutral" && "Стабільно →"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Ваш прогрес</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={getStudentProgress(selectedStudent)}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={0} textAnchor="end" height={50} />
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
        </div>
        
        <div className="chart-container">
          <h3>Розподіл ваших балів</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getScoreDistribution(selectedStudent)}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="range"
              >
                {getScoreDistribution(selectedStudent).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [value > 0 ? value : 0, 'Кількість тестів']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Порівняння з класом</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={getComparisonData(selectedStudent)}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={0} textAnchor="end" height={50} />
              <YAxis domain={[0, 200]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Ваш бал" fill="#3498db" />
              <Bar dataKey="Середній бал класу" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="analytics-recommendations">
        <h3>Рекомендації для покращення</h3>
        <div className="recommendations-content">
          {getStudentTrend(selectedStudent) === "up" && (
            <p>Ваші результати демонструють позитивну динаміку. Продовжуйте в тому ж темпі та зосередьтеся на підтримці високого рівня.</p>
          )}
          {getStudentTrend(selectedStudent) === "down" && (
            <p>Ваші результати демонструють тенденцію до зниження. Рекомендуємо переглянути стратегію підготовки та приділити більше уваги проблемним темам.</p>
          )}
          {getStudentTrend(selectedStudent) === "neutral" && (
            <p>Ваші результати стабільні. Для підвищення ефективності рекомендуємо урізноманітнити підхід до вивчення матеріалу.</p>
          )}
          <p>Для досягнення кращих результатів:</p>
          <ul>
            <li>Регулярно практикуйтеся, розв'язуючи тренувальні тести</li>
            <li>Аналізуйте свої помилки та працюйте над їх виправленням</li>
            <li>Зосередьтеся на темах, які викликають найбільше труднощів</li>
            <li>Встановіть чіткий графік підготовки та дотримуйтесь його</li>
          </ul>
        </div>
      </div>
    </div>
  )}
  {/* Інформація про вибраного учня (для адміна) */}
  {selectedStudent && userRole !== 'student' && (
    <div className="student-details">
      <h2>{students.find(s => s.id === selectedStudent)?.name}</h2>
      <div className="student-stats">
        <p>Середній бал (вхідні): {getStudentAverage(selectedStudent, "own")}</p>
        <p>Середній бал (тренувальні): {getStudentAverage(selectedStudent, "training")}</p>
        <p>Рейтинг (вхідні): {getStudentRank(selectedStudent, "own")}</p>
        <p>Тенденція: 
          <span className={`trend-value ${getStudentTrend(selectedStudent)}`}>
            {getStudentTrend(selectedStudent) === "up" && " Зростання ↑"}
            {getStudentTrend(selectedStudent) === "down" && " Спадання ↓"}
            {getStudentTrend(selectedStudent) === "neutral" && " Стабільно →"}
          </span>
        </p>
      </div>
      
      {/* Дані про прогрес обраного учня */}
      <div className="student-progress-chart">
        <h3>Прогрес учня</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart 
            data={getStudentProgress(selectedStudent)}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
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
      </div>
    </div>
  )}
</div>
);
};

export default StudentDashboard;