import React, { useState, useEffect } from 'react';
import GridBtn from './GridBtn';

// Utility functions for managing local storage and expiration time
const STORAGE_KEY = 'crossword-answers';
const SCORE_KEY = 'crossword-score';
const EXPIRATION_KEY = 'crossword-expiration';

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

const setExpirationTime = () => {
  const now = new Date();
  const expirationTime = now.getTime() + 24 * 60 * 60 * 1000; // 24 hours
  localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
};

const isExpired = () => {
  const expirationTime = localStorage.getItem(EXPIRATION_KEY);
  if (!expirationTime) return true;
  const now = new Date().getTime();
  return now > parseInt(expirationTime, 10);
};

const clearLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SCORE_KEY);
  localStorage.removeItem(EXPIRATION_KEY);
};

const CrossWord: React.FC = () => {
  const data = {
    across: {
      1: { answer: 'TWO', row: 0, col: 0 },
      3: { answer: 'THREE', row: 1, col: 1 },
      5:{answer:'JAVA',row:9,col:0}
    },
    down: {
      2: { answer: 'ONE', row: 0, col: 2 },
      4: { answer: 'FOUR', row: 3, col: 4 },
    },
  };

  // Load initial state from local storage or initialize
  const initialInputs = loadFromLocalStorage(STORAGE_KEY) || Array(400).fill('');
  const initialScore = loadFromLocalStorage(SCORE_KEY) || 0;
  const [inputs, setInputs] = useState<string[]>(initialInputs);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(initialScore);

  // Save inputs and score to local storage on change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, inputs);
  }, [inputs]);

  useEffect(() => {
    saveToLocalStorage(SCORE_KEY, score);
  }, [score]);

  // Set expiration time when component mounts
  useEffect(() => {
    if (isExpired()) {
      clearLocalStorage();
      setExpirationTime();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const getCellData = () => {
    const cellData = Array.from({ length: 400 }, () => ({
      isInteractive: false,
      value: '',
      questionNumber: undefined as number | undefined,
      isCorrect: undefined as boolean | undefined,
    }));

    Object.entries(data.across).forEach(([key, { answer, row, col }]) => {
      answer.split('').forEach((_, index) => {
        const cellIndex = row * 20 + (col + index);
        cellData[cellIndex] = {
          isInteractive: true,
          value: inputs[cellIndex],
          questionNumber: index === 0 ? parseInt(key, 10) : undefined,
          isCorrect:feedback[key] ?? undefined
        };
      });
    });

    Object.entries(data.down).forEach(([key, { answer, row, col }]) => {
      answer.split('').forEach((_, index) => {
        const cellIndex = (row + index) * 20 + col;
        cellData[cellIndex] = {
          isInteractive: true,
          value: inputs[cellIndex],
          questionNumber: index === 0 ? parseInt(key, 10) : undefined,
          isCorrect:feedback[key] ?? undefined
        };
      });
    });

    return cellData;
  };

  const checkWord = (_: string, answer: string, row: number, col: number, isAcross: boolean) => {
    let isCorrect = true;
    answer.split('').forEach((char, index) => {
      const cellIndex = isAcross ? row * 20 + (col + index) : (row + index) * 20 + col;
      if (inputs[cellIndex] !== char) {
        isCorrect = false;
      }
    });
    return isCorrect;
  };

  const checkAnswers = () => {
    const newFeedback: Record<string, boolean> = {};
    let newScore = 0;

    Object.entries(data.across).forEach(([key, { answer, row, col }]) => {
      const isCorrect = checkWord(key, answer, row, col, true);
      newFeedback[key] = isCorrect;
      if (isCorrect) newScore += 1;
    });

    Object.entries(data.down).forEach(([key, { answer, row, col }]) => {
      const isCorrect = checkWord(key, answer, row, col, false);
      newFeedback[key] = isCorrect;
      if (isCorrect) newScore += 1;
    });

    setFeedback(newFeedback);
    setScore(newScore);
  };

  const cellData = getCellData();

  return (
    <div className="w-full h-screen m-4 justify-center items-center flex">
      <div className='flex flex-col'>
      <div className="grid grid-cols-20 grid-rows-20 bg-blue-300 w-[48rem] h-[48rem]">
        {cellData.map((cell, index) => (
          <GridBtn
            key={index}
            isInteractive={cell.isInteractive}
            onChange={(value) => cell.isInteractive && handleChange(index, value)}
            value={cell.value}
            questionNumber={cell.questionNumber}
            isCorrect={cell.isCorrect}
          />
        ))}
      </div>
      <button onClick={checkAnswers} className="mt-4 p-2 bg-green-500 text-white rounded-md">
        Check Answers
      </button>
      </div>
      <div className='flex flex-col'>
      <div className="mt-2 text-lg">
        Score: {score}
      </div>
{/*       {Object.entries(feedback).map(([key, correct]) => (
        <p key={key} className="mt-2 text-lg">
          {`Question ${key}: ${correct ? 'Correct' : 'Incorrect'}`}
        </p>
      ))} */}
      </div>
    </div>
  );
};

export default CrossWord;
