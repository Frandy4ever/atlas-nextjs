"use client";

import { useState, useTransition } from "react";
import AnswersList from "./AnswersList";
import AnswerForm from "./AnswerForm";
import { markAnswerAsAccepted } from "@/lib/actions";
import type { Question as QType } from "@/lib/definitions";

type Answer = {
  id: string;
  question_id: string;
  content: string;
  accepted?: boolean;
  author?: string;
};

export default function QuestionPageClient({ question, initialAnswers }: { question: QType; initialAnswers: Answer[] }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [isPending, startTransition] = useTransition();

  // Handle submitting a new answer
  function handleSubmit(text: string) {
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

  // Handle marking an answer as accepted (persists to server)
  function handleMarkAccepted(id: string) {
    // For responsiveness
    setAnswers((prev) =>
      prev.map((a) => ({ ...a, accepted: a.id === id }))
    );

    // Persist change on the server
    startTransition(async () => {
      try {
        await markAnswerAsAccepted(question.id, id);
        console.log("✅ Accepted answer saved:", id);
      } catch (err) {
        console.error("❌ Failed to save accepted answer:", err);
      }
    });
  }

  return (
    <div>
      <div className="mb-8">
        <AnswerForm onSubmit={handleSubmit} />
      </div>

      <AnswersList answers={answers} onMarkAccepted={handleMarkAccepted} />

      {isPending && (
        <p className="mt-2 text-sm text-gray-500">Saving accepted answer...</p>
      )}
    </div>
  );
}
