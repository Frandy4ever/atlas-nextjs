// app/ui/questions/[id]/page.tsx
import type { Answer as AnswerType, Question as QType } from "@/lib/definitions";
import { fetchQuestionById, fetchAnswersForQuestion } from "@/lib/data";
import QuestionPageClient from "@/components/QuestionPageClient";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const question = await fetchQuestionById(id);
  if (!question) {
    return <div className="p-4 text-red-500">Question not found.</div>;
  }

  // fetch raw rows from DB (shape may vary) and normalize to the app's AnswerType
  const rawAnswers = await fetchAnswersForQuestion(id);

  const answers: AnswerType[] = rawAnswers.map((a: any) => ({
    id: a.id,
    content: a.content ?? a.answer ?? a.body ?? a.text ?? "",
    question_id: a.question_id,
    accepted: !!a.accepted,
    author: a.author ?? undefined,
    created_at: a.created_at ? new Date(a.created_at).toISOString() : null,
  }));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">{(question as QType).title}</h1>

      {/* pass answers into the prop name QuestionPageClient expects */}
      <QuestionPageClient question={question as QType} initialAnswers={answers} />
    </div>
  );
}
