import { Dialog } from '@/components/ui/dialog';
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Modal {
  id: string;
  isOpen: boolean;
  content: ReactNode;
}

interface DialogContextType {
  modals: Modal[];
  openModal: (id: string, content: ReactNode) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);
