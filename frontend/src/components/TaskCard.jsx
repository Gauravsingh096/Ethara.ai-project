import { format, isPast } from 'date-fns';
import { Calendar, User2, Pencil, Trash2 } from 'lucide-react';
import Badge from './Badge';

export default function TaskCard({ task, onEdit, onDelete, canEdit, canDelete }) {
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900 text-sm leading-snug flex-1">{task.title}</h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <button onClick={() => onEdit(task)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => onDelete(task)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Badge type="priority" value={task.priority} />
        <Badge type="status" value={task.status} />
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        {task.assignedTo ? (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium">
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <span className="truncate max-w-24">{task.assignedTo.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-400">
            <User2 className="w-3.5 h-3.5" />
            <span>Unassigned</span>
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
