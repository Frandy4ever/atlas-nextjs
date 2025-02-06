import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Welcome to the Q&A App</h1>
      <p>This is the homepage.</p>
      <Link href="/ui">Go to Dashboard</Link>
    </main>
  );
}
