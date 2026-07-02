export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-surface-200
        shadow-card transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`px-6 py-4 border-b border-surface-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
