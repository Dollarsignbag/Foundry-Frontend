"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const hideCta = pathname === "/apply" || pathname.startsWith("/admin");

  return (
    <header>
      <div className="nav wrap">
        <Link className="brand" href="/">THE FOUNDRY</Link>
        {!hideCta && (
          <div className="nav-links">
            <Link href="/apply" className="btn btn-primary btn-sm">GET IN</Link>
          </div>
        )}
      </div>
    </header>
  );
}
