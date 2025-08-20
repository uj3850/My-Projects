interface GameStatsProps {
  moveCount: number;
  timeElapsed: number;
  bestScore: number | null;
  mobile?: boolean;
}

export default function GameStats({ moveCount, timeElapsed, bestScore, mobile = false }: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (mobile) {
    return (
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-slate-900">{moveCount}</div>
          <div className="text-sm text-slate-500">Moves</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-slate-500">Time</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-600">{bestScore || '--'}</div>
          <div className="text-sm text-slate-500">Best</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6 text-sm">
      <div className="text-center">
        <div className="font-semibold text-slate-900">{moveCount}</div>
        <div className="text-slate-500">Moves</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-slate-900">{formatTime(timeElapsed)}</div>
        <div className="text-slate-500">Time</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-emerald-600">{bestScore || '--'}</div>
        <div className="text-slate-500">Best</div>
      </div>
    </div>
  );
}
