interface TopicPageProps {
  params: { id: string };
}

export default function TopicPage({ params }: TopicPageProps) {
  return (
    <main>
      <h1>Topic: {params.id}</h1>
      <p>List of questions related to this topic will be displayed here.</p>
    </main>
  );
}
