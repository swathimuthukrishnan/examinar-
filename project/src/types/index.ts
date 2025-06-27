export type View = 'landing' | 'student' | 'examiner';

export interface Student {
  id: string;
  name: string;
  email: string;
  score: number;
  answers: (number | string)[];
  submittedAt: string;
  aiEvaluation?: {
    subjectiveScores: { [questionId: number]: number };
    feedback: string;
    totalScore: number;
  };
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number | string;
  type: 'multiple-choice' | 'fill-blank' | 'subjective';
  points: number;
}

export interface TestSession {
  studentId: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  fullscreenExits: number;
}