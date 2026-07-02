import { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setSidebarCollapsed(mq.matches);
    const handler = (e) => setSidebarCollapsed(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-surface-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleCollapse} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 lg:hidden shadow-xl">
            <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} onNavClick={() => setMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
