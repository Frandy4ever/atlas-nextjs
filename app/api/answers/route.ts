import { NextResponse } from "next/server";
import { insertAnswer } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question_id, content, author } = body;

    if (!question_id || !content) {
      return NextResponse.json({ error: "Missing question_id or content" }, { status: 400 });
    }

    const inserted = await insertAnswer({
      question_id,
      content,
      author: author ?? null,
    });

    return NextResponse.json({ success: true, answer: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("API /api/answers error:", err);
    return NextResponse.json({ error: (err && err.message) || "Server error" }, { status: 500 });
  }
}
