export default function Table({ children, className = '', ...props }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-surface-200">
      <table
        className={`w-full text-sm ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function Thead({ children, className = '', ...props }) {
  return (
    <thead className={`bg-surface-50 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function Th({ children, className = '', ...props }) {
  return (
    <th
      className={`
        px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider
        ${className}
      `}
      {...props}
    >
      {children}
    </th>
  );
}

export function Tr({ children, className = '', ...props }) {
  return (
    <tr
      className={`border-b border-surface-100 last:border-0 hover:bg-surface-50/50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-4 py-3 text-surface-700 ${className}`} {...props}>
      {children}
    </td>
  );
}
