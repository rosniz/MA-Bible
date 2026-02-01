import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
  spiritual?: boolean;
}

export const Loader = ({ text, spiritual = false }: LoaderProps) => {
  if (spiritual) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-primary mb-4"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 font-verse italic">
          {text || 'Méditation en cours...'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      {text && <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};
