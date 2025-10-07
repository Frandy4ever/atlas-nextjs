"use client";

import AnswerItem from './AnswerItem';

type Answer = {
  id: string;
  question_id: string;
  content: string;
  accepted?: boolean;
  author?: string;
};

type Props = {
  answers: Answer[];
  onMarkAccepted?: (id: string) => void;
};

export default function AnswersList({ answers, onMarkAccepted }: Props) {
  // Sort: accepted answers first
  const sorted = [...answers].sort((a, b) => {
    const aAccepted = a.accepted ? 1 : 0;
    const bAccepted = b.accepted ? 1 : 0;
    return bAccepted - aAccepted;
  });

  return (
    <div className="space-y-4">
      {sorted.map((ans) => (
        <AnswerItem
          key={ans.id}
          answer={ans}
          onMarkAccepted={() => onMarkAccepted?.(ans.id)}
        />
      ))}
    </div>
  );
}
