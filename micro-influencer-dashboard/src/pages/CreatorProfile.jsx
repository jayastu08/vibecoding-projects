import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import creators from '../data/creators';

function generateRevenueHistory(seed, days) {
  const data = [];
  const base = 200 + (seed * 37) % 800;
  for (let i = 0; i < days; i++) {
    const noise = (Math.sin(i / 7 + seed) * 0.3 + (i / days) * 0.5 + 0.5) * 600;
    const spike = (i + seed * 3) % 12 === 0 ? 1.6 : 1;
    data.push(Math.round((base + noise) * spike));
  }
  return data;
}

function generateContentLog(seed) {
  const platforms = ['tiktok', 'instagram', 'youtube'];
  const posts = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (i * 5 + (seed % 4)));
    const plat = platforms[(seed + i) % 3];
    const conv = Math.round(50 + Math.random() * 400 + i * 8);
    posts.push({
      date: d.toISOString().slice(0, 10),
      platform: plat,
      url: `${plat === 'tiktok' ? 'tiktok.com' : plat === 'instagram' ? 'instagram.com' : 'youtube.com'}/@creator_${seed}/post/${i + 1}`,
      clicks: Math.round(2000 + Math.random() * 15000 + i * 200),
      conversions: conv,
      revenue: Math.round(200 + conv * (8 + Math.random() * 12)),
    });
  }
  return posts;
}

