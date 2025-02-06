import { createTopic } from "@/app/actions/topicActions";


export default function NewTopic() {
  return (
    <main>
      <h1>Create a New Topic</h1>
      <form action={createTopic} method="post">
        <label htmlFor="topicName">Topic Name:</label>
        <input type="text" id="topicName" name="topicName" />
        <button type="submit">Create Topic</button>
      </form>
    </main>
  );
}
