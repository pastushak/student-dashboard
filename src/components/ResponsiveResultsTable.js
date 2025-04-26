import React, { useState } from 'react';

const ResponsiveResultsTable = ({ 
  students, 
  tests, 
  results, 
  getTestResult, 
  getConvertedTestResult, 
  getStudentAverage, 
  selectedStudent, 
  setSelectedStudent, 
  userRole, 
  selectedCategory 
}) => {
  // Стан для фільтрації та пагінації
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [testsPerPage, setTestsPerPage] = useState(5);

  // Фільтровані учні
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Загальна кількість сторінок тестів
  const totalPages = Math.ceil(tests.length / testsPerPage);

  // Отримання поточних тестів для відображення
  const currentTests = tests.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  // Функції навігації
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Функція зміни кількості тестів на сторінці
  const handleTestsPerPageChange = (e) => {
    setTestsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Повертаємося на першу сторінку при зміні кількості тестів
  };

  return (
    <div className="responsive-table-wrapper">
      {/* Контроль відображення */}
      <div className="table-controls">
        <div className="search-control">
          <input
            type="text"
            placeholder="Пошук учня..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="tests-per-page-control">
          <label>
            Тестів на сторінці:
            <select 
              value={testsPerPage} 
              onChange={handleTestsPerPageChange}
              className="tests-per-page-select"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value={tests.length}>Всі</option>
            </select>
          </label>
        </div>
        
        <div className="pagination-control">
          <span className="pagination-info">
            Тести {tests.length > 0 ? (currentPage - 1) * testsPerPage + 1 : 0}-{Math.min(currentPage * testsPerPage, tests.length)} з {tests.length}
          </span>
          <button 
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &laquo; Попередні
          </button>
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages || tests.length === 0}
            className="pagination-btn"
          >
            Наступні &raquo;
          </button>
        </div>
      </div>

      {/* Таблиця результатів */}
      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th className="student-name-cell">Учень</th>
              {currentTests.map(test => (
                <th key={test.id} className="test-result-cell">
                  {test.name}
                </th>
              ))}
              <th className="average-cell">Середній бал</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id} 
                    className={selectedStudent === student.id ? "selected-student" : ""}
                    onClick={() => userRole !== 'student' && setSelectedStudent(student.id)}
                >
                  <td className="student-name-cell">{student.name}</td>
                  {currentTests.map(test => (
                    <td key={test.id} className="test-result-cell">
                      <div className="result-wrapper">
                        <span className="raw-score">{getTestResult(student.id, test.id)}</span>
                        <span className="converted-score">{getConvertedTestResult(student.id, test.id)}</span>
                      </div>
                    </td>
                  ))}
                  <td className="average-cell">{getStudentAverage(student.id, selectedCategory)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={currentTests.length + 2} className="no-results">
                  {searchTerm ? "Учнів не знайдено" : "Немає даних для відображення"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Легенда */}
      <div className="table-legend">
        <div className="legend-item">
          <span className="legend-symbol">ХХ</span>
          <span className="legend-text">Тестовий бал (макс. 32)</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol converted">YYY</span>
          <span className="legend-text">Бал за шкалою 100-200</span>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveResultsTable;