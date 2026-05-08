import Link from 'next/link';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
    
        <div className="flex items-center gap-16">
            <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-serif font-bold text-black" aria-label="Briefly Home">
            <h1 className="">Briefly</h1>
          </Link>
        </div>

        {/* NAVIGASI */}
        <nav className="hidden md:block" aria-label="Main Navigation">
          <ul className="flex items-center gap-8 font-sans text-sm font-medium text-gray-400">
            <li>
              <Link href="/world" className="transition-colors hover:text-black duration-300">World</Link>
            </li>
            <li>
              <Link href="/technology" className="transition-colors hover:text-black duration-300">Football</Link>
            </li>
          </ul>
        </nav>
        </div>

         <nav className="hidden md:block" aria-label="Main Navigation">
          <ul className="flex items-center gap-8 font-sans text-sm font-medium text-gray-400">
            <li>
              <Link href="/world" className="transition-colors hover:text-black duration-300">About</Link>
            </li>
             <li>
              <Link href="/world" className="transition-colors hover:text-black duration-300">Version 0.0.0</Link>
            </li>
          </ul>
        </nav>

       
      </div>
    </header>
  );
}