import bcrypt from "bcryptjs";
import { db } from "@vercel/postgres";
import { users, topics, questions } from "../../lib/placeholder-data";
import { revalidatePath } from "next/cache";

// Make sure this route never runs at build time and uses Node runtime.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

// --- Table helpers ------------

async function ensureExtensions(client: ReturnType<typeof db.connect> extends Promise<infer C> ? C : never) {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
}

async function dropAll(client: any) {
  // Drop children before parents
  await client.sql`DROP TABLE IF EXISTS answers`;
  await client.sql`DROP TABLE IF EXISTS questions`;
  await client.sql`DROP TABLE IF EXISTS topics`;
  await client.sql`DROP TABLE IF EXISTS users`;
}

async function createUsers(client: any) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
}

async function createTopics(client: any) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS topics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL
    );
  `;
}

async function createQuestions(client: any) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS questions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(255) NOT NULL,
      topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      votes INT NOT NULL DEFAULT 0,
      answer_id UUID
    );
  `;
}

async function createAnswers(client: any) {
  await client.sql`
    CREATE TABLE IF NOT EXISTS answers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      answer TEXT NOT NULL,
      question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE
    );
  `;
}

// --- Seed helpers ------------------

async function seedUsers(client: any) {
  await createUsers(client);
  await client.sql`DELETE FROM users`;
  await Promise.all(
    users.map(async (u) => {
      const hashed = await bcrypt.hash(u.password, 10);
      await client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${u.id}, ${u.name}, ${u.email}, ${hashed})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );
}

async function seedTopics(client: any) {
  await createTopics(client);
  await client.sql`DELETE FROM topics`;
  await Promise.all(
    topics.map(
      (t) => client.sql`
        INSERT INTO topics (id, title)
        VALUES (${t.id}, ${t.title})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

async function seedQuestions(client: any) {
  await createQuestions(client);
  await client.sql`DELETE FROM questions`;
  await Promise.all(
    questions.map(
      (q) => client.sql`
        INSERT INTO questions (id, title, topic_id, votes)
        VALUES (${q.id}, ${q.title}, ${q.topic}, ${q.votes})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

async function seedAnswers(client: any) {
  await createAnswers(client);
  await client.sql`DELETE FROM answers`;

  // Example placeholder answer; replace with real data as needed
  const answers = [
    {
      id: "0b93d8dc-6e43-49e3-b59f-b67531247612",
      answer: "It's a new feature in TypeScript that makes it easier to write type-safe code.",
      question_id: "0b93d8dc-6e43-49e3-b59f-b67531247612",
    },
  ];

  await Promise.all(
    answers.map(
      (a) => client.sql`
        INSERT INTO answers (id, answer, question_id)
        VALUES (${a.id}, ${a.answer}, ${a.question_id})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
}

// --- Route handler ------------

export async function GET() {
  // Connect at request time, not module import time.
  const client = await db.connect();

  try {
    await client.sql`BEGIN`;

    await ensureExtensions(client);
    await dropAll(client);

    // Recreate and seed in dependency order
    await createUsers(client);
    await createTopics(client);
    await createQuestions(client);
    await createAnswers(client);

    await seedUsers(client);
    await seedTopics(client);
    await seedQuestions(client);
    await seedAnswers(client);

    await client.sql`COMMIT`;

    // Revalidate anything that reads these tables
    revalidatePath("/", "layout");

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error(error);
    return Response.json({ error: String(error) }, { status: 500 });
  } finally {
    // Important: release connection
    client.release();
  }
}
