// lib/definitions.ts
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Topic = {
  id: string;
  title: string;
};

export type Question = {
  id: string;
  title: string;
  topic_id: string;
  votes: number;
  accepted_answer_id?: string | null;
};

export type Answer = {
  id: string;
  question_id: string;
  content: string;
  author?: string | undefined;
  created_at?: string | null;
  accepted?: boolean;
};
