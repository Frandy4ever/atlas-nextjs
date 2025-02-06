import { TopicsSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <>
      <TopicsSkeleton />
      <div style={{ padding: "2rem" }}>
        <h2>Loading...</h2>
        {/* You can replace this with a custom skeleton component */}
        <div
          className="skeleton"
          style={{ background: "#ddd", height: "20px", marginBottom: "10px" }}
        />
        <div
          className="skeleton"
          style={{
            background: "#ddd",
            height: "20px",
            width: "80%",
            marginBottom: "10px",
          }}
        />
        <div
          className="skeleton"
          style={{ background: "#ddd", height: "20px", width: "60%" }}
        />
      </div>
    </>
  );
}
