
import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';

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
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);
  const [showLetters, setShowLetters] = useState<string | null>(null);
  const [floatingLetters, setFloatingLetters] = useState<Array<{ letter: string, style: React.CSSProperties }>>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

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
    // ABOUT ME - Spread out horizontally
    { row: 2, col: 2, letter: 'A', buttonId: 'about' },
    { row: 2, col: 3, letter: 'B', buttonId: 'about' },
    { row: 2, col: 4, letter: 'O', buttonId: 'about' },
    { row: 2, col: 5, letter: 'U', buttonId: 'about' },
    { row: 2, col: 6, letter: 'T', buttonId: 'about' },
    { row: 2, col: 7, letter: 'M', buttonId: 'about' },
    { row: 2, col: 8, letter: 'E', buttonId: 'about' },
    
    // LINKED IN - Spread out diagonally
    { row: 4, col: 2, letter: 'L', buttonId: 'linkedin' },
    { row: 4, col: 3, letter: 'I', buttonId: 'linkedin' },
    { row: 4, col: 4, letter: 'N', buttonId: 'linkedin' },
    { row: 4, col: 5, letter: 'K', buttonId: 'linkedin' },
    { row: 4, col: 6, letter: 'E', buttonId: 'linkedin' },
    { row: 4, col: 7, letter: 'D', buttonId: 'linkedin' },
    { row: 4, col: 8, letter: 'I', buttonId: 'linkedin' },
    { row: 4, col: 9, letter: 'N', buttonId: 'linkedin' },
    
    // ARTICLE - Spread out horizontally
    { row: 6, col: 2, letter: 'A', buttonId: 'article' },
    { row: 6, col: 3, letter: 'R', buttonId: 'article' },
    { row: 6, col: 4, letter: 'T', buttonId: 'article' },
    { row: 6, col: 5, letter: 'I', buttonId: 'article' },
    { row: 6, col: 6, letter: 'C', buttonId: 'article' },
    { row: 6, col: 7, letter: 'L', buttonId: 'article' },
    { row: 6, col: 8, letter: 'E', buttonId: 'article' },
    
    // SEND MAIL - Moved to bottom and spread out
    { row: 8, col: 2, letter: 'S', buttonId: 'call' },
    { row: 8, col: 3, letter: 'E', buttonId: 'call' },
    { row: 8, col: 4, letter: 'N', buttonId: 'call' },
    { row: 8, col: 5, letter: 'D', buttonId: 'call' },
    { row: 9, col: 2, letter: 'M', buttonId: 'call' },
    { row: 9, col: 3, letter: 'A', buttonId: 'call' },
    { row: 9, col: 4, letter: 'I', buttonId: 'call' },
    { row: 9, col: 5, letter: 'L', buttonId: 'call' },
  ];

  useEffect(() => {
    const generateGrid = () => {
      const rows = 12;
      const cols = 20;
      const newGrid: string[][] = [];
      
      for (let i = 0; i < rows; i++) {
        const row: string[] = [];
        for (let j = 0; j < cols; j++) {
          row.push(Math.floor(Math.random() * 10).toString());
        }
        newGrid.push(row);
      }

      letterPositions.forEach(({ row, col, letter }) => {
        if (newGrid[row] && newGrid[row][col]) {
          newGrid[row][col] = letter;
        }
      });
      
      setGrid(newGrid);
    };

    generateGrid();
  }, []);

  const handleCellClick = (row: number, col: number) => {
    const clickedPosition = letterPositions.find(pos => pos.row === row && pos.col === col);
    
    if (clickedPosition) {
      const { buttonId } = clickedPosition;
      const button = buttonRefs.current[buttonId];
      
      if (!button) return;

      const buttonRect = button.getBoundingClientRect();
      const allLettersForButton = letterPositions
        .filter(pos => pos.buttonId === buttonId)
        .map(pos => {
          const element = document.getElementById(`cell-${pos.row}-${pos.col}`);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return {
            letter: pos.letter,
            style: {
              '--start-x': `${rect.left}px`,
              '--start-y': `${rect.top}px`,
              '--end-x': `${buttonRect.left + buttonRect.width / 2}px`,
              '--end-y': `${buttonRect.top}px`,
            } as React.CSSProperties
          };
        })
        .filter((item): item is { letter: string, style: React.CSSProperties } => item !== null);

      setFloatingLetters(allLettersForButton);
      setAnimatingButton(buttonId);
      
      setTimeout(() => {
        setShowLetters(buttonId);
        setFloatingLetters([]);
        
        setTimeout(() => {
          setFoundLetters(prev => ({
            ...prev,
            [buttonId]: allLettersForButton.map(item => item.letter)
          }));
          
          setTimeout(() => {
            setShowLetters(null);
            
            setTimeout(() => {
              setAnimatingButton(null);
              setUnlockedButtons(prev => new Set([...prev, buttonId]));
            }, 500);
          }, 1000);
        }, 500);
      }, 1000);
    }
  };

  const handleLetterHover = (row: number, col: number) => {
    const hoveredPosition = letterPositions.find(pos => pos.row === row && pos.col === col);
    if (hoveredPosition) {
      setHoveredLetter(hoveredPosition.buttonId);
    } else {
      setHoveredLetter(null);
    }
    setHoveredCell({ row, col });
  };

  const getCellClassName = (i: number, j: number) => {
    if (!hoveredCell) return 'grid-cell';
    
    const position = letterPositions.find(pos => pos.row === i && pos.col === j);
    const isLetter = !!position;
    const isHighlighted = position && (
      hoveredLetter === position.buttonId || 
      (hoveredButton === position.buttonId && unlockedButtons.has(position.buttonId))
    );
    
    const distance = Math.max(
      Math.abs(i - hoveredCell.row),
      Math.abs(j - hoveredCell.col)
    );

    let classes = 'grid-cell';
    
    if (i === hoveredCell.row && j === hoveredCell.col) {
      classes += ' grid-cell-hover';
    } else if (distance <= 2) {
      classes += distance === 1 ? ' grid-cell-neighbor-1' : ' grid-cell-neighbor-2';
    }

    if (isLetter) {
      classes += ` text-cyber-blue cursor-pointer ${isHighlighted ? 'brightness-150' : 'hover:brightness-125'}`;
    } else {
      classes += ' text-cyber-blue/50';
    }

    return classes;
  };

  const calculateProgress = () => {
    const totalPhrases = navButtons.length;
    const unlockedCount = unlockedButtons.size;
    return (unlockedCount / totalPhrases) * 100;
  };

  useEffect(() => {
    const progress = calculateProgress();
    if (progress === 100) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [unlockedButtons]);

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      {showConfetti && <Confetti />}
      
      <header className="fixed top-0 left-0 right-0 p-2 md:p-4 flex flex-col md:flex-row justify-between items-center border-b border-cyber-blue/20 bg-cyber-black/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold animate-glow">Anita K.</h1>
          <span className="text-xs md:text-sm opacity-50">FOUNDING GROWTH LEAD</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-32 md:w-48 bg-cyber-blue/20 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyber-blue transition-all duration-1000 ease-out"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <span className="text-xs md:text-sm text-cyber-blue">{Math.round(calculateProgress())}%</span>
          </div>
          <div className="rounded-full border border-cyber-blue p-1 md:p-2 animate-glow">
            <span className="text-xs md:text-sm">ANITA</span>
          </div>
        </div>
      </header>

      <div className="cyber-grid pt-20">
        {grid.map((row, i) => (
          <div key={i} className="flex justify-center gap-2 md:gap-6">
            {row.map((cell, j) => (
              <span
                id={`cell-${i}-${j}`}
                key={`${i}-${j}`}
                className={getCellClassName(i, j)}
                onClick={() => handleCellClick(i, j)}
                onMouseEnter={() => handleLetterHover(i, j)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>

      {floatingLetters.map((item, index) => (
        <div
          key={index}
          className="floating-letters"
          style={item.style}
        >
          {item.letter}
        </div>
      ))}

      <div className="scan-line animate-scanline" />
      
      <main className="fixed bottom-4 md:bottom-20 left-1/2 -translate-x-1/2 w-full px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto">
          {navButtons.map((button) => (
            <div key={button.id} className="flex flex-col space-y-1 md:space-y-2 relative">
              {showLetters === button.id && foundLetters[button.id] && (
                <div className="floating-letters">
                  {foundLetters[button.id].join('')}
                </div>
              )}
              <a 
                href={unlockedButtons.has(button.id) ? button.link : '#'}
                target={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "_blank" : undefined}
                rel={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "noopener noreferrer" : undefined}
                className={`cyber-button text-sm md:text-base relative ${
                  !unlockedButtons.has(button.id) ? 'opacity-50 cursor-not-allowed' : ''
                } ${animatingButton === button.id ? 'animating-box' : ''} ${
                  unlockedButtons.has(button.id) ? 'unlocked' : ''
                }`}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={(e) => !unlockedButtons.has(button.id) && e.preventDefault()}
                ref={(el) => buttonRefs.current[button.id] = el}
              >
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
                <div className="absolute bottom-full mb-2 md:mb-4 p-2 md:p-4 bg-cyber-black/90 border border-cyber-blue rounded-md max-w-[200px] md:max-w-md z-50">
                  <p className="text-xs md:text-sm">{button.content}</p>
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

