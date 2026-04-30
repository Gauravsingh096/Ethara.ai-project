import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from './Badge';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const myRole = project.members.find(
    (m) => (m.user?._id || m.user)?.toString() === user?._id?.toString()
  )?.role || 'member';

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: project.color || '#6366f1' }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {project.name}
            </h3>
            <Badge type="role" value={myRole} className="mt-0.5" />
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
      </div>

      {project.description && (
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-1 mt-4 text-sm text-gray-500">
        <Users className="w-4 h-4" />
        <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
