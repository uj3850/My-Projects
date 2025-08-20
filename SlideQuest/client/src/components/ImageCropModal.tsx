import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, RotateCw, FlipHorizontal, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (imageUrl: string) => void;
}

export default function ImageCropModal({ isOpen, onClose, imageFile, onCropComplete }: ImageCropModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onCropComplete(data.processedPath);
      toast({
        title: "Image uploaded successfully",
        description: "Your custom image is ready to use!",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApplyCrop = async () => {
    if (!imageFile) return;
    
    setIsProcessing(true);
    try {
      await uploadMutation.mutateAsync(imageFile);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setImageUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Crop Your Image</DialogTitle>
              <DialogDescription>
                Upload and crop your image to create a custom puzzle
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="bg-slate-100 rounded-xl p-4">
            <div className="flex justify-center">
              {imageUrl ? (
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-full max-h-80 object-contain rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <p className="text-slate-600">No image selected</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Crop Controls */}
          <div className="flex justify-between items-center">
            <div className="space-x-3">
              <Button variant="ghost" size="sm" disabled>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <FlipHorizontal className="w-4 h-4 mr-2" />
                Flip H
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
            </div>
            
            <div className="space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleApplyCrop}
                disabled={!imageFile || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isProcessing ? "Processing..." : "Apply Crop"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
