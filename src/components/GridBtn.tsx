import React from 'react';

interface GridBtnProps {
  isInteractive: boolean;
  onChange?: (value: string) => void;
  value?: string;
  questionNumber?: number;
  isCorrect?: boolean;
  disabled?: boolean;
}

const GridBtn: React.FC<GridBtnProps> = ({
  isInteractive,
  onChange,
  value,
  questionNumber,
  isCorrect,
  disabled = false,
}) => {
  // Determine the background color based on the new rules
  let backgroundColor;
  if (!isInteractive) {
    backgroundColor = 'bg-[#D2DBEC]'; // white
  } else if (value === '') {
    backgroundColor = 'bg-[#2b2d42]'; // yellow
  }  else if (isCorrect === undefined) {
    backgroundColor = 'bg-[#2b2d42]'; // green
  }else if (isCorrect)
    {
      backgroundColor = 'bg-green-500';
    }
  else {
    backgroundColor = 'bg-red-600'; // red
  }

  return (
    <div
      className={`border ${backgroundColor} border-black`}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isInteractive && !disabled ? 'text' : 'default',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
      }}
      aria-disabled={disabled}
    >
      {isInteractive ? (
        <input
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => onChange?.(e.target.value.toUpperCase())}
          className={`w-full h-full font-bold text-[#faf3f6] bg-transparent border-none text-center ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{ boxSizing: 'border-box' }}
          disabled={disabled}
          aria-label={`Cell ${questionNumber}`}
        />
      ) : (
        <div className="w-full h-full bg-transparent" />
      )}
      {questionNumber !== undefined && (
        <div
          className={`absolute flex items-center justify-center ${questionNumber === 14 || questionNumber === 17 ? 'z-50' : 'z-10'}`}
          style={{
            top: questionNumber === 14 || questionNumber === 17 || questionNumber === 6 ? '22%' : 0,
            left: questionNumber === 14 || questionNumber === 17 || questionNumber === 6 ? '2.32rem' : 0,
            transform: questionNumber === 14 || questionNumber === 17 || questionNumber === 6 ? 'translate(-50%, -50%)' : 'none',
            padding: questionNumber === 14 || questionNumber === 17 || questionNumber === 6 ? '2px' : '2px',
          }}
        >
          <p className="text-xs text-white/50">{questionNumber}</p>
        </div>
      )}
    </div>
  );
};

export default GridBtn;
