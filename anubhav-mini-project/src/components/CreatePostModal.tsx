import * as React from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'motion/react';

interface CreatedPost {
  _id: string;
  image: string;
  caption: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatedPost) => void;
}

export const CreatePostModal = ({ isOpen, onClose, onSubmit }: CreatePostModalProps) => {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [caption, setCaption] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image (JPG, PNG, etc.).');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('caption', caption);

      const res = await fetch('/create-post', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.post) {
        onSubmit(data.post);
        setImageFile(null);
        setImagePreview(null);
        setCaption('');
        onClose();
      } else {
        setError(data.message || data.error || 'Failed to create post');
      }
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 p-4">
              <h3 className="text-lg font-bold text-zinc-900">Create New Post</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <p className="text-sm text-red-500 mb-2">{error}</p>
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-all hover:border-zinc-400 hover:bg-zinc-100"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <>
                    <div className="rounded-full bg-white p-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-zinc-500">
                      Click to upload JPG image
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Maximum file size: 5MB
                    </p>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="Caption"
                  placeholder="Write a thoughtful caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isSubmitting}
                  disabled={!imageFile}
                >
                  Post Inspiration
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
