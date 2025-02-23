
import { useState, useEffect, useRef } from 'react';

interface LetterPosition {
  row: number;
  col: number;
  letter: string;
  buttonId: string;
}

const Index = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundLetters, setFoundLetters] = useState<{ [key: string]: string[] }>({});
  const [unlockedButtons, setUnlockedButtons] = useState<Set<string>>(new Set());
  const [collectingButton, setCollectingButton] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const navButtons = [
    { 
      id: 'about', 
      label: 'ABOUT ME', 
      link: '#',
      content: "An AI expert with a strong ML background, specializing in GenAI and LLM education. A former Fulbright scholar, she leads Growth and Education at Vellum, helping companies build and scale AI products. She conducts LLM evaluations and writes extensively on AI best practices, empowering business leaders to drive effective AI adoption."
    },
    { 
      id: 'linkedin', 
      label: 'LINKED IN', 
      link: 'https://www.linkedin.com/in/anitakirkovska/' 
    },
    { 
      id: 'article', 
      label: 'LATEST ARTICLE', 
      link: 'https://www.vellum.ai/blog/how-can-agentic-capabilities-be-deployed-in-production-today' 
    },
    { 
      id: 'call', 
      label: 'BOOK CALL', 
      link: '#' 
    },
  ];

  const letterPositions: LetterPosition[] = [
    { row: 5, col: 10, letter: 'S', buttonId: 'call' },
    { row: 5, col: 12, letter: 'E', buttonId: 'call' },
    { row: 5, col: 14, letter: 'N', buttonId: 'call' },
    { row: 5, col: 16, letter: 'D', buttonId: 'call' },
    { row: 6, col: 10, letter: 'M', buttonId: 'call' },
    { row: 6, col: 12, letter: 'A', buttonId: 'call' },
    { row: 6, col: 14, letter: 'I', buttonId: 'call' },
    { row: 6, col: 16, letter: 'L', buttonId: 'call' },
  ];

  useEffect(() => {
    const generateGrid = () => {
      const rows = 15;
      const cols = 25;
      const newGrid: string[][] = [];
      
      for (let i = 0; i < rows; i++) {
        const row: string[] = [];
        for (let j = 0; j < cols; j++) {
          row.push(Math.floor(Math.random() * 10).toString());
        }
        newGrid.push(row);
      }

      letterPositions.forEach(({ row, col, letter }) => {
        newGrid[row][col] = letter;
      });
      
      setGrid(newGrid);
    };

    generateGrid();
  }, []);

  const handleCellClick = async (row: number, col: number) => {
    const clickedPosition = letterPositions.find(pos => pos.row === row && pos.col === col);
    
    if (clickedPosition && !unlockedButtons.has(clickedPosition.buttonId)) {
      const { letter, buttonId } = clickedPosition;
      const currentFoundLetters = foundLetters[buttonId] || [];
      
      if (!currentFoundLetters.includes(letter)) {
        setCollectingButton(buttonId);
        
        // Create letter collection animation
        const cellElement = document.getElementById(`cell-${row}-${col}`);
        const buttonElement = document.getElementById(`button-${buttonId}`);
        
        if (cellElement && buttonElement) {
          const cellRect = cellElement.getBoundingClientRect();
          const buttonRect = buttonElement.getBoundingClientRect();
          
          const moveX = buttonRect.left - cellRect.left;
          const moveY = buttonRect.top - cellRect.top;
          
          cellElement.style.setProperty('--move-x', `${moveX}px`);
          cellElement.style.setProperty('--move-y', `${moveY}px`);
          cellElement.classList.add('collecting-letter');
          
          // Wait for animation to complete
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedFoundLetters = {
            ...foundLetters,
            [buttonId]: [...currentFoundLetters, letter].sort()
          };
          setFoundLetters(updatedFoundLetters);

          const allLettersForButton = letterPositions
            .filter(pos => pos.buttonId === buttonId)
            .map(pos => pos.letter)
            .sort();

          if (updatedFoundLetters[buttonId].join('') === allLettersForButton.join('')) {
            setUnlockedButtons(prev => new Set([...prev, buttonId]));
          }
          
          setCollectingButton(null);
        }
      }
    }
  };

  const handleLetterHover = (row: number, col: number) => {
    const hoveredPosition = letterPositions.find(pos => pos.row === row && pos.col === col);
    if (hoveredPosition) {
      setHoveredLetter(hoveredPosition.buttonId);
    } else {
      setHoveredLetter(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      {/* Background Grid */}
      <div className="cyber-grid" ref={gridRef}>
        {grid.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((cell, j) => {
              const position = letterPositions.find(pos => pos.row === i && pos.col === j);
              const isLetter = !!position;
              const isHighlighted = position && (hoveredLetter === position.buttonId || collectingButton === position.buttonId);
              
              return (
                <span
                  id={`cell-${i}-${j}`}
                  key={`${i}-${j}`}
                  className={`${
                    isLetter 
                      ? `text-cyber-blue cursor-pointer ${isHighlighted ? 'letter-highlight' : 'hover:bg-cyber-blue/20'}`
                      : 'text-cyber-blue/50'
                  }`}
                  onClick={() => handleCellClick(i, j)}
                  onMouseEnter={() => handleLetterHover(i, j)}
                  onMouseLeave={() => setHoveredLetter(null)}
                >
                  {cell}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Scan Line Effect */}
      <div className="scan-line animate-scanline" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-cyber-blue/20">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold animate-glow">Anita K.</h1>
          <span className="text-sm opacity-50">FOUNDING GROWTH LEAD</span>
        </div>
        <div className="rounded-full border border-cyber-blue p-2 animate-glow">
          <span className="text-sm">ANITA</span>
        </div>
      </header>

      {/* Main Navigation */}
      <main className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <div className="grid grid-cols-4 gap-4 p-4">
          {navButtons.map((button) => (
            <div key={button.id} className="flex flex-col space-y-2 relative">
              <a 
                id={`button-${button.id}`}
                href={unlockedButtons.has(button.id) ? button.link : '#'}
                target={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "_blank" : undefined}
                rel={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "noopener noreferrer" : undefined}
                className={`cyber-button ${collectingButton === button.id ? 'collecting' : ''} ${unlockedButtons.has(button.id) ? 'unlocked' : 'opacity-50 cursor-not-allowed'}`}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={(e) => !unlockedButtons.has(button.id) && e.preventDefault()}
              >
                {foundLetters[button.id] && foundLetters[button.id].length > 0 && (
                  <div className={`letter-box ${foundLetters[button.id].length > 0 ? 'visible' : ''}`}>
                    {foundLetters[button.id].join('')}
                  </div>
                )}
                {button.label}
              </a>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{
                    width: hoveredButton === button.id ? '100%' : '0%'
                  }}
                />
              </div>
              {hoveredButton === button.id && button.content && unlockedButtons.has(button.id) && (
                <div className="absolute bottom-full mb-4 p-4 bg-cyber-black/90 border border-cyber-blue rounded-md max-w-md">
                  <p className="text-sm">{button.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
