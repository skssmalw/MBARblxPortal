import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Shield, CheckCircle, XCircle, Clock, Users, FileText } from 'lucide-react';
import { Application, ExtendedMochaUser } from '@/shared/types';

export default function Admin() {
  const { user } = useAuth();
  const extendedUser = user as ExtendedMochaUser | null;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (extendedUser?.isAdmin) {
      loadApplications();
    }
  }, [extendedUser]);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId: number, status: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes,
        }),
      });

      if (response.ok) {
        await loadApplications();
        setSelectedApp(null);
        setAdminNotes('');
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-slate-300">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!extendedUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const pendingApps = applications.filter(app => app.status === 'pending');
  const approvedApps = applications.filter(app => app.status === 'approved');
  const rejectedApps = applications.filter(app => app.status === 'rejected');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-900/20 border-green-500';
      case 'rejected':
        return 'text-red-400 bg-red-900/20 border-red-500';
      default:
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-white">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{pendingApps.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{approvedApps.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <XCircle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-slate-400 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-white">{rejectedApps.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Applications</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-slate-300">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300">No applications yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-6 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{app.roblox_username}</h3>
                      <p className="text-slate-400">Age: {app.age} • Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="text-sm font-medium capitalize">{app.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Application Details</h3>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Roblox Username</label>
                    <p className="text-white">{selectedApp.roblox_username}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Discord Username</label>
                    <p className="text-white">{selectedApp.discord_username || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Age</label>
                    <p className="text-white">{selectedApp.age}</p>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1">Status</label>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(selectedApp.status)}`}>
                      {getStatusIcon(selectedApp.status)}
                      <span className="text-sm font-medium capitalize">{selectedApp.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Military Experience</label>
                  <p className="text-white bg-slate-700 p-3 rounded-lg">{selectedApp.experience}</p>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Why Join</label>
                  <p className="text-white bg-slate-700 p-3 rounded-lg">{selectedApp.why_join}</p>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Availability</label>
                  <p className="text-white bg-slate-700 p-3 rounded-lg">{selectedApp.availability}</p>
                </div>

                {selectedApp.previous_military && (
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Previous Military Groups</label>
                    <p className="text-white bg-slate-700 p-3 rounded-lg">{selectedApp.previous_military}</p>
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    rows={3}
                    placeholder="Add notes about this application..."
                  />
                </div>

                {selectedApp.status === 'pending' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => updateApplicationStatus(selectedApp.id, 'approved')}
                      disabled={updating}
                      className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      {updating ? 'Updating...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')}
                      disabled={updating}
                      className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      {updating ? 'Updating...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
