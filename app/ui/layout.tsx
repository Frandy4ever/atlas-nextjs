import Link from "next/link";

export default function UILayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <aside>
          <h2>Sidebar</h2>
          <nav>
            <ul>
              <li><Link href="/ui">Dashboard</Link></li>
              <li><Link href="/ui/topics/new">New Topic</Link></li>
            </ul>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    );
  }