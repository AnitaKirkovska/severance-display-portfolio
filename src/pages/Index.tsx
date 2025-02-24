
import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import MusicToggle from '../components/MusicToggle';
import { ChevronDown } from 'lucide-react';
import Welcome from '../components/Welcome';
import CompletionPopup from '../components/CompletionPopup';

interface LetterPosition {
  row: number;
  col: number;
  letter: string;
  buttonId: string;
}

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
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
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
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
      id: 'project', 
      label: 'LATEST PROJECT', 
      link: 'https://www.vellum.ai/reasoning-models' 
    },
    { 
      id: 'video', 
      label: 'LATEST VIDEO', 
      link: 'https://www.youtube.com/watch?v=U3MVU6JpocU' 
    },
    { 
      id: 'call', 
      label: 'BOOK CALL', 
      link: 'https://calendly.com/anita-vellum/book-a-call' 
    },
  ];

  const letterPositions: LetterPosition[] = [
    { row: 2, col: 2, letter: 'A', buttonId: 'about' },
    { row: 2, col: 3, letter: 'B', buttonId: 'about' },
    { row: 2, col: 4, letter: 'O', buttonId: 'about' },
    { row: 2, col: 5, letter: 'U', buttonId: 'about' },
    { row: 2, col: 6, letter: 'T', buttonId: 'about' },
    { row: 2, col: 7, letter: 'M', buttonId: 'about' },
    { row: 2, col: 8, letter: 'E', buttonId: 'about' },
    
    { row: 12, col: 3, letter: 'L', buttonId: 'linkedin' },
    { row: 12, col: 4, letter: 'I', buttonId: 'linkedin' },
    { row: 12, col: 5, letter: 'N', buttonId: 'linkedin' },
    { row: 12, col: 6, letter: 'K', buttonId: 'linkedin' },
    { row: 13, col: 3, letter: 'E', buttonId: 'linkedin' },
    { row: 13, col: 4, letter: 'D', buttonId: 'linkedin' },
    { row: 13, col: 5, letter: 'I', buttonId: 'linkedin' },
    { row: 13, col: 6, letter: 'N', buttonId: 'linkedin' },
    
    { row: 18, col: 2, letter: 'A', buttonId: 'article' },
    { row: 18, col: 3, letter: 'R', buttonId: 'article' },
    { row: 18, col: 4, letter: 'T', buttonId: 'article' },
    { row: 18, col: 5, letter: 'I', buttonId: 'article' },
    { row: 18, col: 6, letter: 'C', buttonId: 'article' },
    { row: 18, col: 7, letter: 'L', buttonId: 'article' },
    { row: 18, col: 8, letter: 'E', buttonId: 'article' },
    
    { row: 23, col: 2, letter: 'P', buttonId: 'project' },
    { row: 23, col: 3, letter: 'R', buttonId: 'project' },
    { row: 23, col: 4, letter: 'O', buttonId: 'project' },
    { row: 23, col: 5, letter: 'J', buttonId: 'project' },
    { row: 23, col: 6, letter: 'E', buttonId: 'project' },
    { row: 23, col: 7, letter: 'C', buttonId: 'project' },
    { row: 23, col: 8, letter: 'T', buttonId: 'project' },
    
    { row: 26, col: 2, letter: 'V', buttonId: 'video' },
    { row: 26, col: 3, letter: 'I', buttonId: 'video' },
    { row: 26, col: 4, letter: 'D', buttonId: 'video' },
    { row: 26, col: 5, letter: 'E', buttonId: 'video' },
    { row: 26, col: 6, letter: 'O', buttonId: 'video' },
    
    { row: 28, col: 2, letter: 'B', buttonId: 'call' },
    { row: 28, col: 3, letter: 'O', buttonId: 'call' },
    { row: 28, col: 4, letter: 'O', buttonId: 'call' },
    { row: 28, col: 5, letter: 'K', buttonId: 'call' },
    { row: 29, col: 2, letter: 'C', buttonId: 'call' },
    { row: 29, col: 3, letter: 'A', buttonId: 'call' },
    { row: 29, col: 4, letter: 'L', buttonId: 'call' },
    { row: 29, col: 5, letter: 'L', buttonId: 'call' },
  ];

  useEffect(() => {
    const generateGrid = () => {
      const rows = 30;
      const cols = 20;
      const newGrid: string[][] = [];
      
      for (let i = 0; i < rows; i++) {
        const row: string[] = [];
        for (let j = 0; j < cols; j++) {
          row.push(Math.floor(Math.random() * 10).toString());
        }
        newGrid.push(row);
      }

      letterPositions.forEach(({ row, col, letter, buttonId }) => {
        const isButtonComplete = foundLetters[buttonId];
        if (!isButtonComplete && newGrid[row] && newGrid[row][col]) {
          newGrid[row][col] = letter;
        } else if (isButtonComplete && newGrid[row] && newGrid[row][col]) {
          newGrid[row][col] = ' ';
        }
      });
      
      setGrid(newGrid);
    };

    generateGrid();
  }, [foundLetters]);

  const getAnimationClass = (row: number, col: number) => {
    const sum = row + col;
    if (letterPositions.some(pos => pos.row === row && pos.col === col)) {
      return '';
    }
    return sum % 3 === 0 ? 'float-horizontal' : sum % 3 === 1 ? 'float-vertical' : '';
  };

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
            }, 300);
          }, 500);
        }, 300);
      }, 600);
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
    if (!hoveredCell) return `grid-cell ${getAnimationClass(i, j)}`;
    
    const position = letterPositions.find(pos => pos.row === i && pos.col === j);
    const isLetter = !!position;
    const isHighlighted = position && (
      hoveredLetter === position.buttonId || 
      (hoveredButton === position.buttonId && unlockedButtons.has(position.buttonId))
    );
    
    const distance = Math.sqrt(
      Math.pow(i - hoveredCell.row, 2) + 
      Math.pow(j - hoveredCell.col, 2)
    );

    let classes = `grid-cell ${getAnimationClass(i, j)}`;
    
    if (i === hoveredCell.row && j === hoveredCell.col) {
      classes += ' grid-cell-hover';
    } else if (distance <= 4) {
      if (distance <= 1.5) {
        classes += ' grid-cell-neighbor-1';
      } else if (distance <= 2.5) {
        classes += ' grid-cell-neighbor-2';
      } else {
        classes += ' grid-cell-neighbor-3';
      }
    }

    if (isLetter) {
      classes += ` text-cyber-blue cursor-pointer ${isHighlighted ? 'brightness-150' : 'hover:brightness-125'}`;
    } else {
      classes += ' text-cyber-blue/50';
    }

    return classes;
  };

  useEffect(() => {
    if (unlockedButtons.size === navButtons.length) {
      setShowConfetti(true);
      setShowCompletion(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [unlockedButtons]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isScrollable = element.scrollHeight > element.clientHeight;
    const isAtBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1;
    
    setShowScrollIndicator(isScrollable && !isAtBottom);
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      {showWelcome && <Welcome onClose={() => setShowWelcome(false)} />}
      {showCompletion && <CompletionPopup onClose={() => setShowCompletion(false)} />}
      {showConfetti && <Confetti />}
      
      <header className="fixed top-0 left-0 right-0 p-2 md:p-4 flex flex-col md:flex-row justify-between items-center border-b border-cyber-blue/20 bg-cyber-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <MusicToggle />
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold animate-glow">Hi, meet my outie Anita K.</h1>
            <span className="text-xs md:text-sm opacity-50">FOUNDING GROWTH LEAD AT VELLUM</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/2eaab830-e639-4270-ba5f-4c23f9102f0d.png"
            alt="LUMON Logo"
            className="h-8 md:h-10 w-auto animate-glow"
          />
        </div>
      </header>

      <div className="cyber-grid pt-20 pb-32 md:pb-40">
        <div 
          ref={gridRef}
          className="max-w-full overflow-y-auto h-[60vh] px-2 md:px-0 relative scroll-smooth"
          onScroll={handleScroll}
        >
          <div className="inline-block min-w-full">
            {grid.map((row, i) => (
              <div key={i} className="flex justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6">
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
        </div>
        
        {showScrollIndicator && (
          <div className="flex justify-center mt-4">
            <ChevronDown size={32} className="text-cyber-blue/70 animate-bounce pointer-events-none" />
          </div>
        )}
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
      
      <main className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full px-4 bg-cyber-black/80 backdrop-blur-md py-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 md:gap-4 max-w-6xl mx-auto">
          {navButtons.map((button) => (
            <div key={button.id} className="flex flex-col space-y-1">
              <a 
                href={unlockedButtons.has(button.id) ? button.link : '#'}
                target={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "_blank" : undefined}
                rel={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "noopener noreferrer" : undefined}
                className={`cyber-button text-center ${
                  unlockedButtons.has(button.id) ? 'unlocked' : 'locked'
                } ${animatingButton === button.id ? 'animating-box' : ''}`}
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
                    width: unlockedButtons.has(button.id) ? '100%' : '0%',
                  }}
                />
                <div className="progress-text">
                  {unlockedButtons.has(button.id) ? '100%' : '0%'}
                </div>
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
