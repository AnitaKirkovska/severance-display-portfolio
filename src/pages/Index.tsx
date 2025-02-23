
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
    { id: 'about', label: 'ABOUT ME', link: '#' },
    { id: 'linkedin', label: 'LINKED IN', link: '#' },
    { id: 'mail', label: 'SEND MAIL', link: '#' },
    { id: 'call', label: 'BOOK CALL', link: '#' },
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
          <h1 className="text-2xl font-bold animate-glow">Gorjan J.</h1>
          <span className="text-sm opacity-50">0% Complete</span>
        </div>
        <div className="rounded-full border border-cyber-blue p-2 animate-glow">
          <span className="text-sm">GORJAN</span>
        </div>
      </header>

      {/* Main Navigation */}
      <main className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <div className="grid grid-cols-4 gap-4 p-4">
          {navButtons.map((button) => (
            <div key={button.id} className="flex flex-col space-y-2">
              <button
                className="cyber-button"
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {button.label}
              </button>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{
                    width: hoveredButton === button.id ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
