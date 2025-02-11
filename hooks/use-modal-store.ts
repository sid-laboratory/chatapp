import { Server } from "@prisma/client";
import { create } from "zustand";
import { Channel } from "@prisma/client";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "member"
  | "channel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel";

interface ModalData {
  server?: Server;
  channel?: Channel;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
