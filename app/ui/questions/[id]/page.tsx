import AnswerForm from "@/components/AnswerForm";
import AnswersList from "@/components/AnswersList";
import { questions } from "@/lib/placeholder-data";

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Try to find the question in placeholder-data for UI preview.
  // Replace this with real DB fetch.
  const question = questions.find((q) => q.id === id);

  if (!question) {
    return <div>Question not found</div>;
  }

  // Sample answers — UI only.
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

      <div className="mb-8">
        
        <AnswerForm
          onSubmit={(text) => {
            console.log("submit answer (UI only):", text);
          }}
        />
      </div>

      <AnswersList
        answers={sampleAnswers}
        onMarkAccepted={(answerId) => {
          console.log("mark accepted (UI only):", answerId);
        }}
      />
    </div>
  );
}
