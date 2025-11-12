import React, { useEffect, useMemo, useRef, useState } from "react";
import { ClusterSearchData } from '../../types';

type Tile = {
  id: string;
  letter: string;
  isTarget: boolean;
};

interface ClusterSearchGameProps {
  gameData: ClusterSearchData;
  onComplete: (score: number) => void;
  onExit: () => void;
}

const ClusterSearchGame: React.FC<ClusterSearchGameProps> = ({
  gameData,
  onComplete,
  onExit,
}) => {
  const { promptEnglish, targetLetter, distractorLetters } = gameData;
  const gridSize = gameData.gridSize || 16;
  
  const maxTime = 10;
  const bonusWindow = 1;
  const maxPoints = 100;

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(maxTime);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: boolean } | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const computeScore = (elapsed: number) => {
    if (elapsed <= bonusWindow) return maxPoints;
    return Math.round(maxPoints * Math.max(0, 1 - elapsed / maxTime));
  };

  useEffect(() => {
    const generateTiles = () => {
      const allDistractors = [...distractorLetters];
      for (let i = allDistractors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allDistractors[i], allDistractors[j]] = [allDistractors[j], allDistractors[i]];
      }

      const chosenTiles: Tile[] = [];
      const targetIndex = Math.floor(Math.random() * gridSize);
      
      let distractorIdx = 0;
      for (let i = 0; i < gridSize; i++) {
        if (i === targetIndex) {
          chosenTiles.push({ id: `t-${i}`, letter: targetLetter, isTarget: true });
        } else {
          let letter = allDistractors[distractorIdx % allDistractors.length];
          // Avoid duplicate target if it's also in the distractors list
          if (letter === targetLetter) {
            distractorIdx++;
            letter = allDistractors[distractorIdx % allDistractors.length];
          }
          chosenTiles.push({ id: `t-${i}`, letter, isTarget: false });
          distractorIdx++;
        }
      }
      return chosenTiles;
    };

    setTiles(generateTiles());
    setTimeLeft(maxTime);
    setResult(null);
    setIsRunning(true);
    startTimeRef.current = performance.now();
  }, [promptEnglish, targetLetter, distractorLetters, gridSize]);

  useEffect(() => {
    if (!isRunning) {
        if(timerRef.current) clearInterval(timerRef.current);
        return;
    };
    
    timerRef.current = window.setInterval(() => {
      const start = startTimeRef.current ?? performance.now();
      const elapsedSec = (performance.now() - start) / 1000;
      const remaining = Math.max(0, maxTime - elapsedSec);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setResult({ score: 0, correct: false });
        setTimeout(() => onComplete(0), 1500);
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, maxTime, onComplete]);

  const handleSelect = (tile: Tile) => {
    if (!isRunning) return;
    
    const elapsed = (performance.now() - (startTimeRef.current ?? performance.now())) / 1000;
    const score = tile.isTarget ? computeScore(elapsed) : 0;
    
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    setResult({ score, correct: tile.isTarget });
    setTimeout(() => onComplete(score), 1500);
  };

  const tileClass = (tile: Tile) => {
    let baseClass = "border p-3 text-3xl font-semibold rounded-lg transition-all duration-300 flex items-center justify-center aspect-square";
    if (!result) return `${baseClass} bg-white border-slate-300 cursor-pointer hover:bg-sky-50 hover:border-sky-400`;
    
    if (tile.isTarget) return `${baseClass} bg-green-200 border-green-400 scale-105`;
    if (!result.correct && result.score === 0) return `${baseClass} bg-slate-100 border-slate-200 opacity-60`; // Fade out non-targets on failure
    
    return `${baseClass} bg-white border-slate-300 opacity-70`;
  };

  return (
    <div className="max-w-xl mx-auto w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg flex flex-col space-y-6">
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-900">Cluster Search</h2>
            <button onClick={onExit} className="text-slate-400 hover:text-slate-800 text-2xl">&times;</button>
        </div>
      
        <div className="relative w-full bg-slate-200 rounded-full h-2.5">
            <div 
                className="bg-sky-600 h-2.5 rounded-full transition-all duration-100" 
                style={{width: `${(timeLeft / maxTime) * 100}%`}}>
            </div>
        </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Find:</div>
          <div className="text-2xl font-bold text-slate-800">{promptEnglish}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Time left</div>
          <div className="text-2xl font-mono font-bold text-sky-600">{timeLeft.toFixed(2)}s</div>
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.sqrt(gridSize)}, minmax(0,1fr))` }}
      >
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => handleSelect(tile)}
            className={tileClass(tile)}
            aria-label={`Letter ${tile.letter}`}
            disabled={!isRunning}
          >
            {tile.letter}
          </button>
        ))}
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-lg border text-center font-bold animate-fade-in-up ${result.correct ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
          {result.correct ? (
            <div>Correct! You earned {result.score} points!</div>
          ) : (
            <div>Time's up or wrong answer. The correct tile is highlighted.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClusterSearchGame;