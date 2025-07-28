import { useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function Apply() {
  const { user, redirectToLogin } = useAuth();
  const [formData, setFormData] = useState({
    roblox_username: '',
    discord_username: '',
    age: '',
    experience: '',
    why_join: '',
    availability: '',
    previous_military: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 text-center">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-slate-300 mb-6">
            You need to be logged in to submit an application to join the British Army Corps.
          </p>
          <button
            onClick={redirectToLogin}
            className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-6 py-3 rounded-lg font-bold transition-colors w-full"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-slate-300 mb-6">
            Thank you for your interest in joining the British Army Corps. Your application has been 
            submitted and will be reviewed by our recruitment team.
          </p>
          <p className="text-slate-400 text-sm">
            You will be contacted via email with the result of your application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Enlistment Application</h1>
          <p className="text-slate-300 text-lg">
            Join the ranks of the British Army Corps. Fill out this application to begin your military career.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Roblox Username *
              </label>
              <input
                type="text"
                name="roblox_username"
                value={formData.roblox_username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="Your Roblox username"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Discord Username
              </label>
              <input
                type="text"
                name="discord_username"
                value={formData.discord_username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="Your Discord username"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="13"
              max="100"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="Your age"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Military Experience *
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
              placeholder="Describe your experience with military groups, leadership roles, or relevant gaming experience..."
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Why do you want to join? *
            </label>
            <textarea
              name="why_join"
              value={formData.why_join}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
              placeholder="Tell us why you want to join the British Army Corps..."
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Availability *
            </label>
            <textarea
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
              placeholder="When are you typically available for training and operations? (include timezone)"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Previous Military Groups
            </label>
            <textarea
              name="previous_military"
              value={formData.previous_military}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors resize-none"
              placeholder="List any previous military groups you've been part of and your roles (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600 text-red-900 px-6 py-4 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
