import { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import ImageSelector from "@/components/ImageSelector";
import GameStats from "@/components/GameStats";
import WinModal from "@/components/WinModal";
import ImageCropModal from "@/components/ImageCropModal";
import { usePuzzleGame } from "@/hooks/use-puzzle-game";
import { Puzzle } from "lucide-react";

export default function Game() {
  const {
    gameState,
    moveCount,
    timeElapsed,
    currentImage,
    isWon,
    moveTile,
    shufflePuzzle,
    resetGame,
    autoSolve,
    setCurrentImage,
    updateDifficulty,
    saveGame,
  } = usePuzzleGame();

  const [showWinModal, setShowWinModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageFile, setCropImageFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("3x3");
  const [hintsEnabled, setHintsEnabled] = useState(false);

  // Handle win state
  useEffect(() => {
    if (isWon && !showWinModal) {
      setShowWinModal(true);
      saveGame();
    }
  }, [isWon, showWinModal, saveGame]);

  const handleImageUpload = (file: File) => {
    setCropImageFile(file);
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setCurrentImage(croppedImageUrl);
    setShowCropModal(false);
    setCropImageFile(null);
    // Reset the puzzle when image changes
    resetGame();
  };

  return (
    <div className="bg-slate-50 font-inter min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Puzzle className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Sliding Puzzle</h1>
                <p className="text-sm text-slate-600">Challenge your mind with this classic game</p>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <GameStats 
                moveCount={moveCount}
                timeElapsed={timeElapsed}
                bestScore={null}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <GameBoard
              gameState={gameState}
              currentImage={currentImage}
              isWon={isWon}
              onTileClick={moveTile}
              onShuffle={shufflePuzzle}
              onReset={autoSolve} // Auto-solve function - sets to solved state
              onResetGame={resetGame} // Reset function - back to initial state
              hintsEnabled={hintsEnabled}
            />
            
            {/* Mobile Stats */}
            <div className="sm:hidden bg-white rounded-2xl shadow-lg p-4 mt-6">
              <GameStats 
                moveCount={moveCount}
                timeElapsed={timeElapsed}
                bestScore={null}
                mobile
              />
            </div>
          </div>

          {/* Image Selector */}
          <div>
            <ImageSelector
              currentImage={currentImage}
              onImageSelect={setCurrentImage}
              onImageUpload={handleImageUpload}
              difficulty={difficulty}
              onDifficultyChange={(newDifficulty) => {
                setDifficulty(newDifficulty);
                updateDifficulty(newDifficulty);
              }}
              hintsEnabled={hintsEnabled}
              onHintsToggle={setHintsEnabled}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <WinModal
        isOpen={showWinModal}
        onClose={() => setShowWinModal(false)}
        moves={moveCount}
        time={timeElapsed}
        onPlayAgain={() => {
          setShowWinModal(false);
          shufflePuzzle();
        }}
      />

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageFile={cropImageFile}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
