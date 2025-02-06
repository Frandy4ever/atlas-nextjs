import { db } from "@vercel/postgres";

async function fetchQuestions(topicId: string) {
    const client = await db.connect();
    const result = await client.sql`SELECT id, title, votes FROM questions WHERE topic_id = ${topicId}`;
    return result.rows;
}

export default async function TopicPage({ params }: { params: { id: string } }) {
    const questions = await fetchQuestions(params.id);

    return (
        <main>
            <h1>Questions for Topic {params.id}</h1>
            <ul>
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <li key={question.id}>
                            {question.title} - Votes: {question.votes}
                        </li>
                    ))
                ) : (
                    <p>No questions yet. Be the first to ask!</p>
                )}
            </ul>
        </main>
    );
}
