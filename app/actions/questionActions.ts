"use server";

import { db } from "@vercel/postgres";

export async function askQuestion(formData: FormData) {
    const topicId = formData.get("topicId") as string;
    const title = formData.get("title") as string;
    if (!title || !topicId) return { error: "Missing fields." };

    try {
        const client = await db.connect();
        await client.sql`INSERT INTO questions (title, topic_id, votes) VALUES (${title}, ${topicId}, 0)`;
        return { success: "Question added successfully!" };
    } catch (error) {
        return { error: "Failed to add question." };
    }
}

export async function upvoteQuestion(formData: FormData) {
    const questionId = formData.get("questionId") as string;
    if (!questionId) return { error: "Missing question ID." };

    try {
        const client = await db.connect();
        await client.sql`UPDATE questions SET votes = votes + 1 WHERE id = ${questionId}`;
        return { success: "Vote added!" };
    } catch (error) {
        return { error: "Failed to vote." };
    }
}
