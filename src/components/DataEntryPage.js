import React, { useState, useEffect } from 'react';
import './DataEntryPage.css';
import { supabase } from '../supabase';

const DataEntryPage = ({ onLogout }) => {
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

  // Стан для зберігання результатів
  const [results, setResults] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("own");
  const [selectedTest, setSelectedTest] = useState("");
  const [showConversion, setShowConversion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ show: false, message: "", isError: false });

  // Завантаження результатів з Supabase при ініціалізації
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

  // Стан для відстеження змінених результатів, які ще не збережені
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Оновлення результату учня (тільки в локальному стані)
  const handleScoreChange = (studentId, score) => {
    if (selectedTest && score >= 0 && score <= 32) {
      // Оновлюємо локальний стан для миттєвого відображення
      setResults(prev => ({
        ...prev,
        [studentId]: {
          ...(prev[studentId] || {}),
          [selectedTest]: parseInt(score)
        }
      }));
      
      // Встановлюємо прапорець незбережених змін
      setUnsavedChanges(true);
    }
  };
  
  // Збереження всіх результатів для обраного тесту в Supabase
  // Зберігання всіх результатів для обраного тесту в Supabase
const saveResults = async () => {
  if (!selectedTest || !unsavedChanges) return;
  
  try {
    setLoading(true);
    
    // Підготовка даних для пакетного завантаження
    const updatesArray = [];
    
    // Перебираємо всіх студентів і додаємо їхні результати для вибраного тесту
    students.forEach(student => {
      if (results[student.id] && results[student.id][selectedTest] !== undefined) {
        updatesArray.push({
          student_id: student.id,
          test_id: selectedTest,
          score: results[student.id][selectedTest]
        });
      }
    });
    
    // Зберігаємо/оновлюємо в Supabase (пакетна операція)
    const { error } = await supabase
      .from('test_results')
      .upsert(updatesArray, { 
        onConflict: 'student_id,test_id', // Вказуємо, що робити в разі конфлікту
        ignoreDuplicates: false // Не ігноруємо дублікати, а оновлюємо їх
      });
    
    if (error) throw error;
      
      // Скидаємо прапорець незбережених змін
      setUnsavedChanges(false);
      
      // Показуємо повідомлення про успішне збереження
      setSaveStatus({
        show: true,
        message: "Всі результати збережено",
        isError: false
      });
      
      // Ховаємо повідомлення через 3 секунди
      setTimeout(() => {
        setSaveStatus({ show: false, message: "", isError: false });
      }, 3000);
    } catch (error) {
      console.error('Помилка при збереженні результатів:', error);
      
      // Показуємо повідомлення про помилку
      setSaveStatus({
        show: true,
        message: `Помилка: ${error.message}`,
        isError: true
      });
      
      // Ховаємо повідомлення через 5 секунд
      setTimeout(() => {
        setSaveStatus({ show: false, message: "", isError: false });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Фільтрація тестів за вибраною категорією
  const filteredTests = tests.filter(test => test.category === selectedCategory);

  if (loading) {
    return (
      <div className="data-entry-container">
        <div className="loading-indicator">
          <p>Завантаження даних...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-entry-container">
      <header className="data-entry-header">
        <h1>Введення результатів НМТ з математики</h1>
        <button className="logout-btn" onClick={onLogout}>Вийти</button>
      </header>

      <div className="data-entry-controls">
        <div className="category-selector">
          {categories.map(category => (
            <button
              key={category.id}
              className={selectedCategory === category.id ? "active" : ""}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedTest("");
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="test-selector">
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
          >
            <option value="">Виберіть тест</option>
            {filteredTests.map(test => (
              <option key={test.id} value={test.id}>
                {test.category === "own" ? "Варіант " + test.name : "Тренувальний " + test.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="conversion-table-btn"
          onClick={() => setShowConversion(!showConversion)}
        >
          {showConversion ? "Сховати таблицю" : "Показати таблицю переведення"}
        </button>
      </div>

      {/* Повідомлення про статус збереження */}
      {saveStatus.show && (
        <div className={`save-status ${saveStatus.isError ? 'error' : 'success'}`}>
          {saveStatus.message}
        </div>
      )}

      {showConversion && (
        <div className="conversion-table-container">
          <h3>Таблиця переведення тестових балів з математики до шкали 100-200</h3>
          <div className="conversion-table">
            <table>
              <thead>
                <tr>
                  <th>Тестовий бал</th>
                  <th>Бал за шкалою 100-200</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(conversionTable).map(([testScore, scaledScore]) => (
                  scaledScore > 0 && (
                    <tr key={testScore}>
                      <td>{testScore}</td>
                      <td>{scaledScore}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTest ? (
        <div className="student-scores-container">
          <h2>{selectedCategory === "own" ? "Варіант " : "Тренувальний тест "} 
            {tests.find(t => t.id === selectedTest)?.name}</h2>
          
          <table className="student-scores-table">
            <thead>
              <tr>
                <th>Учень</th>
                <th>Тестовий бал (0-32)</th>
                <th>Бал 100-200</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const currentScore = results[student.id] && results[student.id][selectedTest] 
                  ? results[student.id][selectedTest] 
                  : "";
                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        max="32"
                        value={currentScore}
                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      />
                    </td>
                    <td>
                      {currentScore !== "" ? convertScore(currentScore) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Кнопка збереження результатів */}
          <div className="save-results-container">
            <button 
              className={`save-results-btn ${unsavedChanges ? 'unsaved' : ''}`}
              onClick={saveResults}
              disabled={!unsavedChanges || loading}
            >
              {loading ? 'Збереження...' : 'Зберегти результати'}
            </button>
            {unsavedChanges && (
              <span className="unsaved-message">* Є незбережені зміни</span>
            )}
          </div>
        </div>
      ) : (
        <div className="no-test-selected">
          <p>Виберіть категорію та тест для введення балів</p>
        </div>
      )}
    </div>
  );
};

export default DataEntryPage;