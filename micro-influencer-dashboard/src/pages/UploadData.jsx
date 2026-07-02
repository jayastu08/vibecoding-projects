import { useState, useCallback, useRef } from 'react';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const MOCK_PREVIEW_ROWS = [
  { creator: '@alex_beauty', platform: 'instagram', cost: 450, spend: 1200, revenue: 5400, clicks: 28500 },
  { creator: '@jordan_fitness', platform: 'tiktok', cost: 300, spend: 800, revenue: 3600, clicks: 42000 },
  { creator: '@taylor_tech', platform: 'youtube', cost: 1200, spend: 3500, revenue: 21000, clicks: 85000 },
  { creator: '@morgan_travel', platform: 'instagram', cost: 600, spend: 1800, revenue: 7200, clicks: 31000 },
  { creator: '@casey_gaming', platform: 'tiktok', cost: 350, spend: 900, revenue: 2700, clicks: 67000 },
];

function parseFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function Tabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-surface-100 w-fit mb-6">
      {[
        { key: 'csv', label: 'CSV Upload' },
        { key: 'manual', label: 'Manual Entry' },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${active === tab.key
              ? 'bg-white text-surface-900 shadow-sm'
              : 'text-surface-500 hover:text-surface-700'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Dropzone({ file, error, onFile, onRemove, onUpload, uploading }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  if (file) {
    return (
      <div className="border-2 border-surface-200 border-dashed rounded-xl p-6 bg-surface-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-surface-900">{file.name}</p>
              <p className="text-xs text-surface-500">{parseFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onUpload} disabled={uploading}>
              {uploading ? 'Parsing...' : 'Upload'}
            </Button>
            <button
              onClick={onRemove}
              className="p-1.5 rounded-md text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
              title="Remove"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
        ${dragging ? 'border-brand-400 bg-brand-50/50' : error ? 'border-danger-300 bg-danger-50/30' : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50/50'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${error ? 'bg-danger-50 text-danger-500' : 'bg-surface-100 text-surface-400'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-surface-700">
            {error ? 'Upload failed' : 'Drag & drop your CSV here'}
          </p>
          <p className="text-xs text-surface-500 mt-1">
            {error ? error : 'or click to browse files'}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewTable({ rows, totalRows, onConfirm, onCancel, imported }) {
  if (imported) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center text-success-600 mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-surface-900">Import complete</p>
        <p className="text-xs text-surface-500 mt-1">Successfully imported {totalRows} rows.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-surface-200">
        <table className="w-full text-sm">
          <thead className="bg-surface-50">
            <tr>
              {['Creator', 'Platform', 'Cost per Post', 'Spend', 'Revenue', 'Clicks'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-surface-100 last:border-0">
                <td className="px-4 py-2.5 font-medium text-surface-900">{r.creator}</td>
                <td className="px-4 py-2.5 text-surface-700 capitalize">{r.platform}</td>
                <td className="px-4 py-2.5 text-surface-700 tabular-nums">${r.cost.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-surface-700 tabular-nums">${r.spend.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-surface-700 tabular-nums">${r.revenue.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-surface-700 tabular-nums">{(r.clicks / 1000).toFixed(1)}K</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-surface-400">
        Showing first {rows.length} of {totalRows} rows.
      </p>
      <div className="flex items-center gap-3 pt-1">
        <Button variant="primary" onClick={onConfirm}>
          Import {totalRows} rows
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function ManualForm() {
  const [form, setForm] = useState({
    name: '',
    platform: '',
    cost: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saveAnother, setSaveAnother] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Creator name is required';
    if (!form.platform) errs.platform = 'Select a platform';
    if (!form.cost || Number(form.cost) <= 0) errs.cost = 'Enter a valid cost';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      errs.endDate = 'End date must be after start date';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      setSaveAnother(false);
    }
  };

  const handleSaveAnother = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setForm({ name: '', platform: '', cost: '', startDate: '', endDate: '', notes: '' });
      setErrors({});
      setSaveAnother(true);
      setTimeout(() => setSaveAnother(false), 2000);
    }
  };

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center text-success-600 mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-surface-900">Creator saved</p>
        <p className="text-xs text-surface-500 mt-1">{form.name} has been added.</p>
        <Button variant="secondary" className="mt-4" onClick={() => { setSubmitted(false); setForm({ name: '', platform: '', cost: '', startDate: '', endDate: '', notes: '' }); }}>
          Add another creator
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Creator Name"
            placeholder="@username"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
          />
        </div>
        <Select label="Platform" value={form.platform} onChange={set('platform')} error={errors.platform}>
          <option value="">Select platform</option>
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
        </Select>
        <Input
          label="Cost Per Post ($)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.cost}
          onChange={set('cost')}
          error={errors.cost}
        />
        <Input
          label="Campaign Start Date"
          type="date"
          value={form.startDate}
          onChange={set('startDate')}
          error={errors.startDate}
        />
        <Input
          label="Campaign End Date"
          type="date"
          value={form.endDate}
          onChange={set('endDate')}
          error={errors.endDate}
        />
        <div className="sm:col-span-2">
          <Input
            label="Notes (optional)"
            placeholder="Campaign details, content type, etc."
            value={form.notes}
            onChange={set('notes')}
          />
        </div>
      </div>

      {saveAnother && (
        <p className="text-xs text-success-600 font-medium">Creator saved. Form cleared for another entry.</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary">Save Creator</Button>
        <Button variant="secondary" onClick={handleSaveAnother}>Save &amp; Add Another</Button>
      </div>
    </form>
  );
}

export default function UploadData() {
  const [tab, setTab] = useState('csv');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [imported, setImported] = useState(false);

  const handleFile = (f) => {
    setError(null);
    setPreview(null);
    setImported(false);

    if (!f.name.toLowerCase().endsWith('.csv')) {
      setError('Invalid file type. Please upload a .csv file.');
      setFile(null);
      return;
    }

    setFile(f);
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setPreview(null);
    setImported(false);
  };

  const handleUpload = () => {
    setUploading(true);
    setError(null);

    setTimeout(() => {
      setUploading(false);
      setPreview({ rows: MOCK_PREVIEW_ROWS, total: 28 });
    }, 800);
  };

  const handleImport = () => {
    setImported(true);
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-surface-900">Upload Data</h2>
        <p className="text-sm text-surface-500 mt-1">Import campaign performance data from CSV or enter it manually.</p>
      </div>

      <Tabs active={tab} onChange={setTab} />

      {tab === 'csv' ? (
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <h3 className="text-sm font-semibold text-surface-900">Upload CSV</h3>

              <Dropzone
                file={file}
                error={error}
                onFile={handleFile}
                onRemove={handleRemove}
                onUpload={handleUpload}
                uploading={uploading}
              />

              {!file && !error && !preview && !imported && (
                <p className="text-xs text-surface-400">
                  Upload your Shopify or Stripe discount code export (.csv)
                </p>
              )}

              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger-50 border border-danger-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-danger-500 shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-danger-700">Invalid file</p>
                    <p className="text-xs text-danger-600 mt-0.5">{error}</p>
                    <p className="text-xs text-danger-500 mt-1">Expected columns: Creator Name, Platform, Cost Per Post, Spend, Revenue, Clicks</p>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-surface-500">Parsing file...</p>
                </div>
              )}

              {preview && !imported && (
                <PreviewTable
                  rows={preview.rows}
                  totalRows={preview.total}
                  onConfirm={handleImport}
                  onCancel={handleCancelPreview}
                  imported={false}
                />
              )}

              {imported && (
                <PreviewTable
                  rows={preview?.rows || []}
                  totalRows={preview?.total || 0}
                  imported
                />
              )}
            </CardBody>
          </Card>
        </div>
      ) : (
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-surface-900 mb-5">Manual Entry</h3>
            <ManualForm />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
