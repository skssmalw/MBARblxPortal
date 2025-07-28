import { useEffect, useState } from 'react';
import { Crown, Users, Zap, Shield, ExternalLink } from 'lucide-react';
import { Regiment } from '@/shared/types';
import RegimentCard from '@/react-app/components/RegimentCard';
import { Link } from 'react-router';

export default function Home() {
  const [regiments, setRegiments] = useState<Regiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFonts();

    fetch('/api/regiments')
      .then(res => res.json())
      .then(data => {
        setRegiments(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load regiments:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              British Army Corps
            </h1>
            <p className="text-xl text-yellow-200 mb-8 max-w-3xl mx-auto">
              Join the most elite and prestigious military organization on Roblox. 
              Experience authentic British Army operations, training, and camaraderie.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/apply"
              className="bg-yellow-500 hover:bg-yellow-400 text-red-900 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Enlist Today
            </Link>
            <a
              href="https://discord.gg/XPxmmmKjyR"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-900 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center space-x-2"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Join Discord</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-xl shadow-xl">
              <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
              <p className="text-slate-300">Active Members</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-xl shadow-xl">
              <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">2</h3>
              <p className="text-slate-300">Elite Regiments</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-xl shadow-xl">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
              <p className="text-slate-300">Operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">About Our Corps</h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              The British Army Corps is a premier military simulation group on Roblox, dedicated to 
              providing authentic British Army experiences. We pride ourselves on professionalism, 
              realistic training, and creating lasting friendships within our ranks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">What We Offer</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Professional military training and operations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Multiple specialized regiments to join</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Promotion opportunities based on merit</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Active Discord community</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">Regular events and ceremonies</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 p-8 rounded-xl border border-red-700/50">
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Ranks</h3>
              <p className="text-slate-300 mb-6">
                Ready to serve with honor and distinction? Our recruitment process ensures we find 
                the best candidates who share our values of professionalism and dedication.
              </p>
              <Link
                to="/apply"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-red-900 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Start Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Regiments Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Regiments</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose from our elite regiments, each with their own specialization and proud history.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
              <p className="text-slate-300 mt-4">Loading regiments...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regiments.map((regiment) => (
                <RegimentCard key={regiment.id} regiment={regiment} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
