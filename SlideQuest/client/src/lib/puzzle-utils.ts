import type { PuzzleTile } from "@shared/schema";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createInitialTiles(difficulty: string) {
  const gridSize = parseInt(difficulty.charAt(0)); // Extract number from "3x3", "4x4", "5x5"
  const totalTiles = gridSize * gridSize;
  
  const tiles = [];
  // Create numbered tiles
  for (let i = 1; i < totalTiles; i++) {
    tiles.push({ id: i, position: i - 1, isEmpty: false });
  }
  // Add empty tile at the end
  tiles.push({ id: 0, position: totalTiles - 1, isEmpty: true });
  
  return tiles;
}

export function isSolvable(puzzle: number[]): boolean {
  // Count inversions in the puzzle
  let inversions = 0;
  const flatPuzzle = puzzle.filter(x => x !== 0); // Remove empty space
  
  for (let i = 0; i < flatPuzzle.length - 1; i++) {
    for (let j = i + 1; j < flatPuzzle.length; j++) {
      if (flatPuzzle[i] > flatPuzzle[j]) {
        inversions++;
      }
    }
  }
  
  // For 3x3 grid, puzzle is solvable if inversions are even
  return inversions % 2 === 0;
}

export function isSolved(tiles: PuzzleTile[], gridSize?: number): boolean {
  // Determine grid size from tiles length if not provided
  if (!gridSize) {
    const totalTiles = tiles.length;
    gridSize = Math.sqrt(totalTiles);
  }
  
  const lastPosition = (gridSize * gridSize) - 1;
  
  // Check if all tiles are in correct position
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles.find(t => t.position === i);
    if (!tile) return false;
    
    // Empty space should be at last position
    if (tile.isEmpty && i !== lastPosition) return false;
    
    // Non-empty tiles should have id matching position + 1
    if (!tile.isEmpty && tile.id !== i + 1) return false;
  }
  
  return true;
}

export function getTilePosition(tileId: number, gridSize = 3): { row: number; col: number } {
  const position = tileId - 1; // Convert 1-based to 0-based
  return {
    row: Math.floor(position / gridSize),
    col: position % gridSize,
  };
}

export function getAdjacentPositions(position: number, gridSize = 3): number[] {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const adjacent: number[] = [];
  
  // Up
  if (row > 0) adjacent.push((row - 1) * gridSize + col);
  // Down
  if (row < gridSize - 1) adjacent.push((row + 1) * gridSize + col);
  // Left
  if (col > 0) adjacent.push(row * gridSize + (col - 1));
  // Right
  if (col < gridSize - 1) adjacent.push(row * gridSize + (col + 1));
  
  return adjacent;
}
