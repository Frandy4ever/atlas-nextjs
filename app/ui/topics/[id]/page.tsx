import { Metadata } from "next";

interface TopicPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }]; // Example IDs
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Topic ${resolvedParams.id}`,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  if (!resolvedParams?.id) return <p>Loading...</p>;

  return (
    <main>
      <h1>Topic: {resolvedParams.id}</h1>
      <p>List of questions related to this topic will be displayed here.</p>
    </main>
  );
}
