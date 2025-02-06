import Link from "next/link";
import "../global.css";
import SideNav from "@/components/Sidenav";

export default function UILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ui-container" style={{ display: "flex" }}>
      <aside
        className="sidebar"
        style={{ width: "250px", padding: "1rem", background: "#f0f0f0" }}
      >
        <h2>Topics</h2>
        <nav>
          <ul>
            <li>
              <Link href="/ui">Dashboard</Link>
            </li>
            <li>
              <Link href="/ui/topics/new">New Topic</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <section className="content" style={{ flex: 1, padding: "1rem" }}>
        {children}
      </section>
    </div>
  );
}
