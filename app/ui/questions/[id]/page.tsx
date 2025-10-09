import { fetchQuestionById, fetchAnswersForQuestion } from "@/lib/data";
import QuestionPageClient from "@/components/QuestionPageClient";

export default async function QuestionPage({ params }: { params: { id: string } }) {
  const question = await fetchQuestionById(params.id);
  if (!question) {
    return <div className="p-4 text-red-500">Question not found.</div>;
  }

  const answers = (await fetchAnswersForQuestion(params.id)).map((a) => ({
  id: a.id,
  content: a.answer,     // map `answer` -> `content`
  question_id: a.question_id,
  accepted: a.accepted,
  author: "Anonymous",   // optional
}));

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">{question.title}</h1>
      <QuestionPageClient question={question} initialAnswers={answers} />
    </div>
  );
}
