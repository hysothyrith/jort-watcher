import create from "zustand";

interface State {
  gateId: string;
}

export const useStore = create<State>(() => ({
  gateId: "",
}));
