import Link from "next/link";
import '../global.css';
import { db } from "@vercel/postgres";
import SideNav from "@/components/Sidenav";

async function fetchTopics() {
    const client = await db.connect();
    const result = await client.sql`SELECT id, title FROM topics`;
    return result.rows;
}

export default async function UILayout({ children }: { children: React.ReactNode }) {
    const topics = await fetchTopics();

    return (
        <div className="ui-container" style={{ display: 'flex' }}>
            <aside className="sidebar" style={{ width: '250px', padding: '1rem', background: '#f0f0f0' }}>
                <h2>Topics</h2>
                <nav>
                    <ul>
                        <li><Link href="/ui">Dashboard</Link></li>
                        <li><Link href="/ui/topics/new">New Topic</Link></li>
                        {topics.length > 0 ? (
                            topics.map((topic) => (
                                <li key={topic.id}>
                                    <Link href={`/ui/topics/${topic.id}`}>{topic.title}</Link>
                                </li>
                            ))
                        ) : (
                            <li>No topics available.</li>
                        )}
                    </ul>
                </nav>
            </aside>
            <section className="content" style={{ flex: 1, padding: '1rem' }}>
                {children}
            </section>
        </div>
    );
}
