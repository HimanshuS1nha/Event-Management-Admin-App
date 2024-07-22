import { create } from "zustand";

type SelectedEventType = {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  date?: string;
  time: string;
  location: string;
  roomNo: number;
  rules?: string[];
  HeadsAndEvents: { headId: string }[];
};

type UseSelectedEventType = {
  selectedEvent: SelectedEventType;
  setSelectedEvent: (selectedEvent: SelectedEventType) => void;
};

export const useSelectedEvent = create<UseSelectedEventType>((set) => ({
  selectedEvent: {} as never,
  setSelectedEvent: (selectedEvent) => {
    set({ selectedEvent });
  },
}));
