import { useState, useCallback } from "react";

export type ModalActionType = string | null;

interface ModalState<T = null> {
  type: ModalActionType;
  isOpen: boolean;
  data?: T;
}

export function useModal<T = null>() {
  const [modal, setModal] = useState<ModalState<T>>({
    type: null,
    isOpen: false,
  });

  const openModal = useCallback((type: ModalActionType, data?: T) => {
    setModal({ type, isOpen: true, data });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, isOpen: false, data: undefined });
  }, []);

  return { modal, openModal, closeModal };
}
