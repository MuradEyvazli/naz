import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, isOpen, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.25, 3));
      if (e.key === '-') setScale(s => Math.max(s - 0.25, 0.5));
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const handleReset = () => setScale(1);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

          {/* Controls - Top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <p className="text-white/70 text-sm truncate max-w-md">
              {alt}
            </p>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[90vw] max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={src}
              alt={alt}
              className="max-w-none cursor-move select-none"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
              }}
              animate={{ scale }}
              transition={{ duration: 0.2 }}
              draggable={false}
              onDoubleClick={handleReset}
            />
          </motion.div>

          {/* Controls - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Zoom out */}
            <motion.button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: scale <= 0.5 ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ZoomOut className="w-5 h-5" />
            </motion.button>

            {/* Zoom percentage */}
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm text-white/70 hover:text-white min-w-[60px] text-center transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>

            {/* Zoom in */}
            <motion.button
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: scale >= 3 ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ZoomIn className="w-5 h-5" />
            </motion.button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20 mx-1" />

            {/* Download */}
            <motion.button
              onClick={handleDownload}
              className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="İndir"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Hint */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/40 text-xs">
            ESC: Kapat • +/-: Zoom • Çift tık: Sıfırla
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy usage
export function useImageLightbox() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = (src: string, alt: string = '') => {
    setLightbox({ src, alt });
  };

  const closeLightbox = () => {
    setLightbox(null);
  };

  return {
    isOpen: lightbox !== null,
    src: lightbox?.src || '',
    alt: lightbox?.alt || '',
    openLightbox,
    closeLightbox,
  };
}
