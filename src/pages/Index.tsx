
import { useState, useEffect } from 'react';

const Index = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<string[][]>([]);

  useEffect(() => {
    // Generate random numbers for the grid
    const generateNumbers = () => {
      const rows = 12;
      const cols = 35;
      const newNumbers: string[][] = [];
      
      for (let i = 0; i < rows; i++) {
        const row: string[] = [];
        for (let j = 0; j < cols; j++) {
          row.push(Math.floor(Math.random() * 10).toString());
        }
        newNumbers.push(row);
      }
      
      setNumbers(newNumbers);
    };

    generateNumbers();
    const interval = setInterval(generateNumbers, 5000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen relative overflow-hidden animate-fadeIn">
      {/* Background Grid */}
      <div className="cyber-grid">
        {numbers.map((row, i) => (
          <div key={i} className="flex">
            {row.map((num, j) => (
              <span key={`${i}-${j}`} className="text-xs opacity-50">{num}</span>
            ))}
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
            <div key={button.id} className="flex flex-col space-y-2">
              <a 
                href={button.link}
                target={button.link.startsWith('http') ? "_blank" : undefined}
                rel={button.link.startsWith('http') ? "noopener noreferrer" : undefined}
                className="cyber-button"
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
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
              {hoveredButton === button.id && button.content && (
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
