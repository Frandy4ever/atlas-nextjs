import { askQuestion, upvoteQuestion } from "@/app/actions/questionActions";
import { db } from "@vercel/postgres";

async function fetchQuestions(topicId: string) {
    const client = await db.connect();
    const result = await client.sql`SELECT id, title, votes FROM questions WHERE topic_id = ${topicId}`;
    return result.rows;
}

// ✅ Ensure TypeScript understands the function type
type FormAction = (formData: FormData) => Promise<{ success?: string; error?: string }>;

export default async function TopicPage({ params }: { params: { id: string } }) {
    const questions = await fetchQuestions(params.id);

    return (
        <main>
            <h1>Questions for Topic {params.id}</h1>

            {/* ✅ Explicitly cast askQuestion as FormAction */}
            <form action={askQuestion as FormAction} method="post">
                <input type="hidden" name="topicId" value={params.id} />
                <input type="text" name="title" placeholder="Ask a question..." required />
                <button type="submit">Ask</button>
            </form>

            <ul>
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <li key={question.id}>
                            {question.title} - Votes: {question.votes}

                            {/* ✅ Explicitly cast upvoteQuestion as FormAction */}
                            <form action={upvoteQuestion as FormAction} method="post">
                                <input type="hidden" name="questionId" value={question.id} />
                                <button type="submit">👍 Upvote</button>
                            </form>
                        </li>
                    ))
                ) : (
                    <p>No questions yet. Be the first to ask!</p>
                )}
            </ul>
        </main>
    );
}
