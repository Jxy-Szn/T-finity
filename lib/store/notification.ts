import { create } from "zustand";

interface NotificationState {
  unreadEmailCount: number;
  setUnreadEmailCount: (count: number) => void;
  incrementUnreadEmailCount: () => void;
  decrementUnreadEmailCount: () => void;
  resetUnreadEmailCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadEmailCount: 0,
  setUnreadEmailCount: (count) => set({ unreadEmailCount: count }),
  incrementUnreadEmailCount: () =>
    set((state) => ({ unreadEmailCount: state.unreadEmailCount + 1 })),
  decrementUnreadEmailCount: () =>
    set((state) => ({
      unreadEmailCount: Math.max(0, state.unreadEmailCount - 1),
    })),
  resetUnreadEmailCount: () => set({ unreadEmailCount: 0 }),
}));
