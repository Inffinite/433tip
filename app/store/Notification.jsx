import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
    isNotificationOn: false,
    openNotification: false,
    toggleNotification: () => set((state) => ({ openNotification: !state.openNotification })),
    toggleNotificationOn: () => set((state) => ({ isNotificationOn: !state.isNotificationOn })),

}));

