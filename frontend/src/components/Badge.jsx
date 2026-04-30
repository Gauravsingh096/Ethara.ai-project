const variants = {
  priority: {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  },
  status: {
    todo: 'bg-gray-100 text-gray-700',
    inprogress: 'bg-blue-100 text-blue-700',
    done: 'bg-emerald-100 text-emerald-700',
  },
  role: {
    admin: 'bg-purple-100 text-purple-700',
    member: 'bg-gray-100 text-gray-600',
  },
};

const labels = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  admin: 'Admin',
  member: 'Member',
};

export default function Badge({ type, value, className = '' }) {
  const colorClass = variants[type]?.[value] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {labels[value] || value}
    </span>
  );
}
