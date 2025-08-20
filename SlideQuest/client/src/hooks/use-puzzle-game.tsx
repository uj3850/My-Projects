import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { shuffleArray, isSolvable, isSolved } from "@/lib/puzzle-utils";
import type { GameState, PuzzleTile } from "@shared/schema";
import { useSound } from "@/hooks/use-sound";

import { createInitialTiles } from "@/lib/puzzle-utils";

export function usePuzzleGame() {
  const [gameState, setGameState] = useState<GameState>({
    tiles: createInitialTiles("3x3"),
    moves: 0,
    startTime: null,
    isPlaying: false,
    isWon: false,
    currentImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    difficulty: "3x3",
  });

  const [timeElapsed, setTimeElapsed] = useState(0);
  const queryClient = useQueryClient();
  const { playMoveSound, playWinSound, playShuffleSound } = useSound();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.startTime && !gameState.isWon) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - gameState.startTime!) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, gameState.startTime, gameState.isWon]);

  // Save game mutation
  const saveGameMutation = useMutation({
    mutationFn: async (gameData: { imageName: string; moves: number; timeElapsed: number; difficulty: string }) => {
      const response = await apiRequest('POST', '/api/game-history', gameData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game-history'] });
    },
  });

  const moveTile = useCallback((tileId: number) => {
      setGameState(prev => {
      if (prev.isWon) return prev;

      const tiles = [...prev.tiles];
      const tileIndex = tiles.findIndex(t => t.id === tileId);
      const emptyIndex = tiles.findIndex(t => t.isEmpty);
      
      if (tileIndex === -1 || emptyIndex === -1) return prev;

      // Check if tile is adjacent to empty space
      const tilePos = tiles[tileIndex].position;
      const emptyPos = tiles[emptyIndex].position;
      
      const gridSize = parseInt(prev.difficulty.charAt(0));
      const tileRow = Math.floor(tilePos / gridSize);
      const tileCol = tilePos % gridSize;
      const emptyRow = Math.floor(emptyPos / gridSize);
      const emptyCol = emptyPos % gridSize;
      
      const isAdjacent = 
        (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
        (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);
      if (!isAdjacent) return prev;

      // Create new tiles array with swapped positions
      const newTiles = tiles.map(tile => {
        if (tile.id === tileId) {
          return { ...tile, position: emptyPos };
        } else if (tile.isEmpty) {
          return { ...tile, position: tilePos };
        }
        return tile;
      });

      const newMoves = prev.moves + 1;
      const startTime = prev.startTime || Date.now();
      const isWon = isSolved(newTiles, gridSize);

      // Play sound effects
      if (isWon) {
        playWinSound();
      } else {
        playMoveSound();
      }

      return {
        ...prev,
        tiles: newTiles,
        moves: newMoves,
        startTime,
        isPlaying: true,
        isWon,
      };
    });
  }, [playMoveSound, playWinSound]);

  const shufflePuzzle = useCallback(() => {
    playShuffleSound();
    
    setGameState(prev => {
      let shuffledTiles;
      do {
        shuffledTiles = shuffleArray([...createInitialTiles(prev.difficulty).map(t => ({ ...t }))]);
      } while (!isSolvable(shuffledTiles.map(t => t.id === 0 ? 0 : t.id)));

      // Update positions
      shuffledTiles.forEach((tile, index) => {
        tile.position = index;
      });

      return {
        ...prev,
        tiles: shuffledTiles,
        moves: 0,
        startTime: Date.now(),
        isPlaying: true,
        isWon: false,
      };
    });
    setTimeElapsed(0);
  }, [playShuffleSound]);

  const resetGame = useCallback(() => {
    setGameState(prev => {
      const resetTiles = createInitialTiles(prev.difficulty).map(tile => ({ ...tile }));
      return {
        ...prev,
        tiles: resetTiles,
        moves: 0,
        startTime: null,
        isPlaying: false,
        isWon: false,
      };
    });
    setTimeElapsed(0);
  }, []);

  const autoSolve = useCallback(() => {
    setGameState(prev => {
      const solvedTiles = createInitialTiles(prev.difficulty).map(tile => ({ ...tile }));
      return {
        ...prev,
        tiles: solvedTiles,
        moves: 0,
        startTime: null,
        isPlaying: false,
        isWon: true,
      };
    });
    setTimeElapsed(0);
  }, []);

  const setCurrentImage = useCallback((imageUrl: string) => {
    setGameState(prev => ({
      ...prev,
      currentImage: imageUrl,
    }));
  }, []);

  const updateDifficulty = useCallback((newDifficulty: string) => {
    const newTiles = createInitialTiles(newDifficulty);
    setGameState(prev => ({
      ...prev,
      difficulty: newDifficulty,
      tiles: newTiles,
      moves: 0,
      startTime: null,
      isPlaying: false,
      isWon: false,
    }));
    setTimeElapsed(0);
  }, []);

  const saveGame = useCallback(() => {
    if (gameState.isWon && gameState.startTime) {
      const imageName = gameState.currentImage.includes('unsplash') ? 
        'Preset Image' : 'Custom Image';
      
      saveGameMutation.mutate({
        imageName,
        moves: gameState.moves,
        timeElapsed,
        difficulty: gameState.difficulty,
      });
    }
  }, [gameState.isWon, gameState.moves, gameState.startTime, gameState.currentImage, gameState.difficulty, timeElapsed, saveGameMutation]);

  return {
    gameState,
    moveCount: gameState.moves,
    timeElapsed,
    currentImage: gameState.currentImage,
    isWon: gameState.isWon,
    moveTile,
    shufflePuzzle,
    resetGame,
    autoSolve,
    setCurrentImage,
    updateDifficulty,
    saveGame,
  };
}
