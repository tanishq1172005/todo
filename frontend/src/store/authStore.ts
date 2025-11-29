import {create} from 'zustand'

interface User{
    id:string,
    name:string,
    email:string
}

interface AuthState{
    user:User | null,
    token:string | null

    login:(user:User,token:string)=>void
    logout:()=>void
    setToken:(token:string | null) =>void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
}));

