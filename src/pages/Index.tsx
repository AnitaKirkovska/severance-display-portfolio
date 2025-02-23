
import { useState, useEffect } from 'react';

interface LetterPosition {
  row: number;
  col: number;
  letter: string;
  buttonId: string;
}

const Index = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundLetters, setFoundLetters] = useState<{ [key: string]: string[] }>({});
  const [unlockedButtons, setUnlockedButtons] = useState<Set<string>>(new Set());

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
    // ABOUT ME
    { row: 2, col: 3, letter: 'A', buttonId: 'about' },
    { row: 4, col: 7, letter: 'B', buttonId: 'about' },
    { row: 1, col: 12, letter: 'O', buttonId: 'about' },
    { row: 6, col: 15, letter: 'U', buttonId: 'about' },
    { row: 3, col: 20, letter: 'T', buttonId: 'about' },
    { row: 5, col: 25, letter: 'M', buttonId: 'about' },
    { row: 7, col: 30, letter: 'E', buttonId: 'about' },
    // LINKED IN
    { row: 8, col: 5, letter: 'L', buttonId: 'linkedin' },
    { row: 9, col: 10, letter: 'I', buttonId: 'linkedin' },
    { row: 7, col: 15, letter: 'N', buttonId: 'linkedin' },
    { row: 6, col: 20, letter: 'K', buttonId: 'linkedin' },
    { row: 5, col: 25, letter: 'E', buttonId: 'linkedin' },
    { row: 4, col: 30, letter: 'D', buttonId: 'linkedin' },
    // ARTICLE
    { row: 10, col: 3, letter: 'A', buttonId: 'article' },
    { row: 9, col: 8, letter: 'R', buttonId: 'article' },
    { row: 8, col: 13, letter: 'T', buttonId: 'article' },
    { row: 7, col: 18, letter: 'I', buttonId: 'article' },
    { row: 6, col: 23, letter: 'C', buttonId: 'article' },
    { row: 5, col: 28, letter: 'L', buttonId: 'article' },
    { row: 4, col: 33, letter: 'E', buttonId: 'article' },
    // CALL
    { row: 11, col: 5, letter: 'C', buttonId: 'call' },
    { row: 10, col: 10, letter: 'A', buttonId: 'call' },
    { row: 9, col: 15, letter: 'L', buttonId: 'call' },
    { row: 8, col: 20, letter: 'L', buttonId: 'call' },
  ];

  useEffect(() => {
    const generateGrid = () => {
      const rows = 12;
      const cols = 35;
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
      const { letter, buttonId } = clickedPosition;
      const currentFoundLetters = foundLetters[buttonId] || [];
      
      if (!currentFoundLetters.includes(letter)) {
        const updatedFoundLetters = {
          ...foundLetters,
          [buttonId]: [...currentFoundLetters, letter].sort()
        };
        setFoundLetters(updatedFoundLetters);

        // Check if all letters for this button have been found
        const allLettersForButton = letterPositions
          .filter(pos => pos.buttonId === buttonId)
          .map(pos => pos.letter)
          .sort();

        if (updatedFoundLetters[buttonId].join('') === allLettersForButton.join('')) {
          setUnlockedButtons(prev => new Set([...prev, buttonId]));
        }
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      {/* Background Grid */}
      <div className="cyber-grid">
        {grid.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((cell, j) => {
              const isLetter = letterPositions.some(pos => pos.row === i && pos.col === j);
              return (
                <span
                  key={`${i}-${j}`}
                  className={`${
                    isLetter 
                      ? 'text-cyber-blue cursor-pointer hover:bg-cyber-blue/20' 
                      : 'text-cyber-blue/30'
                  }`}
                  onClick={() => handleCellClick(i, j)}
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
              {foundLetters[button.id] && foundLetters[button.id].length > 0 && (
                <div className="absolute -top-12 left-0 w-full p-2 bg-cyber-black/90 border border-cyber-blue rounded text-xs">
                  {foundLetters[button.id].join('')}
                </div>
              )}
              <a 
                href={unlockedButtons.has(button.id) ? button.link : '#'}
                target={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "_blank" : undefined}
                rel={button.link.startsWith('http') && unlockedButtons.has(button.id) ? "noopener noreferrer" : undefined}
                className={`cyber-button ${!unlockedButtons.has(button.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={(e) => !unlockedButtons.has(button.id) && e.preventDefault()}
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
