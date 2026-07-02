export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-lg border bg-white text-surface-900
          placeholder:text-surface-400 text-sm
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
          disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed
          ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-surface-200'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-danger-600">{error}</span>
      )}
    </div>
  );
}
