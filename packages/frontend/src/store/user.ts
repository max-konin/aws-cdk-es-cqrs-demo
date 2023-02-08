import { create } from 'zustand';

export interface UserState {
  isAuth: boolean;
  isLoading: boolean;
  setIsAuth: (isAuth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}
export const useUserStore = create<UserState>((set) => ({
  isAuth: false,
  isLoading: false,
  setIsAuth: (isAuth: boolean) => set({ isAuth }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
