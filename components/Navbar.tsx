
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="text-2xl font-bold text-slate-900">
          Civic<span className="text-blue-600">Pulse</span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link href="/report" className="hover:text-blue-600">
            Report an Issue
          </Link>
        </div>
      </nav>
    </header>
  );
}