import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, RotateCcw, Lightbulb, Trophy } from "lucide-react";
import type { GameState } from "@shared/schema";

interface GameBoardProps {
  gameState: GameState;
  currentImage: string;
  isWon: boolean;
  onTileClick: (tileId: number) => void;
  onShuffle: () => void;
  onReset: () => void;
  onResetGame: () => void;
  hintsEnabled?: boolean;
}

export default function GameBoard({
  gameState,
  currentImage,
  isWon,
  onTileClick,
  onShuffle,
  onReset,
  onResetGame,
  hintsEnabled = false,
}: GameBoardProps) {
  
  const handleReset = () => {
    // Reset to initial unsolved state (cleared/shuffled)
    onResetGame();
  };

  const getTileStyle = (tileId: number) => {
    if (tileId === 0) return {}; // Empty tile
    
    const gridSize = parseInt(gameState.difficulty.charAt(0));
    const row = Math.floor((tileId - 1) / gridSize);
    const col = (tileId - 1) % gridSize;
    
    // Background position calculation for different grid sizes
    const bgPosX = gridSize === 3 ? col * 50 : 
                   gridSize === 4 ? col * (100/3) : 
                   col * 25; // 5x5 grid
    const bgPosY = gridSize === 3 ? row * 50 : 
                   gridSize === 4 ? row * (100/3) : 
                   row * 25; // 5x5 grid
    
    const backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
    
    return {
      backgroundImage: `url(${currentImage})`,
      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      backgroundSize,
      backgroundRepeat: 'no-repeat',
    };
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Game Board</h2>
          {isWon && (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <Trophy className="w-3 h-3 mr-1" />
              Solved!
            </Badge>
          )}
        </div>

        {/* Puzzle Grid */}
        <div className="flex justify-center">
          <div className="relative">
            <div 
              className="bg-slate-100 rounded-xl relative overflow-hidden" 
              style={{ 
                width: gameState.difficulty === '3x3' ? '288px' : 
                       gameState.difficulty === '4x4' ? '384px' : '480px',
                height: gameState.difficulty === '3x3' ? '288px' : 
                        gameState.difficulty === '4x4' ? '384px' : '480px'
              }}
            >
              {gameState.tiles.map((tile) => {
                const gridSize = parseInt(gameState.difficulty.charAt(0));
                const tileSize = gameState.difficulty === '3x3' ? 96 : 
                                gameState.difficulty === '4x4' ? 96 : 96;
                
                const row = Math.floor(tile.position / gridSize);
                const col = tile.position % gridSize;
                
                return (
                  <div
                    key={tile.id}
                    className={`
                      puzzle-tile absolute shadow-sm border-2 flex items-center justify-center overflow-hidden transition-all duration-300 ease-out
                      ${tile.isEmpty 
                        ? 'bg-slate-50 border-dashed border-slate-300 cursor-default empty-tile opacity-0 pointer-events-none' 
                        : 'bg-white border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-300 group'
                      }
                    `}
                    style={{
                      width: `${tileSize}px`,
                      height: `${tileSize}px`,
                      left: `${col * tileSize}px`,
                      top: `${row * tileSize}px`,
                      ...(tile.isEmpty ? {} : getTileStyle(tile.id))
                    }}
                    onClick={() => !tile.isEmpty && onTileClick(tile.id)}
                  >
                    {hintsEnabled && !tile.isEmpty && (
                      <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/70 rounded px-2 py-1 shadow z-10">
                        {tile.id}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Button
            onClick={onShuffle}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
          
          <Button
            onClick={handleReset}
            variant="secondary"
            className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={onReset}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Solve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
