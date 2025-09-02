import { motion } from 'framer-motion';
import type { AnimationGeneratorType } from 'framer-motion';
import { Box } from '@mui/material';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20,
  },
};
const pageTransition = {
  type: 'spring' as AnimationGeneratorType,
  stiffness: 100,
  damping: 15
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%' }}
    >
      <Box sx={{ width: '100%' }}>
        {children}
      </Box>
    </motion.div>
  );
};
