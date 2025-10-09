import { sql } from "@vercel/postgres";
import type { Question, Topic, User, Answer } from "./definitions";


export async function fetchUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchTopics() {
  try {
    const data = await sql<Topic>`SELECT * FROM topics`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchTopic(id: string) {
  try {
    const data = await sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
    return data.rows && data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchQuestions(id: string) {
  try {
    const data =
      await sql<Question>`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch questions.");
  }
}

export async function insertQuestion(
  question: Pick<Question, "title" | "topic_id" | "votes">
) {
  try {
    const data =
      await sql<Question>`INSERT INTO questions (title, topic_id, votes) VALUES (${question.title}, ${question.topic_id}, ${question.votes})`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add question.");
  }
}

export async function insertTopic(topic: Pick<Topic, "title">) {
  try {
    const data =
      await sql<Topic>`INSERT INTO topics (title) VALUES (${topic.title}) RETURNING id;`;
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add topic.");
  }
}

export async function incrementVotes(id: string) {
  try {
    const data =
      await sql<Question>`UPDATE questions SET votes = votes + 1 WHERE id = ${id}`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to increment votes.");
  }
}

export async function updateAcceptedAnswer(questionId: string, answerId: string) {
  try {
    await sql`
      UPDATE questions
      SET answer_id = ${answerId}
      WHERE id = ${questionId};
    `;
  } catch (error) {
    console.error("Database Error (updateAcceptedAnswer):", error);
    throw new Error("Failed to update accepted answer.");
  }
}

export async function fetchQuestionById(id: string) {
  try {
    const result = await sql<Question>`
      SELECT * FROM questions WHERE id = ${id};
    `;
    return result.rows[0] || null;
  } catch (error) {
    console.error("Database Error (fetchQuestionById):", error);
    throw new Error("Failed to fetch question.");
  }
}

export async function fetchAnswersForQuestion(questionId: string) {
  try {
    const result = await sql<Answer>`
      SELECT *
      FROM answers
      WHERE question_id = ${questionId}
      ORDER BY accepted DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error("Database Error (fetchAnswersForQuestion):", error);
    throw new Error("Failed to fetch answers for question.");
  }
}

export async function insertAnswer(payload: Answer) {
  try {
    console.log("insertAnswer payload:", payload);

    const attempts: Array<{ sqlQuery: any }> = [];

    // Try the likely column names in order.
    attempts.push({
      sqlQuery: sql`
        INSERT INTO answers (question_id, answer, author)
        VALUES (${payload.question_id}, ${payload.content}, ${payload.author ?? null})
        RETURNING *
      `,
    });

    attempts.push({
      sqlQuery: sql`
        INSERT INTO answers (question_id, answer)
        VALUES (${payload.question_id}, ${payload.content})
        RETURNING *
      `,
    });

    // fallback options
    attempts.push({
      sqlQuery: sql`
        INSERT INTO answers (question_id, content, author)
        VALUES (${payload.question_id}, ${payload.content}, ${payload.author ?? null})
        RETURNING *
      `,
    });

    attempts.push({
      sqlQuery: sql`
        INSERT INTO answers (question_id, content)
        VALUES (${payload.question_id}, ${payload.content})
        RETURNING *
      `,
    });

    attempts.push({
      sqlQuery: sql`
        INSERT INTO answers (question_id, body)
        VALUES (${payload.question_id}, ${payload.content})
        RETURNING *
      `,
    });

    attempts.push({
      sqlQuery: sql`
        INSERT INTO answers (question_id, text)
        VALUES (${payload.question_id}, ${payload.content})
        RETURNING *
      `,
    });

    let lastError: any = null;
    for (const attempt of attempts) {
      try {
        const res = await attempt.sqlQuery;
        const row = (res.rows as unknown[])[0] as Record<string, any>;

        // Map row to canonical Answer shape (defensive)
        const answer: Answer = {
          id: row.id ?? row.answer_id ?? String(Date.now()),
          question_id: row.question_id ?? row.question ?? payload.question_id,
          content: row.answer ?? row.content ?? row.body ?? row.text ?? payload.content ?? "",
          author: row.author ?? row.user_name ?? undefined,
          created_at: row.created_at
            ? new Date(row.created_at).toISOString()
            : row.inserted_at
            ? new Date(row.inserted_at).toISOString()
            : null,
        };

        console.log("insertAnswer mapped:", answer);
        return answer;
      } catch (err) {
        console.warn("insertAnswer attempt failed:", (err as any).message ?? err);
        lastError = err;
      }
    }

    console.error("All insert attempts failed for insertAnswer. Last error:", lastError);
    throw lastError ?? new Error("All insert attempts failed.");
  } catch (err) {
    console.error("Database Error (insertAnswer):", err);
    throw new Error("Failed to insert answer.");
  }
}
