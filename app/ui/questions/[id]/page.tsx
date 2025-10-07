import QuestionPageClient from "@/components/QuestionPageClient";
import { questions } from "@/lib/placeholder-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const question = questions.find((q) => q.id === id);

  if (!question) {
    return <div>Question not found</div>;
  }

  const questionForClient = {
    id: question.id,
    title: question.title,
    topic_id: (question as any).topic ?? "",
    votes: question.votes,
  };

  const sampleAnswers = [
    {
      id: "a-1",
      question_id: id,
      content: "This is an accepted sample answer (UI example).",
      accepted: true,
      author: "Atlas Student",
    },
    {
      id: "a-2",
      question_id: id,
      content: "This is another answer posted by a user.",
      accepted: false,
      author: "Code Breeder",
    },
    {
      id: "a-3",
      question_id: id,
      content: "A third example answer to show ordering.",
      accepted: false,
      author: "Atlas School",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-black">{question.title}</h1>
      <QuestionPageClient question={questionForClient} answers={sampleAnswers} />
    </div>
  );
}
