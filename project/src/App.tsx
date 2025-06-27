import React, { useState } from 'react';
import { View, Student } from './types';
import { questions } from './data/questions';
import { LandingPage } from './components/LandingPage';
import { StudentPortal } from './components/StudentPortal';
import { ExaminerPortal } from './components/ExaminerPortal';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [students, setStudents] = useState<Student[]>([]);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleSubmitTest = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const goToLanding = () => {
    setCurrentView('landing');
  };

  switch (currentView) {
    case 'student':
      return (
        <StudentPortal
          questions={questions}
          onSubmitTest={handleSubmitTest}
          onBack={goToLanding}
        />
      );
    
    case 'examiner':
      return (
        <ExaminerPortal
          students={students}
          questions={questions}
          onBack={goToLanding}
        />
      );
    
    default:
      return <LandingPage onNavigate={handleNavigate} />;
  }
}

export default App;