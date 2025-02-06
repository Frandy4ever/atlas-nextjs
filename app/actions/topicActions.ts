"use server";

import { db } from "@vercel/postgres";

export async function createTopic(formData: FormData) {
    const title = formData.get("title") as string;
    if (!title) return { error: "Title is required." };

    try {
        const client = await db.connect();
        await client.sql`INSERT INTO topics (title) VALUES (${title})`;
        return { success: "Topic created successfully!" };
    } catch (error) {
        return { error: "Failed to create topic." };
    }
}
