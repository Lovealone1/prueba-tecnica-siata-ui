import { create } from "zustand";

export type ModalType = 
  | "CREATE_CUSTOMER" | "EDIT_CUSTOMER" | "VIEW_CUSTOMER" | "DELETE_CUSTOMER"
  | "CREATE_PRODUCT" | "EDIT_PRODUCT" | "VIEW_PRODUCT"
  | "CREATE_LOGISTICS" | "EDIT_LOGISTICS"
  | null;

interface ModalStore {
  type: ModalType;
  data: any;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, data = null) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: null }),
}));
