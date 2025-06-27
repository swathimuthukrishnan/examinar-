import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Mail, Home, CheckCircle, Clock, Maximize, Minimize, AlertTriangle } from 'lucide-react';
import { Student, Question } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useFullscreen } from '../hooks/useFullscreen';

interface StudentPortalProps {
  questions: Question[];
  onSubmitTest: (student: Student) => void;
  onBack: () => void;
}

// Session storage for tracking used emails
const USED_EMAILS_KEY = 'lasak_used_emails';
const getUsedEmails = (): string[] => {
  try {
    const stored = localStorage.getItem(USED_EMAILS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addUsedEmail = (email: string) => {
  const usedEmails = getUsedEmails();
  if (!usedEmails.includes(email.toLowerCase())) {
    usedEmails.push(email.toLowerCase());
    localStorage.setItem(USED_EMAILS_KEY, JSON.stringify(usedEmails));
  }
};

const isEmailUsed = (email: string): boolean => {
  return getUsedEmails().includes(email.toLowerCase());
};

export const StudentPortal: React.FC<StudentPortalProps> = ({ questions, onSubmitTest, onBack }) => {
  const [currentStudent, setCurrentStudent] = useState<{ name: string; email: string } | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | string)[]>([]);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  const timer = useTimer(45 * 60); // 45 minutes
  const { isFullscreen, fullscreenExits, enterFullscreen, exitFullscreen, resetExitCount } = useFullscreen();

  // Tab visibility detection
  const handleVisibilityChange = useCallback(() => {
    if (testStarted && !testCompleted && document.hidden) {
      setTabSwitchCount(prev => prev + 1);
      setShowExitConfirmation(true);
    }
  }, [testStarted, testCompleted]);

  // Prevent page refresh/close during test
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (testStarted && !testCompleted) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your test progress will be lost.';
      return e.returnValue;
    }
  }, [testStarted, testCompleted]);

  // Setup event listeners
  useEffect(() => {
    if (testStarted && !testCompleted) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [testStarted, testCompleted, handleVisibilityChange, handleBeforeUnload]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timer.isExpired && testStarted && !testCompleted) {
      handleAutoSubmit();
    }
  }, [timer.isExpired, testStarted, testCompleted]);

  // Warning for fullscreen exits
  useEffect(() => {
    if (fullscreenExits > 0 && testStarted && !testCompleted) {
      alert(`Warning: You have exited fullscreen ${fullscreenExits} time(s). The test must remain in fullscreen mode.`);
      enterFullscreen();
    }
  }, [fullscreenExits, testStarted, testCompleted]);

  const handleStudentLogin = (name: string, email: string) => {
    if (isEmailUsed(email)) {
      alert('This email has already been used for a test session. Each email can only be used once.');
      return;
    }
    
    setCurrentStudent({ name, email });
    setTestStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestCompleted(false);
    setTabSwitchCount(0);
    timer.reset();
    resetExitCount();
  };

  const startTest = async () => {
    const success = await enterFullscreen();
    if (success && currentStudent) {
      setTestStarted(true);
      timer.start();
      addUsedEmail(currentStudent.email); // Mark email as used when test starts
    } else {
      alert('Fullscreen mode is required to start the test. Please allow fullscreen access.');
    }
  };

  const handleAnswer = (answer: number | string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    let totalPoints = 0;
    
    answers.forEach((answer, index) => {
      const question = questions[index];
      totalPoints += question.points;
      
      if (question.type === 'multiple-choice') {
        if (answer === question.correctAnswer) {
          score += question.points;
        }
      } else if (question.type === 'fill-blank') {
        if (typeof answer === 'string' && typeof question.correctAnswer === 'string') {
          if (answer.toLowerCase().trim() === question.correctAnswer.toLowerCase()) {
            score += question.points;
          }
        }
      }
      // Subjective questions will be evaluated by AI later
    });
    
    return (score / totalPoints) * 100;
  };

  const submitTest = () => {
    if (currentStudent) {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: currentStudent.name,
        email: currentStudent.email,
        score: calculateScore(),
        answers,
        submittedAt: new Date().toISOString()
      };

      onSubmitTest(newStudent);
      setTestCompleted(true);
      timer.stop();
      exitFullscreen();
    }
  };

  const handleAutoSubmit = () => {
    if (currentStudent) {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: currentStudent.name,
        email: currentStudent.email,
        score: calculateScore(),
        answers,
        submittedAt: new Date().toISOString()
      };

      onSubmitTest(newStudent);
      setTestCompleted(true);
      exitFullscreen();
    }
  };

  const handleExitConfirmation = (shouldExit: boolean) => {
    setShowExitConfirmation(false);
    if (shouldExit) {
      // Submit current progress and exit
      if (currentStudent) {
        const newStudent: Student = {
          id: Date.now().toString(),
          name: currentStudent.name,
          email: currentStudent.email,
          score: calculateScore(),
          answers,
          submittedAt: new Date().toISOString()
        };
        onSubmitTest(newStudent);
      }
      setTestCompleted(true);
      timer.stop();
      exitFullscreen();
      onBack();
    }
  };

  const canSubmit = answers.length === questions.length && answers.every(a => a !== undefined && a !== '');

  // Exit confirmation modal
  if (showExitConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exit Test?</h2>
            <p className="text-gray-600 mb-2">
              You have switched tabs {tabSwitchCount} time(s) during the test.
            </p>
            <p className="text-gray-600 mb-6">
              Do you want to exit the test? Your current progress will be submitted automatically.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleExitConfirmation(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={() => handleExitConfirmation(true)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Completed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you, {currentStudent?.name}! Your responses have been submitted and are now being reviewed.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentStudent) {
    return <StudentLogin onLogin={handleStudentLogin} onBack={onBack} />;
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {currentStudent.name}!</h2>
            <p className="text-gray-600">You're about to begin your assessment</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Test Information:</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• {questions.length} questions (multiple choice, fill-in-the-blank, and subjective)</li>
                <li>• 45 minutes time limit</li>
                <li>• You can navigate between questions</li>
                <li>• All questions must be answered to submit</li>
                <li>• Test will auto-submit when time expires</li>
                <li>• Test will automatically enter full-screen mode</li>
                <li>• Switching tabs or exiting fullscreen will trigger warnings</li>
                <li>• Each email can only be used once for testing</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">Important Security Notice:</h3>
              <ul className="space-y-1 text-red-700 text-sm">
                <li>• Do not switch tabs or minimize the browser during the test</li>
                <li>• Tab switching will be detected and may result in test termination</li>
                <li>• Your email will be permanently registered after starting the test</li>
                <li>• You cannot retake the test with the same email address</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={startTest}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TestInterface
      question={questions[currentQuestion]}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      selectedAnswer={answers[currentQuestion]}
      onAnswer={handleAnswer}
      onNext={nextQuestion}
      onPrev={prevQuestion}
      onSubmit={submitTest}
      canSubmit={canSubmit}
      onBack={() => setShowExitConfirmation(true)}
      timer={timer}
      isFullscreen={isFullscreen}
      fullscreenExits={fullscreenExits}
      onToggleFullscreen={isFullscreen ? exitFullscreen : enterFullscreen}
      tabSwitchCount={tabSwitchCount}
    />
  );
};

const StudentLogin: React.FC<{ onLogin: (name: string, email: string) => void; onBack: () => void }> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (isEmailUsed(email.trim())) {
      setError('This email has already been used for a test session. Each email can only be used once.');
      return;
    }
    
    onLogin(name.trim(), email.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate Portal</h2>
          <p className="text-gray-600">Enter your details to begin the assessment</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Note: Each email can only be used once for testing
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TestInterface: React.FC<{
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | string;
  onAnswer: (answer: number | string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  onBack: () => void;
  timer: ReturnType<typeof useTimer>;
  isFullscreen: boolean;
  fullscreenExits: number;
  onToggleFullscreen: () => void;
  tabSwitchCount: number;
}> = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrev,
  onSubmit,
  canSubmit,
  onBack,
  timer,
  isFullscreen,
  fullscreenExits,
  onToggleFullscreen,
  tabSwitchCount
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">LASAK Technology</h1>
                  <p className="text-blue-100">Assessment in Progress</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Timer */}
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  timer.isTimeRunningOut ? 'bg-red-500/20 border border-red-300' : 'bg-white/20'
                }`}>
                  <Clock className={`h-5 w-5 ${timer.isTimeRunningOut ? 'text-red-200' : 'text-white'}`} />
                  <span className={`font-mono text-lg font-bold ${
                    timer.isTimeRunningOut ? 'text-red-200' : 'text-white'
                  }`}>
                    {timer.formatTime()}
                  </span>
                </div>
                
                {/* Fullscreen Toggle */}
                <button
                  onClick={onToggleFullscreen}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isFullscreen ? 'Exit' : 'Fullscreen'}
                  </span>
                </button>
                
                <button
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Exit</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-blue-100">Question {currentQuestion + 1} of {totalQuestions}</p>
              <a href="https://lasak.in" target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:text-white text-sm">
                lasak.in
              </a>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Warnings */}
          {timer.isTimeRunningOut && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700 font-medium">
                  Warning: Only {Math.floor(timer.timeLeft / 60)} minutes remaining!
                </p>
              </div>
            </div>
          )}

          {fullscreenExits > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                <p className="text-yellow-700 font-medium">
                  Warning: You have exited fullscreen {fullscreenExits} time(s). Please remain in fullscreen mode.
                </p>
              </div>
            </div>
          )}

          {tabSwitchCount > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700 font-medium">
                  Security Alert: You have switched tabs {tabSwitchCount} time(s). Continued violations may result in test termination.
                </p>
              </div>
            </div>
          )}

          {/* Question Content */}
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  question.type === 'multiple-choice' ? 'bg-blue-100 text-blue-800' :
                  question.type === 'fill-blank' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {question.type === 'multiple-choice' ? 'Multiple Choice' :
                   question.type === 'fill-blank' ? 'Fill in the Blank' :
                   'Subjective'}
                </span>
                <span className="ml-2 text-sm text-gray-600">({question.points} point{question.points > 1 ? 's' : ''})</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed whitespace-pre-line">
                {question.question}
              </h2>
              
              {question.type === 'multiple-choice' ? (
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => onAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-base">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer:
                  </label>
                  <textarea
                    value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                    onChange={(e) => onAnswer(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg resize-none"
                    placeholder={question.type === 'fill-blank' ? "Type your answer here..." : "Provide a detailed answer..."}
                    rows={question.type === 'subjective' ? 6 : 2}
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={onPrev}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                Previous
              </button>

              <span className="text-gray-600 font-medium">
                {currentQuestion + 1} / {totalQuestions}
              </span>

              {currentQuestion === totalQuestions - 1 ? (
                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};