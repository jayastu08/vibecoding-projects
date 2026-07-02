export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 rounded-lg border bg-white text-surface-900
          text-sm transition-all duration-150 appearance-none
          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
          bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9
          focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
          disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed
          ${error ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-surface-200'}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="text-xs text-danger-600">{error}</span>
      )}
    </div>
  );
}
