import { ExternalLink, Shield } from 'lucide-react';
import { Regiment } from '@/shared/types';

interface RegimentCardProps {
  regiment: Regiment;
}

export default function RegimentCard({ regiment }: RegimentCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl border border-slate-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{regiment.name}</h3>
              {regiment.motto && (
                <p className="text-yellow-400 text-sm italic">"{regiment.motto}"</p>
              )}
            </div>
          </div>
        </div>
        
        {regiment.description && (
          <p className="text-slate-300 mb-4 leading-relaxed">
            {regiment.description}
          </p>
        )}
        
        {regiment.roblox_group_url && (
          <a
            href={regiment.roblox_group_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors shadow-lg"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Roblox Group</span>
          </a>
        )}
      </div>
    </div>
  );
}
