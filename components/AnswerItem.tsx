"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

type Answer = {
  id: string;
  question_id: string;
  content: string;
  accepted?: boolean;
  author?: string;
};

export default function AnswerItem({
  answer,
  onMarkAccepted,
}: {
  answer: Answer;
  onMarkAccepted?: () => void;
}) {
  return (
    <div
      className={`flex items-start justify-between rounded-md border p-4 ${
        answer.accepted ? "bg-green-50 border-green-200" : "bg-white border-atlas-white-300"
      }`}
    >
      <div className="pr-4">
        <p className="mb-2 text-sm text-gray-800">{answer.content}</p>
        <p className="text-xs text-gray-500">— {answer.author ?? "Anonymous"}</p>
      </div>

      <div className="ml-4 flex-shrink-0">
        {answer.accepted ? (
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircleIcon className="h-6 w-6" />
            <span className="text-sm font-medium">Accepted</span>
          </div>
        ) : (
          <button
            onClick={onMarkAccepted}
            className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
            title="Mark as accepted answer (UI-only)"
          >
            <CheckCircleIcon className="h-5 w-5 text-gray-500" />
            <span>Accept</span>
          </button>
        )}
      </div>
    </div>
  );
}
