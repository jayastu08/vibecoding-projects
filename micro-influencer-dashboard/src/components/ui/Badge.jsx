const platformStyles = {
  tiktok: 'bg-gray-900 text-white',
  instagram: 'bg-[#e4405f] text-white',
  youtube: 'bg-[#ff0000] text-white',
};

const variantStyles = {
  default: 'bg-surface-100 text-surface-700',
  success: 'bg-success-100 text-success-700',
  danger: 'bg-danger-100 text-danger-700',
  warning: 'bg-warning-100 text-warning-600',
  brand: 'bg-brand-100 text-brand-700',
};

export default function Badge({
  children,
  platform,
  variant,
  className = '',
}) {
  const style = platform
    ? platformStyles[platform]
    : variant
      ? variantStyles[variant]
      : variantStyles.default;

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full
        text-xs font-medium whitespace-nowrap
        ${style} ${className}
      `}
    >
      {children}
    </span>
  );
}
