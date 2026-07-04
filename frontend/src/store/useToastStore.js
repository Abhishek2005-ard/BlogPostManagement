import { create } from 'zustand';

const useToastStore = create((set) => ({
  toast: null,
  showToast: (message, type = 'success') => {
    const id = Date.now();
    set({ toast: { message, type, id } });
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : {}));
    }, 4000);
  },
  hideToast: () => set({ toast: null }),
}));

export default useToastStore;
