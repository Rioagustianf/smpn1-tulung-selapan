export interface SchoolInfo {
  _id?: string;
  title: string;
  content: string;
  type: 'announcement' | 'news' | 'event';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gallery {
  _id?: string;
  title: string;
  image: string;
  description?: string;
  createdAt: Date;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface User {
  _id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}