import { useCallback, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Difficulty = "Easy" | "Medium" | "Hard";
export type TestStatus = "Draft" | "Published" | "Closed";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  marks: number;
  negativeMarking: boolean;
  negativePenalty: number;
  difficulty: Difficulty;
  subject: string;
}

export interface MockTest {
  id: string;
  title: string;
  className: string;
  subject: string;
  totalMarks: number;
  durationMinutes: number;
  passingPercentage: number;
  negativeMarkingEnabled: boolean;
  status: TestStatus;
  questionIds: string[];
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  className: string;
  answers: Record<string, string>;
  marksObtained: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // seconds
  submittedAt: string;
}

export interface TestInput {
  title: string;
  className: string;
  subject: string;
  totalMarks: number;
  durationMinutes: number;
  passingPercentage: number;
  negativeMarkingEnabled: boolean;
}

export interface QuestionInput {
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  marks: number;
  negativeMarking: boolean;
  negativePenalty: number;
  difficulty: Difficulty;
  subject: string;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "What is the capital of India?",
    options: [
      { id: "a", text: "Mumbai" },
      { id: "b", text: "New Delhi" },
      { id: "c", text: "Kolkata" },
      { id: "d", text: "Chennai" },
    ],
    correctOptionId: "b",
    marks: 2,
    negativeMarking: true,
    negativePenalty: 0.5,
    difficulty: "Easy",
    subject: "General Knowledge",
  },
  {
    id: "q2",
    text: "Which planet is known as the Red Planet?",
    options: [
      { id: "a", text: "Venus" },
      { id: "b", text: "Jupiter" },
      { id: "c", text: "Mars" },
      { id: "d", text: "Saturn" },
    ],
    correctOptionId: "c",
    marks: 2,
    negativeMarking: true,
    negativePenalty: 0.5,
    difficulty: "Easy",
    subject: "Science",
  },
  {
    id: "q3",
    text: "What is the value of π (pi) to two decimal places?",
    options: [
      { id: "a", text: "3.14" },
      { id: "b", text: "3.12" },
      { id: "c", text: "3.16" },
      { id: "d", text: "3.18" },
    ],
    correctOptionId: "a",
    marks: 3,
    negativeMarking: true,
    negativePenalty: 1,
    difficulty: "Medium",
    subject: "Mathematics",
  },
  {
    id: "q4",
    text: "Who wrote the national anthem of India, 'Jana Gana Mana'?",
    options: [
      { id: "a", text: "Mahatma Gandhi" },
      { id: "b", text: "Rabindranath Tagore" },
      { id: "c", text: "Subhash Chandra Bose" },
      { id: "d", text: "Jawaharlal Nehru" },
    ],
    correctOptionId: "b",
    marks: 2,
    negativeMarking: false,
    negativePenalty: 0,
    difficulty: "Easy",
    subject: "General Knowledge",
  },
  {
    id: "q5",
    text: "If x² - 5x + 6 = 0, what are the values of x?",
    options: [
      { id: "a", text: "x = 1, x = 6" },
      { id: "b", text: "x = 2, x = 3" },
      { id: "c", text: "x = -2, x = -3" },
      { id: "d", text: "x = 4, x = 5" },
    ],
    correctOptionId: "b",
    marks: 5,
    negativeMarking: true,
    negativePenalty: 1,
    difficulty: "Hard",
    subject: "Mathematics",
  },
  {
    id: "q6",
    text: "What is the chemical formula for water?",
    options: [
      { id: "a", text: "H₃O" },
      { id: "b", text: "HO₂" },
      { id: "c", text: "H₂O" },
      { id: "d", text: "H₂O₂" },
    ],
    correctOptionId: "c",
    marks: 2,
    negativeMarking: false,
    negativePenalty: 0,
    difficulty: "Easy",
    subject: "Science",
  },
  {
    id: "q7",
    text: "In which year did India gain independence?",
    options: [
      { id: "a", text: "1945" },
      { id: "b", text: "1947" },
      { id: "c", text: "1950" },
      { id: "d", text: "1942" },
    ],
    correctOptionId: "b",
    marks: 2,
    negativeMarking: true,
    negativePenalty: 0.5,
    difficulty: "Easy",
    subject: "History",
  },
  {
    id: "q8",
    text: "What is the largest organ in the human body?",
    options: [
      { id: "a", text: "Heart" },
      { id: "b", text: "Liver" },
      { id: "c", text: "Skin" },
      { id: "d", text: "Brain" },
    ],
    correctOptionId: "c",
    marks: 3,
    negativeMarking: true,
    negativePenalty: 1,
    difficulty: "Medium",
    subject: "Biology",
  },
  {
    id: "q9",
    text: "Simplify: (2³ × 2⁴) ÷ 2²",
    options: [
      { id: "a", text: "2³" },
      { id: "b", text: "2⁵" },
      { id: "c", text: "2⁷" },
      { id: "d", text: "2⁹" },
    ],
    correctOptionId: "b",
    marks: 4,
    negativeMarking: true,
    negativePenalty: 1,
    difficulty: "Medium",
    subject: "Mathematics",
  },
  {
    id: "q10",
    text: "Which gas is responsible for the greenhouse effect?",
    options: [
      { id: "a", text: "Oxygen" },
      { id: "b", text: "Nitrogen" },
      { id: "c", text: "Carbon Dioxide" },
      { id: "d", text: "Hydrogen" },
    ],
    correctOptionId: "c",
    marks: 3,
    negativeMarking: false,
    negativePenalty: 0,
    difficulty: "Medium",
    subject: "Science",
  },
];

