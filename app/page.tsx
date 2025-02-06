import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Welcome to Atlas Q&A App
      </h1>
      <p className="mt-4 text-lg text-gray-700">This is the homepage.</p>
      <Link
        href="/ui"
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
