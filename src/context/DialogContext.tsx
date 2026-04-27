import { Dialog } from "@/components/ui/dialog";
import { createContext, useContext, useState, type ReactNode } from "react";

interface Modal {
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

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Modal[]>([]);

  console.log(modals);

  const openModal = (id: string, content: ReactNode) => {
    setModals((prev) => {
      const exists = prev.find((modal) => modal.id === id);
      if (exists) {
        // Update existing modal
        return prev.map((modal) =>
          modal.id === id ? { ...modal, isOpen: true, content } : modal,
        );
      }
      return [...prev, { id, isOpen: true, content }];
    });
  };

  // TODO: change this to remove modal from array but shouldn't effect the exisiting animation
  const closeModal = (id: string) => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.id === id ? { ...modal, isOpen: false } : modal,
      ),
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

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within DialogProvider");
  }
  return context;
};