const DEMO_TESTS: MockTest[] = [
  {
    id: "t1",
    title: "Science & GK — Mid Term Practice",
    className: "Class 10",
    subject: "Science",
    totalMarks: 30,
    durationMinutes: 45,
    passingPercentage: 40,
    negativeMarkingEnabled: true,
    status: "Published",
    questionIds: ["q1", "q2", "q4", "q6", "q7", "q10"],
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "t2",
    title: "Mathematics — Algebra & Exponents",
    className: "Class 10",
    subject: "Mathematics",
    totalMarks: 50,
    durationMinutes: 60,
    passingPercentage: 35,
    negativeMarkingEnabled: true,
    status: "Published",
    questionIds: ["q3", "q5", "q9"],
    createdAt: "2026-05-08T10:30:00Z",
  },
  {
    id: "t3",
    title: "Biology & Chemistry Basics",
    className: "Class 11",
    subject: "Biology",
    totalMarks: 25,
    durationMinutes: 30,
    passingPercentage: 50,
    negativeMarkingEnabled: false,
    status: "Draft",
    questionIds: ["q6", "q8", "q10"],
    createdAt: "2026-05-15T08:00:00Z",
  },
];

const DEMO_ATTEMPTS: TestAttempt[] = [
  {
    id: "a1",
    testId: "t1",
    studentId: "s1",
    studentName: "Aryan Sharma",
    className: "Class 10",
    answers: { q1: "b", q2: "c", q4: "b", q6: "c", q7: "b", q10: "c" },
    marksObtained: 26,
    percentage: 86.7,
    passed: true,
    timeTaken: 1820,
    submittedAt: "2026-05-10T10:30:00Z",
  },
  {
    id: "a2",
    testId: "t1",
    studentId: "s2",
    studentName: "Priya Singh",
    className: "Class 10",
    answers: { q1: "b", q2: "a", q4: "b", q6: "c", q7: "b", q10: "a" },
    marksObtained: 18,
    percentage: 60.0,
    passed: true,
    timeTaken: 2100,
    submittedAt: "2026-05-10T10:35:00Z",
  },
  {
    id: "a3",
    testId: "t1",
    studentId: "s3",
    studentName: "Rohan Gupta",
    className: "Class 10",
    answers: { q1: "a", q2: "c", q4: "a", q6: "c", q7: "b", q10: "c" },
    marksObtained: 13,
    percentage: 43.3,
    passed: true,
    timeTaken: 2600,
    submittedAt: "2026-05-10T10:44:00Z",
  },
  {
    id: "a4",
    testId: "t1",
    studentId: "s4",
    studentName: "Sneha Patel",
    className: "Class 10",
    answers: { q1: "c", q2: "b", q4: "c", q6: "a", q7: "b", q10: "c" },
    marksObtained: 8,
    percentage: 26.7,
    passed: false,
    timeTaken: 2700,
    submittedAt: "2026-05-10T10:45:00Z",
  },
  {
    id: "a5",
    testId: "t2",
    studentId: "s1",
    studentName: "Aryan Sharma",
    className: "Class 10",
    answers: { q3: "a", q5: "b", q9: "b" },
    marksObtained: 42,
    percentage: 84.0,
    passed: true,
    timeTaken: 3100,
    submittedAt: "2026-05-15T11:02:00Z",
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTests() {
  const [tests, setTests] = useState<MockTest[]>(DEMO_TESTS);
  const [questions, setQuestions] = useState<Question[]>(DEMO_QUESTIONS);
  const [attempts] = useState<TestAttempt[]>(DEMO_ATTEMPTS);

  const createTest = useCallback((input: TestInput): MockTest => {
    const newTest: MockTest = {
      id: `t${Date.now()}`,
      ...input,
      status: "Draft",
      questionIds: [],
      createdAt: new Date().toISOString(),
    };
    setTests((prev) => [...prev, newTest]);
    return newTest;
  }, []);

  const updateTest = useCallback((id: string, patch: Partial<MockTest>) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const publishTest = useCallback((id: string) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Published" } : t)),
    );
  }, []);

  const closeTest = useCallback((id: string) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Closed" } : t)),
    );
  }, []);

  const addQuestion = useCallback((input: QuestionInput): Question => {
    const newQ: Question = { id: `q${Date.now()}`, ...input };
    setQuestions((prev) => [...prev, newQ]);
    return newQ;
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const assignQuestionsToTest = useCallback(
    (testId: string, questionIds: string[]) => {
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                questionIds: [...new Set([...t.questionIds, ...questionIds])],
              }
            : t,
        ),
      );
    },
    [],
  );

  const getTestAttempts = useCallback(
    (testId: string) => attempts.filter((a) => a.testId === testId),
    [attempts],
  );

  const getStudentAttempts = useCallback(
    (studentId: string) => attempts.filter((a) => a.studentId === studentId),
    [attempts],
  );

  const getTestLeaderboard = useCallback(
    (testId: string) =>
      attempts
        .filter((a) => a.testId === testId)
        .sort((a, b) => b.marksObtained - a.marksObtained)
        .map((a, idx) => ({ ...a, rank: idx + 1 })),
    [attempts],
  );

  const getTestQuestions = useCallback(
    (test: MockTest) =>
      questions.filter((q) => test.questionIds.includes(q.id)),
    [questions],
  );

  return {
    tests,
    questions,
    attempts,
    createTest,
    updateTest,
    publishTest,
    closeTest,
    addQuestion,
    deleteQuestion,
    assignQuestionsToTest,
    getTestAttempts,
    getStudentAttempts,
    getTestLeaderboard,
    getTestQuestions,
  };
}
