// hooks/useModal.ts
import { useState, useCallback } from "react";

export type ModalType = "delete" | "newSubmission" | "edit" | "view" | "archive" | "censorship" | null;

interface ModalState<T = null> {
  type: ModalType;
  isOpen: boolean;
  data?: T;
}

export function useModal<T = null>() {
  const [modal, setModal] = useState<ModalState<T>>({ type: null, isOpen: false });

  const openModal = useCallback((type: ModalType, data?: T) => {
    setModal({ type, isOpen: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, isOpen: false, data: undefined });
  }, []);

  return { modal, openModal, closeModal };
}
