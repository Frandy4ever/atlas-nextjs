import { Metadata } from "next";

interface TopicPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return []; // For fetching topic IDs dynamically later
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  return {
    title: `Topic ${params.id}`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  if (!params || !params.id) return <p>Loading...</p>;

  return (
    <main>
      <h1>Topic: {params.id}</h1>
      <p>List of questions related to this topic will be displayed here.</p>
    </main>
  );
}
