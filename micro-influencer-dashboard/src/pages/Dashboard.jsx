import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import creators from '../data/creators';

const PAGE_SIZE = 15;

const metrics = [
  {
    label: 'Total Spend',
    value: 24580,
    prefix: '$',
    change: 12.5,
    good: 'down',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: 'Total Revenue',
    value: 187200,
    prefix: '$',
    change: 34.2,
    good: 'up',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: 'Net ROI',
    value: 184,
    suffix: '%',
    change: 21.4,
    good: 'up',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
  {
    label: 'CAC',
    value: 42.3,
    prefix: '$',
    change: -8.1,
    good: 'down',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

function formatValue(value, prefix, suffix) {
  const abs = value < 0 ? -value : value;
  let formatted;
  if (abs >= 1_000_000) formatted = (abs / 1_000_000).toFixed(1) + 'M';
  else if (abs >= 1_000) formatted = (abs / 1_000).toFixed(1) + 'K';
  else if (Number.isInteger(abs)) formatted = abs.toLocaleString();
  else formatted = abs.toFixed(1);
  return (prefix || '') + (value < 0 ? '-' : '') + formatted + (suffix || '');
}

function TrendBadge({ change, good }) {
  const isUp = change > 0;
  const isGood = good === 'up' ? isUp : !isUp;
  const colorClass = isGood ? 'text-success-600' : 'text-danger-600';
  const bgClass = isGood ? 'bg-success-50' : 'bg-danger-50';

  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-medium ${bgClass} ${colorClass}`}>
      {isUp ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
      {isUp ? '+' : ''}{change}%
    </span>
  );
}

function SortIcon({ dir }) {
  if (!dir) return <span className="ml-1 opacity-30">&#8597;</span>;
  return <span className="ml-1">{dir === 'asc' ? '&#8593;' : '&#8595;'}</span>;
}

function RankBadge({ rank }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">1</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-surface-200 text-surface-500 text-[10px] font-bold">2</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">3</span>;
  return <span className="text-xs text-surface-400 w-5 text-center inline-block">{rank}</span>;
}

const COLUMNS = [
  { key: 'rank', label: '#', sortable: false, className: 'w-10 pl-4' },
  { key: 'name', label: 'Creator', sortable: true, className: 'min-w-[160px]' },
  { key: 'platform', label: 'Platform', sortable: true, className: 'w-28' },
  { key: 'spend', label: 'Spend', sortable: true, className: 'w-24 text-right' },
  { key: 'revenue', label: 'Revenue', sortable: true, className: 'w-24 text-right' },
  { key: 'roi', label: 'ROI', sortable: true, className: 'w-20 text-right' },
  { key: 'cac', label: 'CAC', sortable: true, className: 'w-20 text-right' },
  { key: 'clicks', label: 'Clicks', sortable: true, className: 'w-24 text-right hidden md:table-cell' },
  { key: 'status', label: 'Status', sortable: true, className: 'w-24' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [sortKey, setSortKey] = useState('roi');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);
  const [regenerating, setRegenerating] = useState(false);

  const insights = useMemo(() => [
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
        </svg>
      ),
      text: 'Excellent conversion rate on TikTok — recommend increasing Q3 budget by 20%.',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      text: '3 creators show ROI below 10% — consider renegotiating or pausing contracts.',
    },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      text: 'Instagram Reels driving 2.4x higher engagement than static posts — prioritize video content.',
    },
  ], []);

  const regenerate = useCallback(() => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1400);
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'cac' ? 'asc' : 'desc');
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let list = [...creators];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    if (platformFilter !== 'all') {
      list = list.filter((c) => c.platform === platformFilter);
    }

    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortKey === 'platform') return a.platform.localeCompare(b.platform) * dir;
      if (sortKey === 'status') return a.status.localeCompare(b.status) * dir;
      return ((a[sortKey] ?? 0) - (b[sortKey] ?? 0)) * dir;
    });

    return list;
  }, [search, platformFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-surface-900">Dashboard</h2>
        <p className="text-sm text-surface-500 mt-1">High-level ROI overview across all campaigns.</p>
      </div>

      {/* AI Insights */}
      <div className="relative rounded-xl border border-transparent bg-gradient-to-r from-brand-500/10 via-purple-500/10 to-pink-500/10 p-[1px]">
        <div className="rounded-[11px] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 text-xs font-semibold text-brand-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  AI Insights
                </span>
                <span className="text-[11px] text-surface-400 font-medium">Powered by AI</span>
              </div>
              <ul className="space-y-2.5">
                {insights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-surface-700">
                    <span className="mt-0.5 shrink-0 text-surface-400">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={regenerate}
              disabled={regenerating}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         text-surface-500 hover:text-surface-700 hover:bg-surface-100
                         disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
              {regenerating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardBody>
              <div className="flex items-start justify-between mb-1">
                <span className="text-sm text-surface-500">{m.label}</span>
                <span className="text-surface-400">{m.icon}</span>
              </div>
              <p className="text-2xl font-bold text-surface-900 tracking-tight">
                {formatValue(m.value, m.prefix, m.suffix)}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <TrendBadge change={m.change} good={m.good} />
                <span className="text-xs text-surface-400">vs prev period</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">Creator Performance Leaderboard</h3>
            <p className="text-sm text-surface-500 mt-1">Ranked by ROI contribution across active campaigns.</p>
          </div>
        </div>

        <Card className="p-0">
          <div className="p-4 border-b border-surface-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-surface-200 bg-white text-surface-900 placeholder:text-surface-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                placeholder="Search creators..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
            <select
              className="px-3 py-2 rounded-lg border border-surface-200 bg-white text-surface-900 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              value={platformFilter}
              onChange={(e) => { setPlatformFilter(e.target.value); setPage(0); }}
            >
              <option value="all">All Platforms</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50">
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider ${col.className || ''} ${col.sortable ? 'cursor-pointer select-none hover:text-surface-700 transition-colors' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <span className="inline-flex items-center">
                        {col.label}
                        {col.sortable && (
                          sortKey === col.key
                            ? <SortIcon dir={sortDir} />
                            : <SortIcon dir={null} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((c, idx) => {
                  const globalRank = filtered.indexOf(c) + 1;
                  const isTop3 = globalRank <= 3;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/creators/${c.id}`)}
                      className={`border-b border-surface-100 last:border-0 transition-colors cursor-pointer
                        ${isTop3 ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-surface-50/50'}
                      `}
                    >
                      <td className="px-4 py-3 w-10">
                        <RankBadge rank={globalRank} />
                      </td>
                      <td className="px-4 py-3 min-w-[160px]">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                            ${c.platform === 'tiktok' ? 'bg-gray-900 text-white' :
                              c.platform === 'instagram' ? 'bg-pink-500 text-white' :
                              'bg-red-600 text-white'}
                          `}>
                            {c.name[1].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-surface-900">{c.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-28">
                        <Badge platform={c.platform} />
                      </td>
                      <td className="px-4 py-3 w-24 text-right text-surface-700 font-medium tabular-nums">
                        ${c.spend.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 w-24 text-right text-surface-700 font-medium tabular-nums">
                        ${c.revenue.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 w-20 text-right font-semibold tabular-nums ${c.roi >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {c.roi >= 0 ? '+' : ''}{c.roi}%
                      </td>
                      <td className="px-4 py-3 w-20 text-right text-surface-700 font-medium tabular-nums">
                        ${c.cac.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 w-24 text-right text-surface-700 font-medium tabular-nums hidden md:table-cell">
                        {(c.clicks / 1000).toFixed(1)}K
                      </td>
                      <td className="px-4 py-3 w-24">
                        <Badge variant={c.status === 'active' ? 'success' : 'warning'}>
                          {c.status === 'active' ? 'Active' : 'Paused'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-surface-400 text-sm">
                      No creators match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-surface-200 flex items-center justify-between">
              <p className="text-xs text-surface-500">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors cursor-pointer
                      ${i === page ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
