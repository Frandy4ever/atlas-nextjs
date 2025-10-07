"use client";

import { useState } from "react";

type Props = {
  onSubmit?: (text: string) => void;
};

export default function AnswerForm({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write your answer..."
        className="mb-3 w-full rounded-md border border-atlas-white-300 bg-inherit p-3 text-sm placeholder-gray-400 focus:outline-hidden focus:ring-3 focus:ring-atlas-teal"
        rows={4}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-secondary px-4 py-2 text-white hover:opacity-95"
        >
          Submit Answer
        </button>
      </div>
    </form>
  );
}