function Sparkline({ data, height = 40, width: chartWidth = 200, color = '#6366f1' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = chartWidth / (data.length - 1);
  const d = data.map((v, i) => {
    const x = i * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  const area = `${d} L${(data.length - 1) * w},${height + 2} L0,${height + 2} Z`;

  return (
    <svg width={chartWidth} height={height + 4} className="overflow-visible">
      <path d={area} fill={`${color}15`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RevenueChart({ history }) {
  const [range, setRange] = useState(30);

  const sliced = useMemo(() => history.slice(-range), [history, range]);
  const max = Math.max(...sliced, 1);
  const min = Math.min(...sliced, 0);
  const rangeVal = max - min || 1;

  const w = 600;
  const h = 220;
  const pad = { top: 20, right: 20, bottom: 30, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const points = sliced.map((v, i) => {
    const x = pad.left + (i / (sliced.length - 1)) * cw;
    const y = pad.top + ch - ((v - min) / rangeVal) * ch;
    return [x, y];
  });

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaD = `${lineD} L${points[points.length - 1][0]},${pad.top + ch} L${points[0][0]},${pad.top + ch} Z`;

  const yTicks = 5;
  const yStep = rangeVal / yTicks;
  const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => Math.round(min + yStep * i));

  const xTicks = 6;
  const xStep = Math.max(1, Math.floor(sliced.length / xTicks));
  const xLabels = Array.from({ length: Math.ceil(sliced.length / xStep) }, (_, i) => i * xStep).filter(i => i < sliced.length);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-surface-900">Revenue Over Time</p>
        <div className="flex gap-1 p-0.5 rounded-lg bg-surface-100">
          {[30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer
                ${range === d ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}
              `}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* grid lines */}
        {yLabels.map((_, i) => (
          <line key={i}
            x1={pad.left} y1={pad.top + (i / yTicks) * ch}
            x2={w - pad.right} y2={pad.top + (i / yTicks) * ch}
            stroke="#e5e7eb" strokeWidth="1"
          />
        ))}

        {/* y axis labels */}
        {yLabels.map((v, i) => (
          <text key={i}
            x={pad.left - 8} y={pad.top + (i / yTicks) * ch + 4}
            textAnchor="end" fill="#9ca3af" fontSize="11"
          >
            ${v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
          </text>
        ))}

        {/* x axis labels */}
        {xLabels.map((i) => (
          <text key={i}
            x={pad.left + (i / (sliced.length - 1)) * cw}
            y={h - 6}
            textAnchor="middle" fill="#9ca3af" fontSize="11"
          >
            {i === 0 ? 'Start' : `Day ${i}`}
          </text>
        ))}

        {/* area fill */}
        <path d={areaD} fill="url(#revenue-fill)" />

        {/* line */}
        <path d={lineD} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />

        {/* dots */}
        {points.filter((_, i) => i % Math.max(1, Math.floor(sliced.length / 12)) === 0).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="white" stroke="#6366f1" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

function ContentLogTable({ posts }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200">
            {['Post Date', 'Platform', 'Post Link', 'Clicks', 'Conversions', 'Revenue'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.map((p, i) => (
            <tr key={i} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50 transition-colors">
              <td className="px-4 py-3 text-surface-700 whitespace-nowrap">{p.date}</td>
              <td className="px-4 py-3">
                <Badge platform={p.platform} />
              </td>
              <td className="px-4 py-3">
                <a href="#" className="text-brand-600 hover:text-brand-700 underline truncate max-w-[200px] inline-block align-middle"
                   title={p.url}>
                  {p.url}
                </a>
              </td>
              <td className="px-4 py-3 text-surface-700 tabular-nums">{(p.clicks / 1000).toFixed(1)}K</td>
              <td className="px-4 py-3 text-surface-700 tabular-nums font-medium">{p.conversions}</td>
              <td className="px-4 py-3 text-surface-900 font-medium tabular-nums">${p.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CreatorProfile() {
  const { id } = useParams();
  const creator = creators.find((c) => c.id === Number(id));
  const [paused, setPaused] = useState(creator?.status === 'paused');

  const costPerPost = useMemo(() => {
    if (!creator) return 0;
    const base = creator.platform === 'tiktok' ? 350
               : creator.platform === 'instagram' ? 600
               : 1800;
    return Math.round(base + (creator.id * 23) % 400);
  }, [creator]);

  const ctr = useMemo(() => {
    if (!creator) return 0;
    return parseFloat((1.2 + (creator.id * 0.7) % 4 + Math.random() * 0.5).toFixed(2));
  }, [creator]);

  const revenueHistory = useMemo(() => {
    if (!creator) return [];
    return generateRevenueHistory(creator.id * 7 + creator.spend, 90);
  }, [creator]);

  const contentLog = useMemo(() => {
    if (!creator) return [];
    return generateContentLog(creator.id);
  }, [creator]);

  if (!creator) {
    return (
      <div className="space-y-6">
        <Link to="/" className="text-sm text-brand-600 hover:text-brand-700">&larr; Back to Dashboard</Link>
        <Card>
          <CardBody>
            <p className="text-surface-400 text-center py-12 text-sm">Creator not found.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const roiColor = creator.roi >= 0 ? 'text-success-600' : 'text-danger-600';

  const avatarColor = creator.platform === 'tiktok' ? 'bg-gray-900 text-white'
                    : creator.platform === 'instagram' ? 'bg-pink-500 text-white'
                    : 'bg-red-600 text-white';

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-brand-600 hover:text-brand-700">&larr; Back to Dashboard</Link>

      {/* Header */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${avatarColor}`}>
              {creator.name[1].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h2 className="text-xl font-semibold text-surface-900">{creator.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge platform={creator.platform} />
                  <Badge variant={paused ? 'warning' : 'success'}>
                    {paused ? 'Paused' : 'Active'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-surface-500">
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                  </svg>
                  ${creator.spend.toLocaleString()} total spend
                </span>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                  </svg>
                  ${(creator.clicks / 1000).toFixed(1)}K clicks
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Button variant="secondary" size="sm" className="flex-1 sm:flex-initial">
                Edit
              </Button>
              <Button
                variant={paused ? 'primary' : 'ghost'}
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? 'Resume Contract' : 'Pause Contract'}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card>
          <CardBody>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Total Spend</p>
            <p className="text-xl font-bold text-surface-900">${creator.spend.toLocaleString()}</p>
            <Sparkline data={revenueHistory.slice(0, 30).map(v => v * 0.3)} height={32} width={140} color="#9ca3af" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-surface-900">${creator.revenue.toLocaleString()}</p>
            <Sparkline data={revenueHistory.slice(0, 30)} height={32} width={140} color="#22c55e" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">ROI</p>
            <p className={`text-xl font-bold ${roiColor}`}>
              {creator.roi >= 0 ? '+' : ''}{creator.roi}%
            </p>
            <Sparkline data={revenueHistory.slice(0, 30).map(v => ((v - 200) / 200) * 100 + 50)} height={32} width={140} color="#6366f1" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">CTR</p>
            <p className="text-xl font-bold text-surface-900">{ctr}%</p>
            <div className="mt-2 h-2 rounded-full bg-surface-100 overflow-hidden">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(ctr / 6 * 100, 100)}%` }} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Cost Per Post</p>
            <p className="text-xl font-bold text-surface-900">${costPerPost.toLocaleString()}</p>
            <p className="text-xs text-surface-400 mt-1 capitalize">{creator.platform} rate</p>
          </CardBody>
        </Card>
      </div>

      {/* Revenue chart */}
      <Card>
        <CardBody>
          <RevenueChart history={revenueHistory} />
        </CardBody>
      </Card>

      {/* Content log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-surface-900">Content Log</p>
              <p className="text-xs text-surface-500 mt-0.5">Recent posts and attributed performance</p>
            </div>
            {contentLog.length > 0 && (
              <p className="text-xs text-surface-400">{contentLog.reduce((s, p) => s + p.revenue, 0).toLocaleString()} total revenue</p>
            )}
          </div>
        </CardHeader>
        <ContentLogTable posts={contentLog} />
      </Card>
    </div>
  );
}
