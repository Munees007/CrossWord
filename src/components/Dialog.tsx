import React from 'react';

interface DialogProps {
  onClose: () => void;
  onConfirm: () => void;
}

const Dialog: React.FC<DialogProps> = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[35rem] h-fit p-4 py-6 rounded-lg shadow-lg text-center font-playfair">
        <p className="text-4xl mb-4">How are you?</p>
        <div className="flex justify-center gap-4">
            <p className='text-xl'>Crossword Puzzle is a word game where players fill in a grid with words based on given clues. The grid is composed of interlocking horizontal and vertical words, and each clue corresponds to a word in the grid. The goal is to complete the puzzle by solving all clues and filling in the grid correctly.</p>
          
        </div>
        <button
            className="bg-blue-500 mt-5 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Let us Begin
          </button>
      </div>
    </div>
  );
};

export default Dialog;
