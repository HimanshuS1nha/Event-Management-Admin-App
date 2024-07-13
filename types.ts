export type EventType = {
  id: string;
  name: string;
  category: string;
  rules?: string[];
  date?: string;
  location: string;
  description: string;
  time: string;
  roomNo: number;
  image: string;
  HeadsAndEvents: {
    headId: string;
  }[];
};
