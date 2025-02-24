
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

  // Adding decorative letters positions within each circle
  const decorativeLetters: LetterPosition[] = [
    // ABOUT ME inner circle
    { row: 4, col: 5, letter: 'X', buttonId: 'none' },
    { row: 4, col: 6, letter: 'Y', buttonId: 'none' },
    { row: 5, col: 6, letter: 'Z', buttonId: 'none' },
    { row: 5, col: 5, letter: 'W', buttonId: 'none' },
    
    // LINKEDIN inner circle
    { row: 4, col: 23, letter: 'P', buttonId: 'none' },
    { row: 4, col: 24, letter: 'Q', buttonId: 'none' },
    { row: 5, col: 24, letter: 'R', buttonId: 'none' },
    { row: 5, col: 23, letter: 'S', buttonId: 'none' },
    
    // ARTICLE inner circle
    { row: 13, col: 5, letter: 'F', buttonId: 'none' },
    { row: 13, col: 6, letter: 'G', buttonId: 'none' },
    { row: 14, col: 6, letter: 'H', buttonId: 'none' },
    { row: 14, col: 5, letter: 'J', buttonId: 'none' },
    
    // PROJECT inner circle
    { row: 13, col: 23, letter: 'M', buttonId: 'none' },
    { row: 13, col: 24, letter: 'N', buttonId: 'none' },
    { row: 14, col: 24, letter: 'K', buttonId: 'none' },
    { row: 14, col: 23, letter: 'L', buttonId: 'none' },
    
    // VIDEO inner circle
    { row: 22, col: 5, letter: 'A', buttonId: 'none' },
    { row: 22, col: 6, letter: 'B', buttonId: 'none' },
    
    // BOOK CALL inner circle
    { row: 22, col: 23, letter: 'X', buttonId: 'none' },
    { row: 22, col: 24, letter: 'Y', buttonId: 'none' },
    { row: 23, col: 24, letter: 'Z', buttonId: 'none' },
    { row: 23, col: 23, letter: 'W', buttonId: 'none' },
  ];

  const letterPositions: LetterPosition[] = [
    // ABOUT ME - moved O, U, T inside
    { row: 4, col: 4, letter: 'A', buttonId: 'about' },
    { row: 3, col: 5, letter: 'B', buttonId: 'about' },
    { row: 4, col: 5, letter: 'O', buttonId: 'about' },    // Moved inside
    { row: 4, col: 6, letter: 'U', buttonId: 'about' },    // Moved inside
    { row: 5, col: 6, letter: 'T', buttonId: 'about' },    // Moved inside
    { row: 6, col: 6, letter: 'M', buttonId: 'about' },
    { row: 6, col: 5, letter: 'E', buttonId: 'about' },
    
    // LINKEDIN - moved K, E, D inside
    { row: 4, col: 22, letter: 'L', buttonId: 'linkedin' },
    { row: 3, col: 23, letter: 'I', buttonId: 'linkedin' },
    { row: 3, col: 24, letter: 'N', buttonId: 'linkedin' },
    { row: 4, col: 24, letter: 'K', buttonId: 'linkedin' }, // Moved inside
    { row: 5, col: 24, letter: 'E', buttonId: 'linkedin' }, // Moved inside
    { row: 5, col: 23, letter: 'D', buttonId: 'linkedin' }, // Moved inside
    { row: 6, col: 24, letter: 'I', buttonId: 'linkedin' },
    { row: 5, col: 22, letter: 'N', buttonId: 'linkedin' },
    
    // ARTICLE - moved I, C, L inside
    { row: 13, col: 4, letter: 'A', buttonId: 'article' },
    { row: 12, col: 5, letter: 'R', buttonId: 'article' },
    { row: 12, col: 6, letter: 'T', buttonId: 'article' },
    { row: 13, col: 6, letter: 'I', buttonId: 'article' },  // Moved inside
    { row: 14, col: 6, letter: 'C', buttonId: 'article' },  // Moved inside
    { row: 14, col: 5, letter: 'L', buttonId: 'article' },  // Moved inside
    { row: 15, col: 5, letter: 'E', buttonId: 'article' },
    
    // PROJECT - moved O, J, E inside
    { row: 13, col: 22, letter: 'P', buttonId: 'project' },
    { row: 12, col: 23, letter: 'R', buttonId: 'project' },
    { row: 13, col: 23, letter: 'O', buttonId: 'project' }, // Moved inside
    { row: 13, col: 24, letter: 'J', buttonId: 'project' }, // Moved inside
    { row: 14, col: 24, letter: 'E', buttonId: 'project' }, // Moved inside
    { row: 15, col: 24, letter: 'C', buttonId: 'project' },
    { row: 15, col: 23, letter: 'T', buttonId: 'project' },
    
    // VIDEO - moved I, D inside
    { row: 22, col: 4, letter: 'V', buttonId: 'video' },
    { row: 22, col: 5, letter: 'I', buttonId: 'video' },    // Moved inside
    { row: 22, col: 6, letter: 'D', buttonId: 'video' },    // Moved inside
    { row: 23, col: 6, letter: 'E', buttonId: 'video' },
    { row: 23, col: 5, letter: 'O', buttonId: 'video' },
    
    // BOOK CALL - moved O, O, K inside
    { row: 22, col: 22, letter: 'B', buttonId: 'call' },
    { row: 22, col: 23, letter: 'O', buttonId: 'call' },    // Moved inside
    { row: 22, col: 24, letter: 'O', buttonId: 'call' },    // Moved inside
    { row: 23, col: 24, letter: 'K', buttonId: 'call' },    // Moved inside
    { row: 24, col: 24, letter: 'C', buttonId: 'call' },
    { row: 24, col: 23, letter: 'A', buttonId: 'call' },
    { row: 23, col: 22, letter: 'L', buttonId: 'call' },
  ];

  // We no longer need the decorativeLetters array since we're using the actual phrase letters

  useEffect(() => {
    const generateGrid = () => {
      const rows = 30;
      const cols = 30;
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

  // Update handleCellClick to only work with non-decorative letters
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
    if (hoveredCell?.row !== row || hoveredCell?.col !== col) {
      const hoveredPosition = letterPositions.find(pos => pos.row === row && pos.col === col);
      setHoveredLetter(hoveredPosition ? hoveredPosition.buttonId : null);
      setHoveredCell({ row, col });
    }
  };

  const getCellClassName = (i: number, j: number) => {
    if (!hoveredCell) return `grid-cell ${getAnimationClass(i, j)} opacity-30 transition-all duration-500`;
    
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

    let classes = `grid-cell ${getAnimationClass(i, j)} transition-all duration-500`;
    
    if (i === hoveredCell.row && j === hoveredCell.col) {
      classes += ' grid-cell-hover opacity-100';
    } else if (distance <= 4) {
      if (distance <= 1.5) {
        classes += ' grid-cell-neighbor-1 opacity-90';
      } else if (distance <= 2.5) {
        classes += ' grid-cell-neighbor-2 opacity-70';
      } else {
        classes += ' grid-cell-neighbor-3 opacity-50';
      }
    } else {
      classes += ' opacity-30';
    }

    if (isLetter) {
      classes += ` text-cyber-blue cursor-pointer ${isHighlighted ? 'brightness-150' : ''}`;
    } else {
      classes += ' text-cyber-blue/50';
    }

    return classes;
  };

  const calculateCompletionPercentage = () => {
    const totalButtons = navButtons.length;
    const unlockedCount = unlockedButtons.size;
    const percentage = Math.floor((unlockedCount / totalButtons) * 100);
    return percentage === 0 ? "0" : percentage.toString().padStart(2, '0');
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
      
      <header className="fixed top-0 left-0 right-0 p-2 md:p-4 border-b border-cyber-blue/20 bg-cyber-black/80 backdrop-blur-md z-50">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-2 md:gap-4 px-4">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-1 md:gap-4">
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <MusicToggle />
              <h1 className="text-sm md:text-xl lg:text-2xl font-bold animate-glow">Hi, meet my outie Anita K.</h1>
            </div>
            <span className="text-[10px] md:text-xs lg:text-sm opacity-50">FOUNDING GROWTH LEAD AT VELLUM</span>
          </div>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <span className="font-mono text-xs md:text-sm text-cyber-blue animate-glow">
              {calculateCompletionPercentage()}% Complete
            </span>
            <img 
              src="/lovable-uploads/2eaab830-e639-4270-ba5f-4c23f9102f0d.png"
              alt="LUMON Logo"
              className="hidden md:block h-6 md:h-8 lg:h-10 w-auto animate-glow"
            />
          </div>
        </div>
      </header>

      <div className="cyber-grid pt-20 pb-32 md:pb-40">
        <div 
          ref={gridRef}
          className="max-w-screen w-full overflow-y-auto h-[60vh] px-2 md:px-0 relative scroll-smooth"
          onScroll={handleScroll}
        >
          <div className="flex flex-col items-center">
            {grid.map((row, i) => (
              <div key={i} className="flex justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
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
