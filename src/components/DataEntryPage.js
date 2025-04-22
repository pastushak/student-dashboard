import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DataEntryPage.css';

// Імпортуємо тестові дані з локального сховища або використовуємо демо-дані
const getInitialData = () => {
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
  
  return {
    students: savedStudents ? JSON.parse(savedStudents) : defaultStudents,
    categories: defaultCategories,
    tests: savedTests ? JSON.parse(savedTests) : defaultTests,
    results: savedResults ? JSON.parse(savedResults) : []
  };
};

const DataEntryPage = () => {
  const { students, categories, tests } = getInitialData();
  const [results, setResults] = useState(getInitialData().results);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newResults, setNewResults] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Фільтруємо тести за вибраною категорією
  const filteredTests = tests.filter(test => test.category === selectedCategory);
  
  // Ініціалізуємо форму результатів для всіх учнів
  useEffect(() => {
    if (selectedTest) {
      const initialNewResults = students.map(student => {
        // Перевіряємо, чи вже є результат для цього учня і тесту
        const existingResult = results.find(
          r => r.studentId === student.id && r.testId === selectedTest
        );
        
        return {
          studentId: student.id,
          testId: selectedTest,
          score: existingResult ? existingResult.score : 0,
          maxScore: 32,
          date: selectedDate
        };
      });
      
      setNewResults(initialNewResults);
    } else {
      setNewResults([]);
    }
  }, [selectedTest, selectedDate, students, results]);
  
  // Обробник зміни балу для учня
  const handleScoreChange = (studentId, score) => {
    const parsedScore = parseInt(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 32) return;
    
    setNewResults(prev => 
      prev.map(result => 
        result.studentId === studentId 
          ? { ...result, score: parsedScore } 
          : result
      )
    );
  };
  
  // Функція для збереження результатів
  const handleSaveResults = () => {
    // Фільтруємо порожні результати
    const validResults = newResults.filter(r => r.score > 0);
    
    if (validResults.length === 0) {
      setErrorMessage('Немає жодного результату для збереження');
      return;
    }
    
    // Видаляємо існуючі результати для цього тесту
    const filteredResults = results.filter(r => r.testId !== selectedTest);
    
    // Додаємо нові результати
    const updatedResults = [...filteredResults, ...validResults];
    
    // Зберігаємо в localStorage
    localStorage.setItem('results', JSON.stringify(updatedResults));
    setResults(updatedResults);
    
    // Показуємо повідомлення про успіх
    setSuccessMessage('Результати успішно збережено');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  // Функція для експорту всіх даних у JSON
  const handleExportData = () => {
    const data = {
      students,
      tests,
      results
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_results_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Функція для імпорту даних з JSON файлу
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Перевіряємо наявність необхідних полів
        if (!data.students || !data.tests || !data.results) {
          throw new Error('Неправильний формат файлу');
        }
        
        // Зберігаємо дані
        localStorage.setItem('students', JSON.stringify(data.students));
        localStorage.setItem('tests', JSON.stringify(data.tests));
        localStorage.setItem('results', JSON.stringify(data.results));
        
        // Показуємо повідомлення про успіх
        setSuccessMessage('Дані успішно імпортовано');
        setTimeout(() => {
          setSuccessMessage('');
          window.location.reload(); // Перезавантажуємо сторінку
        }, 2000);
      } catch (error) {
        setErrorMessage('Помилка імпорту: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="data-entry-container">
      <header className="data-entry-header">
        <h1>Внесення результатів учнів</h1>
        <Link to="/" className="back-button">Повернутися до дашборду</Link>
      </header>
      
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      <div className="data-controls">
        <div className="export-import">
          <button onClick={handleExportData} className="export-button">
            Експорт даних (JSON)
          </button>
          <label className="import-label">
            Імпорт даних
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportData} 
              className="import-input"
            />
          </label>
        </div>
      </div>
      
      <div className="selection-container">
        <div className="category-selection">
          <h2>Крок 1: Виберіть категорію</h2>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedTest('');
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="test-selection">
          <h2>Крок 2: Виберіть варіант</h2>
          <div className="test-buttons">
            {filteredTests.map(test => (
              <button
                key={test.id}
                className={`test-button ${selectedTest === test.id ? 'active' : ''}`}
                onClick={() => setSelectedTest(test.id)}
              >
                {test.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="date-selection">
          <h2>Крок 3: Виберіть дату</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>
      
      {selectedTest && (
        <div className="results-form">
          <h2>Крок 4: Внесіть бали (0-32)</h2>
          <div className="results-table">
            <div className="results-header">
              <div className="student-column">Учень</div>
              <div className="score-column">Бал (0-32)</div>
              <div className="scaled-column">Шкала 100-200</div>
            </div>
            
            {newResults.map(result => {
              const student = students.find(s => s.id === result.studentId);
              // Конвертуємо тестовий бал у шкалу 100-200
              const scaledScore = result.score < 5 ? 0 : (
                result.score === 5 ? 100 :
                result.score === 6 ? 108 :
                result.score === 7 ? 115 :
                result.score === 8 ? 123 :
                result.score === 9 ? 131 :
                result.score === 10 ? 134 :
                result.score === 11 ? 137 :
                result.score === 12 ? 140 :
                result.score === 13 ? 143 :
                result.score === 14 ? 145 :
                result.score === 15 ? 147 :
                result.score === 16 ? 148 :
                result.score === 17 ? 149 :
                result.score === 18 ? 150 :
                result.score === 19 ? 151 :
                result.score === 20 ? 152 :
                result.score === 21 ? 155 :
                result.score === 22 ? 159 :
                result.score === 23 ? 163 :
                result.score === 24 ? 167 :
                result.score === 25 ? 170 :
                result.score === 26 ? 173 :
                result.score === 27 ? 176 :
                result.score === 28 ? 180 :
                result.score === 29 ? 184 :
                result.score === 30 ? 189 :
                result.score === 31 ? 194 :
                result.score === 32 ? 200 : 0
              );
              
              return (
                <div key={result.studentId} className="results-row">
                  <div className="student-column">{student?.name}</div>
                  <div className="score-column">
                    <input
                      type="number"
                      min="0"
                      max="32"
                      value={result.score}
                      onChange={(e) => handleScoreChange(result.studentId, e.target.value)}
                      className="score-input"
                    />
                  </div>
                  <div className="scaled-column">
                    <span className={scaledScore < 100 ? 'failed-score' : ''}>
                      {scaledScore || 'Не склав'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="save-container">
            <button onClick={handleSaveResults} className="save-button">
              Зберегти результати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryPage;