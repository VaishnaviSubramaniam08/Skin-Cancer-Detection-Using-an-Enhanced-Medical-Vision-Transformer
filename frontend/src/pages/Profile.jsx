import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { userAPI } from '../services/api';
import { User, Mail, Calendar, LayoutGrid, Lock, LogOut } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', created_at: '' });
  const [stats, setStats] = useState({
    total_predictions: 0,
    skin_predictions: 0,
    non_skin_predictions: 0,
  });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setProfile(data);
      setName(data.name);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await userAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile(name);
      setProfile({ ...profile, name });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    {editing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-2xl font-bold text-gray-900 border-b-2 border-primary outline-none"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (editing) {
                      handleUpdateProfile();
                    } else {
                      setEditing(true);
                    }
                  }}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Account Created</p>
                    <p className="font-medium text-gray-900">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Total Analyses</p>
                    <p className="font-medium text-gray-900">{stats.total_predictions}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Analyses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_predictions}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Skin Images</p>
                  <p className="text-2xl font-bold text-green-600">{stats.skin_predictions}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Non-Skin Images</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.non_skin_predictions}</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Change Password</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
