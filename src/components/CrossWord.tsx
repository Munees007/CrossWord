import React, { useState, useEffect } from "react";
import GridBtn from "./GridBtn";
import Question from "./question";
import { RiTimerFlashLine } from "react-icons/ri";
import { submitFormData, updateGameData } from "./storeData";
import { toast } from "react-toastify";
import Form from "./Form";
import 'react-toastify/ReactToastify.min.css'
import { useNavigate } from "react-router-dom";
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
      1: { answer: "MOUSE", row: 0, col: 8 },
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
      2: { answer: "SHIFT", row: 0, col: 11 },
      3: { answer: "DEVICE", row: 1, col: 1 },
      4: { answer: "ROM", row: 1, col: 4 },
      7: { answer: "MONITOR", row: 2, col: 13 },
      8: { answer: "NUMERICKEYS", row: 2, col: 15 },
      9: { answer: "BOOT", row: 4, col: 9 },
      10: { answer: "LAPTOP", row: 5, col: 6 },
      13: { answer: "RAM", row: 8, col: 3 },
      15: { answer: "UPDATE", row: 8, col: 17 },
      16: { answer: "NETWORK", row: 9, col: 11 },
    },
  };

  // Load initial state from local storage or initialize

  const initialInputs = loadFromLocalStorage(STORAGE_KEY) || Array(400).fill('');
  const navigate = useNavigate();
  const initialScore = loadFromLocalStorage(SCORE_KEY) || 0;
  const initialTimer = loadFromLocalStorage(TIMER_KEY) || 45 * 60; // 25 minutes in seconds

  const [inputs, setInputs] = useState<string[]>(initialInputs);
  const [feedback, setFeedback] = useState<Record<string, boolean | undefined>>({});
  const [score, setScore] = useState<number>(initialScore);
  const [timer, setTimer] = useState<number>(initialTimer);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(!loadTimerFinished());
  const[isGameOver,setIsGameOver] = useState<boolean>(()=>{
    const gameover = localStorage.getItem('gameOver');
    return gameover === "true" ? true : false; 
  });
  const [showForm, setShowForm] = useState<boolean>(() => {
    const formSubmitted = localStorage.getItem('formSubmitted');
    return formSubmitted ? false : true; // Show form if 'formSubmitted' is not set
  });

  const handleGameOver = async () => {
    const gameData: any = {
      score: score,
      time: timer,
    };
    const userData = localStorage.getItem('userData');
    const data = JSON.parse(userData!);
    const rollNumber = data.rollNumber; // Ensure you have formData available here
    try {
      await updateGameData(rollNumber, gameData);
      setIsGameOver(true);
      localStorage.setItem("gameOver","true");
      console.log('Game data updated on game over.');
    } catch (error) {
      console.error('Error updating game data:', error);
    }
  };
  // Save inputs, score, and timer to local storage on change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, inputs);
    saveToLocalStorage(SCORE_KEY, score);
    saveToLocalStorage(TIMER_KEY, timer);
  }, [inputs, score, timer]);
  useEffect(()=>{
    const flag = localStorage.getItem('timeFlag');
    if(flag)
    {

    }
    else
    {
        navigate('/');
    }
},[])
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

  useEffect(()=>{
      if(isGameOver)
      {
        navigate('/end');
      }
  },[isGameOver])

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timer > 0 && showForm===false) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      handleGameOver()
      setIsTimerRunning(false); // Stop the timer when it reaches zero
      setTimerFinished(true); // Set timer finished flag to true
    }
  }, [isTimerRunning, timer,showForm]);

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  useEffect(()=>{
    if(score === 20)
    {
        setTimerFinished(true);
        setIsTimerRunning(false);
        handleGameOver();
    }
  },[score])


  const getCellData = () => {
    const cellData = Array.from({ length: 400 }, () => ({
      isInteractive: false,
      value: "",
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
          isCorrect: feedback[key] ?? undefined,

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
          isCorrect: feedback[key] ?? undefined,
        };
      });
    });

    [14, 17,6].forEach((qNum) => {
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
    let isCorrect:any = true;
    answer.split('').forEach((char, index) => {
      const cellIndex = isAcross ? row * 20 + (col + index) : (row + index) * 20 + col;

      if(inputs[cellIndex]==='')
      {
          isCorrect = undefined;
      }
      else if (inputs[cellIndex] !== char) {
        isCorrect = false;
      }
    });
    return isCorrect;
  };


  const checkAnswers = () => {
    const newFeedback: Record<string, boolean | undefined> = {};
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
  
  const handleFormSubmit = async (formData:any) => {
    localStorage.setItem('formSubmitted', 'true');
    try {
      const gameData:any = {
        score:score,
        time : timer
      }
      const res = await submitFormData(formData,gameData);
      if(res !== 'Duplicate')
      {
          toast.success("Thank you for the Details!")
          setShowForm(false);
      }
      else
      {
          toast.error("User Already Exists")
          setShowForm(false)
      }
      
    } catch (error) {
        console.log(error)
    }
    
  };
  useEffect(()=>{

      if(score == 20)
        {
          setIsTimerRunning(false)
        }
  },[score])

  return (
    <div className="bg-[#3052A1] w-full h-screen items-center flex">
      <div className="w-[65rem] h-screen overflow-auto bg-blue-400">
        <Question />
      </div>
      <div className="flex flex-col p-4 w-full h-full inset-0 justify-center items-center">
        <div className="flex flex-col w-full">
          <p className="text-2xl text-center text-white font-bold font-playfair mb-4">
            PUZZLE MYSTRIES
          </p>
          <div className="flex mx-10 mb-2 justify-between items-center">
            <div className="text-2xl font-playfair text-white">
              SCORE: {score}
            </div>
            <div className="flex items-center gap-2 text-white py-2 px-4 rounded">
              <RiTimerFlashLine size={30} className="" />
              <p className="text-2xl font-playfair">{formatTime(timer)}</p>
            </div>
          </div>
          {/* <div className="text-lg">{formatTime(timer)}</div> */}
        </div>
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
        {showForm && <Form onSubmit={handleFormSubmit} />}
      </div>
    </div>
  );
};

export default CrossWord;
