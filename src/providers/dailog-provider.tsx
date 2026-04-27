'use client';
import { DialogContext, Modal } from '@/context/DialogContext';
import { Dialog } from '@/components/ui/dialog';

import { ReactNode, useState } from 'react';

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Modal[]>([]);

  const openModal = (id: string, content: ReactNode) => {
    setModals((prev) => {
      const exists = prev.find((modal) => modal.id === id);
      if (exists) {
        // Update existing modal
        return prev.map((modal) =>
          modal.id === id ? { ...modal, isOpen: true, content } : modal
        );
      }
      return [...prev, { id, isOpen: true, content }];
    });
  };

  // TODO: change this to remove modal from array but shouldn't effect the exisiting animation
  const closeModal = (id: string) => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.id === id ? { ...modal, isOpen: false } : modal
      )
    );
  };

  const closeAllModals = () => {
    setModals((prev) => prev.map((modal) => ({ ...modal, isOpen: false })));
  };

  return (
    <DialogContext.Provider
      value={{ modals, openModal, closeModal, closeAllModals }}
    >
      {children}
      {/* Render all modals */}
      {modals.map((modal) => (
        <Dialog
          key={modal.id}
          open={modal.isOpen}
          onOpenChange={(open) => {
            if (!open) closeModal(modal.id);
          }}
        >
          {modal.content}
        </Dialog>
      ))}
    </DialogContext.Provider>
  );
};
