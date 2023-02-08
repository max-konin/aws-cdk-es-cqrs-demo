import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface UserState {
  isAuth: boolean;
  isLoading: boolean;
  setIsAuth: (isAuth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}
export const useUserStore = create<UserState>()(
  devtools((set) => ({
    isAuth: false,
    isLoading: false,
    setIsAuth: (isAuth: boolean) => set({ isAuth }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  }))
);