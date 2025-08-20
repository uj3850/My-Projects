import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { Images, CloudUpload, Settings, History } from "lucide-react";
import { useState } from "react";
import type { PresetImage, GameHistory } from "@shared/schema";

interface ImageSelectorProps {
  currentImage: string;
  onImageSelect: (imageUrl: string) => void;
  onImageUpload: (file: File) => void;
}

interface ExtendedImageSelectorProps extends ImageSelectorProps {
  difficulty?: string;
  onDifficultyChange?: (difficulty: string) => void;
  hintsEnabled?: boolean;
  onHintsToggle?: (enabled: boolean) => void;
}

export default function ImageSelector({
  currentImage,
  onImageSelect,
  onImageUpload,
  difficulty: externalDifficulty,
  onDifficultyChange,
  hintsEnabled: externalHintsEnabled,
  onHintsToggle,
}: ExtendedImageSelectorProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Fetch preset images
  const { data: presetImages = [] } = useQuery<PresetImage[]>({
    queryKey: ["/api/preset-images"],
  });

  // Fetch game history
  const { data: gameHistory = [] } = useQuery<GameHistory[]>({
    queryKey: ["/api/game-history"],
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Image Selection Card */}
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Images className="w-5 h-5 mr-2 text-blue-500" />
            Choose Puzzle Image
          </h3>

          {/* Custom Upload Area */}
          <div className="mb-6">
            <label className="block">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer group">
                <div className="text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                  <CloudUpload className="w-8 h-8 mx-auto mb-3" />
                  <p className="font-medium">Upload Custom Image</p>
                  <p className="text-sm">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Preset Images */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Or choose from presets:</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {presetImages.map((image) => (
                <Button
                  key={image.id}
                  variant="ghost"
                  className={`group relative overflow-hidden rounded-lg border-2 p-0 h-auto transition-all duration-200 ${
                    currentImage === image.url 
                      ? 'border-blue-500' 
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                  onClick={() => onImageSelect(image.url)}
                >
                  <img
                    src={image.thumbnail}
                    alt={image.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium">{image.name}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings Card */}
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-500" />
            Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <Select value={externalDifficulty} onValueChange={onDifficultyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3x3">3×3 (Easy)</SelectItem>
                  <SelectItem value="4x4">4×4 (Medium)</SelectItem>
                  <SelectItem value="5x5">5×5 (Hard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Sound Effects</label>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Show Hints</label>
              <Switch
                checked={externalHintsEnabled}
                onCheckedChange={onHintsToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game History Card */}
      <Card className="bg-white rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-500" />
            Recent Games
          </h3>
          
          <div className="space-y-3">
            {gameHistory.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No games played yet</p>
            ) : (
              gameHistory.slice(0, 3).map((game) => (
                <div key={game.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <History className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{game.imageName}</p>
                      <p className="text-xs text-slate-500">{game.completedAt ? formatTimeAgo(game.completedAt) : 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{game.moves} moves</p>
                    <p className="text-xs text-slate-500">{formatTime(game.timeElapsed)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
