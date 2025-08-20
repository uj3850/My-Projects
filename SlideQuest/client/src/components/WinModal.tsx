import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  moves: number;
  time: number;
  onPlayAgain: () => void;
}

export default function WinModal({ isOpen, onClose, moves, time, onPlayAgain }: WinModalProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 text-center">
        <DialogTitle className="sr-only">Puzzle Completed</DialogTitle>
        <DialogDescription className="sr-only">
          Congratulations! You have successfully solved the sliding puzzle.
        </DialogDescription>
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Congratulations!</h2>
          <p className="text-slate-600">
            You solved the puzzle in{' '}
            <span className="font-semibold text-emerald-600">{moves} moves</span> and{' '}
            <span className="font-semibold text-emerald-600">{formatTime(time)}</span>
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Play Again
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
