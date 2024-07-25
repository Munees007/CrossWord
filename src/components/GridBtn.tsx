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
  return (
    <div
      className={`border ${isCorrect ? 'bg-green-500' : isInteractive ? 'bg-white' : 'bg-blue-300'} border-black`}
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
          className={`w-full h-full bg-transparent border-none text-center ${disabled ? 'cursor-not-allowed' : ''}`}
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
            top: questionNumber === 14 || questionNumber === 17 ? '50%' : 0,
            left: questionNumber === 14 || questionNumber === 17 ? '60%' : 0,
            transform: questionNumber === 14 || questionNumber === 17 ? 'translate(-50%, -50%)' : 'none',
            padding: questionNumber === 14 || questionNumber === 17 ? '2px' : '2px',
          }}
        >
          <p className="text-xs text-black/50">{questionNumber}</p>
        </div>
      )}
    </div>
  );
};

export default GridBtn;
