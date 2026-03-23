import * as React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl p-4 shadow-2xl border backdrop-blur-md',
        type === 'success' 
          ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900' 
          : 'bg-red-50/90 border-red-100 text-red-900'
      )}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-emerald-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
      <p className="text-sm font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 rounded-full p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4 opacity-50" />
      </button>
    </motion.div>
  );
};
