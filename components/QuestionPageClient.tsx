"use client";

import { useState } from "react";
import AnswersList from "./AnswersList";
import AnswerForm from "./AnswerForm";
import type { Question as QType } from "@/lib/definitions";

type Answer = {
  id: string;
  question_id: string;
  content: string;
  accepted?: boolean;
  author?: string;
};

export default function QuestionPageClient({
  question,
  answers: initialAnswers,
}: {
  question: QType;
  answers: Answer[];
}) {
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  // Handle submitting a new answer (UI-only for now).
  function handleSubmit(text: string) {
    // Create a temporary local answer object
    const newAnswer: Answer = {
      id: `temp-${Date.now()}`,
      question_id: question.id,
      content: text,
      accepted: false,
      author: "You",
    };
    setAnswers((prev) => [...prev, newAnswer]);
    console.log("submit answer (client):", text);
  }

  // Handle marking an answer as accepted (client-side update)
  function handleMarkAccepted(id: string) {
    setAnswers((prev) =>
      prev.map((a) => ({ ...a, accepted: a.id === id ? true : false }))
    );
    // Move the accepted answer to top by re-sorting
    setAnswers((prev) => {
      const copy = [...prev];
      copy.sort((a, b) => (b.accepted ? 1 : 0) - (a.accepted ? 1 : 0));
      return copy;
    });
    console.log("mark accepted (client):", id);
  }

  return (
    <div>
      <div className="mb-8">
        <AnswerForm onSubmit={handleSubmit} />
      </div>

      <AnswersList answers={answers} onMarkAccepted={handleMarkAccepted} />
    </div>
  );
}
