import { Link } from "wouter";

type SidebarProps = {
  currentPath: string;
};

const navigation = [
  { id: 'profile', name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'recommendations', name: 'Foods', path: '/recommendations', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'log', name: 'Log', path: '/log', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 'growth', name: 'Growth', path: '/growth', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
];

export default function Sidebar({ currentPath }: SidebarProps) {
  // Normalize path for comparison
  const normalizedPath = currentPath === '/' ? '/profile' : currentPath;
  
  return (
    <div className="hidden lg:flex lg:w-64 bg-white border-r border-neutral-200 flex-shrink-0 h-screen sticky top-0">
      <div className="flex flex-col w-full">
        <div className="p-4 border-b border-neutral-200">
          <h1 className="font-bold text-2xl text-primary">neonutri</h1>
        </div>
        
        <nav className="flex-1 py-4">
          {navigation.map((item, index) => (
            <Link 
              key={item.id}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                normalizedPath === item.path 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="font-bold">P</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">Parent Account</p>
              <p className="text-xs text-neutral-500">Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
