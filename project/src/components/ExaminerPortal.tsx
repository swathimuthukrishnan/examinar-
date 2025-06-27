import React, { useState } from 'react';
import { Building2, Users, BarChart3, Award, Home, Mail, Eye, EyeOff, Brain, Loader, Lock } from 'lucide-react';
import { Student, Question } from '../types';
import { AIEvaluationService } from '../services/aiService';

interface ExaminerPortalProps {
  students: Student[];
  questions: Question[];
  onBack: () => void;
}

export const ExaminerPortal: React.FC<ExaminerPortalProps> = ({ students, questions, onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [aiEvaluations, setAiEvaluations] = useState<{ [studentId: string]: any }>({});
  const [evaluatingStudents, setEvaluatingStudents] = useState<Set<string>>(new Set());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'info@lasak.in' && password === 'lasak@2025') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const evaluateWithAI = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setEvaluatingStudents(prev => new Set(prev).add(studentId));

    try {
      const aiService = AIEvaluationService.getInstance();
      const subjectiveQuestions = questions.filter(q => q.type === 'subjective');
      
      const evaluationRequests = subjectiveQuestions.map(question => ({
        question: question.question,
        studentAnswer: student.answers[questions.indexOf(question)] as string || '',
        maxPoints: question.points
      }));

      const evaluationResults = await aiService.batchEvaluate(evaluationRequests);
      
      let totalSubjectiveScore = 0;
      const subjectiveScores: { [questionId: number]: number } = {};
      
      evaluationResults.forEach((result, index) => {
        const questionIndex = questions.indexOf(subjectiveQuestions[index]);
        subjectiveScores[questionIndex] = result.score;
        totalSubjectiveScore += result.score;
      });

      // Calculate total score including objective questions
      let objectiveScore = 0;
      let totalObjectivePoints = 0;
      
      student.answers.forEach((answer, index) => {
        const question = questions[index];
        if (question.type !== 'subjective') {
          totalObjectivePoints += question.points;
          
          if (question.type === 'multiple-choice') {
            if (answer === question.correctAnswer) {
              objectiveScore += question.points;
            }
          } else if (question.type === 'fill-blank') {
            if (typeof answer === 'string' && typeof question.correctAnswer === 'string') {
              if (answer.toLowerCase().trim() === question.correctAnswer.toLowerCase()) {
                objectiveScore += question.points;
              }
            }
          }
        }
      });

      const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);
      const finalScore = ((objectiveScore + totalSubjectiveScore) / totalPossiblePoints) * 100;

      const evaluation = {
        subjectiveScores,
        objectiveScore,
        totalSubjectiveScore,
        finalScore,
        evaluationResults,
        feedback: `Comprehensive AI evaluation completed. Objective score: ${objectiveScore}/${totalObjectivePoints}, Subjective score: ${totalSubjectiveScore.toFixed(1)}/${subjectiveQuestions.reduce((sum, q) => sum + q.points, 0)}`
      };

      setAiEvaluations(prev => ({
        ...prev,
        [studentId]: evaluation
      }));

    } catch (error) {
      console.error('AI Evaluation Error:', error);
      setError('Failed to evaluate with AI. Please try again.');
    } finally {
      setEvaluatingStudents(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">LASAK Technology</h2>
            <p className="text-gray-600 mb-1">Examiner Portal</p>
            <p className="text-sm text-gray-500">Secure access for authorized personnel only</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Home className="h-5 w-5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sortedStudents = [...students].sort((a, b) => {
    const aFinalScore = aiEvaluations[a.id]?.finalScore ?? a.score;
    const bFinalScore = aiEvaluations[b.id]?.finalScore ?? b.score;
    return bFinalScore - aFinalScore;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">LASAK Technology</h1>
                  <p className="text-indigo-100">Examiner Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a href="https://lasak.in" target="_blank" rel="noopener noreferrer" className="text-indigo-100 hover:text-white text-sm transition-colors">
                  lasak.in
                </a>
                <button
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 backdrop-blur-sm"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Student Data</h3>
                <p className="text-gray-600">No students have completed the assessment yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-blue-900">{students.length}</p>
                      </div>
                      <Users className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Average Score</p>
                        <p className="text-2xl font-bold text-green-900">
                          {(students.reduce((sum, s) => {
                            const finalScore = aiEvaluations[s.id]?.finalScore ?? s.score;
                            return sum + finalScore;
                          }, 0) / students.length).toFixed(1)}%
                        </p>
                      </div>
                      <BarChart3 className="h-10 w-10 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Highest Score</p>
                        <p className="text-2xl font-bold text-yellow-900">
                          {Math.max(...students.map(s => aiEvaluations[s.id]?.finalScore ?? s.score)).toFixed(1)}%
                        </p>
                      </div>
                      <Award className="h-10 w-10 text-yellow-600" />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">AI Evaluated</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {Object.keys(aiEvaluations).length}
                        </p>
                      </div>
                      <Brain className="h-10 w-10 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Student Rankings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Rankings</h3>
                  <div className="space-y-4">
                    {sortedStudents.map((student, index) => {
                      const aiEvaluation = aiEvaluations[student.id];
                      const finalScore = aiEvaluation?.finalScore ?? student.score;
                      const isEvaluating = evaluatingStudents.has(student.id);
                      
                      return (
                        <div key={student.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-yellow-600' : 'bg-blue-500'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{student.name}</h4>
                                <p className="text-sm text-gray-600">{student.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {finalScore.toFixed(1)}%
                                  {aiEvaluation && (
                                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                      AI Evaluated
                                    </span>
                                  )}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(student.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                                >
                                  {selectedStudent === student.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  <span>{selectedStudent === student.id ? 'Hide' : 'View'}</span>
                                </button>
                                
                                <button
                                  onClick={() => evaluateWithAI(student.id)}
                                  disabled={isEvaluating || !!aiEvaluation}
                                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                                >
                                  {isEvaluating ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Brain className="h-4 w-4" />
                                  )}
                                  <span>
                                    {isEvaluating ? 'Evaluating...' : aiEvaluation ? 'Re-evaluate' : 'AI Evaluate'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Student Answers */}
                          {selectedStudent === student.id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <h5 className="font-semibold text-gray-900 mb-4">Student Answers:</h5>
                              <div className="space-y-4 max-h-96 overflow-y-auto">
                                {questions.map((question, qIndex) => {
                                  const studentAnswer = student.answers[qIndex];
                                  const aiScore = aiEvaluation?.subjectiveScores[qIndex];
                                  
                                  let isCorrect = false;
                                  if (question.type === 'multiple-choice') {
                                    isCorrect = studentAnswer === question.correctAnswer;
                                  } else if (question.type === 'fill-blank') {
                                    isCorrect = typeof studentAnswer === 'string' && 
                                               typeof question.correctAnswer === 'string' &&
                                               studentAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase();
                                  }
                                  
                                  return (
                                    <div key={qIndex} className="border-b border-gray-200 pb-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-900">
                                          Q{qIndex + 1}: {question.question.substring(0, 100)}...
                                        </p>
                                        <div className="flex items-center space-x-2">
                                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            question.type === 'multiple-choice' ? 'bg-blue-100 text-blue-800' :
                                            question.type === 'fill-blank' ? 'bg-green-100 text-green-800' :
                                            'bg-purple-100 text-purple-800'
                                          }`}>
                                            {question.type === 'multiple-choice' ? 'MCQ' :
                                             question.type === 'fill-blank' ? 'Fill' : 'Subjective'}
                                          </span>
                                          {question.type === 'subjective' && aiScore !== undefined ? (
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                              AI: {aiScore.toFixed(1)}/{question.points}
                                            </span>
                                          ) : question.type !== 'subjective' ? (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                              {isCorrect ? 'Correct' : 'Incorrect'}
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>
                                      
                                      <div className="text-sm text-gray-600 space-y-1">
                                        <p>
                                          <span className="font-medium">Student Answer: </span>
                                          {question.type === 'multiple-choice' 
                                            ? (typeof studentAnswer === 'number' ? question.options[studentAnswer] || 'No answer' : 'No answer')
                                            : (studentAnswer || 'No answer')
                                          }
                                        </p>
                                        
                                        {question.type !== 'subjective' && (
                                          <p>
                                            <span className="font-medium">Correct Answer: </span>
                                            {question.type === 'multiple-choice' 
                                              ? (typeof question.correctAnswer === 'number' ? question.options[question.correctAnswer] : question.correctAnswer)
                                              : question.correctAnswer
                                            }
                                          </p>
                                        )}
                                        
                                        {question.type === 'subjective' && aiEvaluation?.evaluationResults && (
                                          <div className="mt-2 p-2 bg-purple-50 rounded">
                                            <p className="font-medium text-purple-800">AI Feedback:</p>
                                            <p className="text-purple-700 text-xs">
                                              {aiEvaluation.evaluationResults[questions.filter(q => q.type === 'subjective').indexOf(question)]?.feedback}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          
                          {/* AI Evaluation Results */}
                          {aiEvaluation && (
                            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                              <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <Brain className="h-5 w-5 text-purple-600 mr-2" />
                                AI Evaluation Summary
                              </h5>
                              <div className="text-sm text-gray-700 space-y-2">
                                <p><strong>AI Analyzed Final Score:</strong> {aiEvaluation.finalScore.toFixed(1)}%</p>
                                <p><strong>Objective Score (Auto-evaluated):</strong> {aiEvaluation.objectiveScore} points</p>
                                <p><strong>Subjective Score (AI evaluated):</strong> {aiEvaluation.totalSubjectiveScore.toFixed(1)} points</p>
                                <p><strong>AI Feedback:</strong> {aiEvaluation.feedback}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};