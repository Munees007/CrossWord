import React from 'react';

interface GridBtnProps {
  isInteractive: boolean;
  onChange?: (value: string) => void;
  value?: string;
  questionNumber?: number;
  isCorrect?:boolean
}

const GridBtn: React.FC<GridBtnProps> = ({
  isInteractive,
  onChange,
  value,
  questionNumber,
  isCorrect
}) => {
  return (
    <div
      className={`border ${isInteractive ? 'bg-white' : 'bg-blue-300'} ${isCorrect ? 'bg-green-500' : isInteractive ? 'bg-white' :'bg-blue-300'} border-black`}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {isInteractive ? (
        <input
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => onChange?.(e.target.value.toUpperCase())}
          className="w-full h-full bg-transparent border-none text-center"
          style={{ boxSizing: 'border-box' }}
        />
      ) : (
        <div className="w-full h-full bg-transparent" />
      )}
      {questionNumber !== undefined && (
        <p className="absolute text-xs text-black/50" style={{ top: 2, left: 2 }}>
          {questionNumber}
        </p>
      )}
    </div>
  );
};

export default GridBtn;
