import Link from "next/link";
import { db } from "@vercel/postgres";

async function fetchTopics() {
    const client = await db.connect();
    const result = await client.sql`SELECT id, title FROM topics`;
    return result.rows;
}

export default async function Dashboard() {
    const topics = await fetchTopics();

    return (
        <main>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard</p>
            <ul>
                {topics.length > 0 ? (
                    topics.map((topic) => (
                        <li key={topic.id}>
                            <Link href={`/ui/topics/${topic.id}`}>{topic.title}</Link>
                        </li>
                    ))
                ) : (
                    <li>No topics available.</li>
                )}
                <li><Link href="/ui/topics/new">Create New Topic</Link></li>
            </ul>
        </main>
    );
}
