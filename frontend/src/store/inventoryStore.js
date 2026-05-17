import create from 'zustand';

const useInventoryStore = create((set) => ({
  inventory: [],
  analytics: null,
  isLoading: false,

  setInventory: (inventory) => set({ inventory }),
  setAnalytics: (analytics) => set({ analytics }),
  setIsLoading: (isLoading) => set({ isLoading })
}));

export default useInventoryStore;
