import React, { useState, useEffect } from "react";
import GridBtn from "./GridBtn";
import Question from "./question";
import { RiTimerFlashLine } from "react-icons/ri";

// Utility functions for managing local storage and expiration time
const STORAGE_KEY = "crossword-answers";
const SCORE_KEY = "crossword-score";
const EXPIRATION_KEY = "crossword-expiration";
const TIMER_KEY = "crossword-timer";
const TIMER_FINISHED_KEY = "crossword-timer-finished";

const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key: string) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

const setExpirationTime = () => {
  const now = new Date();
  const expirationTime = now.getTime() + 25 * 60 * 1000; // 25 minutes
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
  localStorage.removeItem(TIMER_KEY);
  localStorage.removeItem(TIMER_FINISHED_KEY);
};

const setTimerFinished = (isFinished: boolean) => {
  localStorage.setItem(TIMER_FINISHED_KEY, JSON.stringify(isFinished));
};

const loadTimerFinished = () => {
  const storedValue = localStorage.getItem(TIMER_FINISHED_KEY);
  return storedValue ? JSON.parse(storedValue) : false;
};

const CrossWord: React.FC = () => {
  const data = {
    across: {
      1: { answer: "MOUSE", row: 0, col: 9 },
      5: { answer: "KEYBOARD", row: 2, col: 0 },
      6: { answer: "IBM", row: 2, col: 11 },
      9: { answer: "BIT", row: 4, col: 9 },
      11: { answer: "PERSONALCOMPUTER", row: 6, col: 0 },
      12: { answer: "PRINTER", row: 8, col: 2 },
      14: { answer: "CPU", row: 8, col: 15 },
      17: { answer: "PRINTER", row: 10, col: 6 },
      18: { answer: "CAPSLOCK", row: 13, col: 6 },
      19: { answer: "SPEAKERS", row: 15, col: 7 },
    },
    down: {
      2: { answer: "SHIFT", row: 0, col: 12 },
      3: { answer: "DEVICE", row: 1, col: 1 },
      4: { answer: "ROM", row: 1, col: 4 },
      7: { answer: "MONITOR", row: 2, col: 13 },
      8: { answer: "NUMERICKEYS", row: 2, col: 15 },
      9: { answer: "BOOT", row: 4, col: 9 },
      10: { answer: "LAPTOP", row: 5, col: 6 },
      13: { answer: "RAM", row: 8, col: 3 },
      15: { answer: "UPLOAD", row: 8, col: 17 },
      16: { answer: "NETWORK", row: 9, col: 11 },
    },
  };

  // Load initial state from local storage or initialize
  const initialInputs = loadFromLocalStorage(STORAGE_KEY) || Array(400).fill("");
  const initialScore = loadFromLocalStorage(SCORE_KEY) || 0;
  const initialTimer = loadFromLocalStorage(TIMER_KEY) || 25 * 60; // 25 minutes in seconds

  const [inputs, setInputs] = useState<string[]>(initialInputs);
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(initialScore);
  const [timer, setTimer] = useState<number>(initialTimer);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(!loadTimerFinished());

  // Save inputs, score, and timer to local storage on change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, inputs);
    saveToLocalStorage(SCORE_KEY, score);
    saveToLocalStorage(TIMER_KEY, timer);
  }, [inputs, score, timer]);

  // Set expiration time when component mounts
  useEffect(() => {
    if (isExpired()) {
      clearLocalStorage();
      setExpirationTime();
    }
  }, []);

  // Call checkAnswers after the component mounts
  useEffect(() => {
    checkAnswers();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      setIsTimerRunning(false); // Stop the timer when it reaches zero
      setTimerFinished(true); // Set timer finished flag to true
    }
  }, [isTimerRunning, timer]);

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const getCellData = () => {
    const cellData = Array.from({ length: 400 }, () => ({
      isInteractive: false,
      value: "",
      questionNumber: undefined as number | undefined,
      isCorrect: undefined as boolean | undefined,
    }));

    Object.entries(data.across).forEach(([key, { answer, row, col }]) => {
      answer.split("").forEach((_, index) => {
        const cellIndex = row * 20 + (col + index);
        cellData[cellIndex] = {
          isInteractive: true,
          value: inputs[cellIndex],
          questionNumber: index === 0 ? parseInt(key, 10) : undefined,
          isCorrect: feedback[key] ?? undefined,
        };
      });
    });

    Object.entries(data.down).forEach(([key, { answer, row, col }]) => {
      answer.split("").forEach((_, index) => {
        const cellIndex = (row + index) * 20 + col;
        cellData[cellIndex] = {
          isInteractive: true,
          value: inputs[cellIndex],
          questionNumber: index === 0 ? parseInt(key, 10) : undefined,
          isCorrect: feedback[key] ?? undefined,
        };
      });
    });

    [14, 17].forEach((qNum) => {
      const acrossEntry = Object.entries(data.across).find(
        ([key]) => parseInt(key, 10) === qNum
      );
      const downEntry = Object.entries(data.down).find(
        ([key]) => parseInt(key, 10) === qNum
      );

      const entry = acrossEntry || downEntry;
      if (entry) {
        const { row, col } = entry[1];
        let prevCellIndex;
        if (acrossEntry) {
          prevCellIndex = row * 20 + (col - 1);
        } else if (downEntry) {
          prevCellIndex = (row - 1) * 20 + col;
        }
        if (
          prevCellIndex !== undefined &&
          cellData[prevCellIndex] &&
          !cellData[prevCellIndex].isInteractive
        ) {
          cellData[prevCellIndex].questionNumber = qNum;
        }
      }
    });

    return cellData;
  };

  const checkWord = (
    _: string,
    answer: string,
    row: number,
    col: number,
    isAcross: boolean
  ) => {
    let isCorrect = true;
    answer.split("").forEach((char, index) => {
      const cellIndex = isAcross
        ? row * 20 + (col + index)
        : (row + index) * 20 + col;
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

  // Format the timer display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="w-full h-screen items-center flex bg-black">
      <div className="w-[65rem] h-screen overflow-auto bg-blue-400">
        <Question />
      </div>
      <div className="flex flex-col p-4 w-full h-full inset-0 justify-center items-center">
        {/* <div className="flex flex-col">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">{formatTime(timer)}</div>
        </div> */}
        <div
          className="bg-blue-300 w-[40rem] h-[40rem]"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(20, 1fr)",
            gridTemplateRows: "repeat(20, 1fr)",
          }}
        >
          {cellData.map((cell, index) => (
            <GridBtn
              key={index}
              isInteractive={cell.isInteractive}
              onChange={(value) =>
                cell.isInteractive && handleChange(index, value)
              }
              value={cell.value}
              questionNumber={cell.questionNumber}
              isCorrect={cell.isCorrect}
              disabled={!isTimerRunning} // Disable input based on timer
            />
          ))}
        </div>
        <button
          onClick={checkAnswers}
          className="mt-4 p-2 bg-green-500 text-white rounded-md"
          disabled={!isTimerRunning} // Disable button if timer is not running
        >
          Check Answers
        </button>
        <div className="fixed flex flex-col items-center bottom-0 right-8 text-white py-2 px-4 rounded">
          <RiTimerFlashLine size={30} className="" />
          <p className="text-2xl font-playfair">{formatTime(timer)}</p>
        </div>
      </div>
    </div>
  );
};

export default CrossWord;
