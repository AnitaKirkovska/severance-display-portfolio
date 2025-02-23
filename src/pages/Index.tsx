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
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);
  const [showLetters, setShowLetters] = useState<string | null>(null);
  const [floatingLetters, setFloatingLetters] = useState<Array<{ letter: string, style: React.CSSProperties }>>([]);
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
    { row: 2, col: 4, letter: 'A', buttonId: 'about' },
    { row: 2, col: 6, letter: 'B', buttonId: 'about' },
    { row: 2, col: 8, letter: 'O', buttonId: 'about' },
    { row: 2, col: 10, letter: 'U', buttonId: 'about' },
    { row: 2, col: 12, letter: 'T', buttonId: 'about' },
    { row: 2, col: 14, letter: 'M', buttonId: 'about' },
    { row: 2, col: 16, letter: 'E', buttonId: 'about' },
    
    // LINKED IN - Spread out diagonally
    { row: 4, col: 4, letter: 'L', buttonId: 'linkedin' },
    { row: 4, col: 6, letter: 'I', buttonId: 'linkedin' },
    { row: 4, col: 8, letter: 'N', buttonId: 'linkedin' },
    { row: 4, col: 10, letter: 'K', buttonId: 'linkedin' },
    { row: 4, col: 12, letter: 'E', buttonId: 'linkedin' },
    { row: 4, col: 14, letter: 'D', buttonId: 'linkedin' },
    { row: 4, col: 16, letter: 'I', buttonId: 'linkedin' },
    { row: 4, col: 18, letter: 'N', buttonId: 'linkedin' },
    
    // ARTICLE - Spread out horizontally
    { row: 6, col: 4, letter: 'A', buttonId: 'article' },
    { row: 6, col: 6, letter: 'R', buttonId: 'article' },
    { row: 6, col: 8, letter: 'T', buttonId: 'article' },
    { row: 6, col: 10, letter: 'I', buttonId: 'article' },
    { row: 6, col: 12, letter: 'C', buttonId: 'article' },
    { row: 6, col: 14, letter: 'L', buttonId: 'article' },
    { row: 6, col: 16, letter: 'E', buttonId: 'article' },
    
    // SEND MAIL - Moved to bottom and spread out
    { row: 8, col: 4, letter: 'S', buttonId: 'call' },
    { row: 8, col: 6, letter: 'E', buttonId: 'call' },
    { row: 8, col: 8, letter: 'N', buttonId: 'call' },
    { row: 8, col: 10, letter: 'D', buttonId: 'call' },
    { row: 9, col: 4, letter: 'M', buttonId: 'call' },
    { row: 9, col: 6, letter: 'A', buttonId: 'call' },
    { row: 9, col: 8, letter: 'I', buttonId: 'call' },
    { row: 9, col: 10, letter: 'L', buttonId: 'call' },
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
      
      // Start the animation sequence
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
            }, 500); // Time for the box to close
          }, 1000); // Time for letters to enter the box
        }, 500); // Wait for letters to reach the box
      }, 1000); // Time for box to open and letters to float
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

  // Calculate the total progress (25% per phrase)
  const calculateProgress = () => {
    const totalPhrases = navButtons.length;
    const unlockedCount = unlockedButtons.size;
    return (unlockedCount / totalPhrases) * 100;
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      {/* Background Grid */}
      <div className="cyber-grid">
        {grid.map((row, i) => (
          <div key={i} className="flex justify-center gap-4">
            {row.map((cell, j) => {
              const position = letterPositions.find(pos => pos.row === i && pos.col === j);
              const isLetter = !!position;
              const isHighlighted = position && (
                hoveredLetter === position.buttonId || 
                (hoveredButton === position.buttonId && unlockedButtons.has(position.buttonId))
              );
              
              return (
                <span
                  id={`cell-${i}-${j}`}
                  key={`${i}-${j}`}
                  className={`${
                    isLetter 
                      ? `text-cyber-blue cursor-pointer ${isHighlighted ? 'bg-cyber-blue/30' : 'hover:bg-cyber-blue/20'}`
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

      {/* Floating Letters */}
      {floatingLetters.map((item, index) => (
        <div
          key={index}
          className="floating-letters"
          style={item.style}
        >
          {item.letter}
        </div>
      ))}

      {/* Scan Line Effect */}
      <div className="scan-line animate-scanline" />
      
      {/* Header with Progress Bar */}
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-cyber-blue/20">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold animate-glow">Anita K.</h1>
          <span className="text-sm opacity-50">FOUNDING GROWTH LEAD</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-48 bg-cyber-blue/20 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyber-blue transition-all duration-1000 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className="rounded-full border border-cyber-blue p-2 animate-glow">
            <span className="text-sm">ANITA</span>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <main className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <div className="grid grid-cols-4 gap-4 p-4">
          {navButtons.map((button) => (
            <div key={button.id} className="flex flex-col space-y-2 relative">
              {showLetters === button.id && foundLetters[button.id] && (
                <div className="floating-letters">
                  {foundLetters[button.id].join('')}
                </div>
              )}
              <a 
                href={unlockedButtons.has(button.id) ? button.link : '#'}
                target={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "_blank" : undefined}
                rel={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "noopener noreferrer" : undefined}
                className={`cyber-button relative ${
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
