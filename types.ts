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

export type HeadType = {
  id: string;
  eventName: string;
  name: string;
  phoneNumber: string;
  image: string;
};

export type UserType = {
  name: string;
  id: string;
  branch: string;
  year: string;
  image: string;
};
