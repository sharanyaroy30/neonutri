import { Link } from "wouter";

type MobileNavProps = {
  currentPath: string;
};

const navigation = [
  { id: 'profile', name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'recommendations', name: 'Foods', path: '/recommendations', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'log', name: 'Log', path: '/log', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 'growth', name: 'Growth', path: '/growth', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
];

export default function MobileNav({ currentPath }: MobileNavProps) {
  // Normalize path for comparison
  const normalizedPath = currentPath === '/' ? '/profile' : currentPath;
  
  return (
    <>
      {/* Top Bar (Mobile) */}
      <header className="lg:hidden bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
        <h1 className="font-bold text-xl text-primary">neonutri</h1>
        <button className="p-1 rounded-full hover:bg-neutral-100">
          <span className="sr-only">Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <Link 
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center py-3 flex-1 transition-colors duration-150 ${
                normalizedPath === item.path
                  ? 'text-primary border-t-2 border-primary'
                  : 'text-neutral-500'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={normalizedPath === item.path ? 2.5 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
