import { useLocation } from 'react-router-dom';
import Select from '../../components/ui/Select';

const pageTitles = {
  '/': 'Dashboard',
  '/creators': 'Creators',
  '/upload': 'Upload Data',
  '/settings': 'Settings',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 md:px-6 shrink-0 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer lg:hidden"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-surface-900 truncate">{title}</h1>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium shrink-0">
          Micro-Influencer ROI
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:block w-44">
          <Select defaultValue="30d">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="quarter">Last Quarter</option>
            <option value="all">All Time</option>
          </Select>
        </div>
        <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>
        <div className="relative group">
          <button className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-semibold cursor-pointer hover:ring-2 hover:ring-brand-200 transition-all">
            JD
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-surface-200 shadow-dropdown
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-40">
            <div className="px-4 py-3 border-b border-surface-100">
              <p className="text-sm font-medium text-surface-900">Jane Doe</p>
              <p className="text-xs text-surface-500">jane@agency.co</p>
            </div>
            <div className="py-1">
              <a href="#" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">Account settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-danger-600 hover:bg-danger-50">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
