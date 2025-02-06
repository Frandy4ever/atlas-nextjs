import Link from "next/link";

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
      <ul>
        <li>
          <Link href="/ui/topics/1">Topic 1</Link>
        </li>
        <li>
          <Link href="/ui/topics/2">Topic 2</Link>
        </li>
        <li>
          <Link href="/ui/topics/new">Create New Topic</Link>
        </li>
      </ul>
    </main>
  );
}
