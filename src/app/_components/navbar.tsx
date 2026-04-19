import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div className="w-0.5 sm:w-1 h-4 sm:h-5 bg-[#003FB1] rounded" />
          <Link href="/" className="text-base sm:text-lg font-bold text-zinc-900 truncate">
            SwissCV Generator
          </Link>
        </div>
      </div>
    </nav>
  );
}
