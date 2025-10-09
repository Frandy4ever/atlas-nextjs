import { NextResponse } from "next/server";
import { fetchAnswersByQuestionId } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    const answers = await fetchAnswersByQuestionId(questionId);
    // map to the "id, answer, question_id" shape if required by tests
    const output = answers.map((a) => ({
      id: a.id,
      answer: a.content,
      question_id: a.question_id,
      author: a.author ?? null,
      created_at: a.created_at ?? null,
    }));
    return NextResponse.json(output);
  } catch (err) {
    console.error("/api/questions/:id/answers error:", err);
    return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
  }
}
