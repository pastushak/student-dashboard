import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';
import DataEntryPage from './components/DataEntryPage';
import './App.css';

function App() {
  return (
    <Router basename="/student-dashboard">
      <div className="App">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;