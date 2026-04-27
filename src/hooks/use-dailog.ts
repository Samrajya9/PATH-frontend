import { DialogContext } from '@/context/DialogContext';
import { useContext } from 'react';

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within DialogProvider');
  }
  return context;
};
