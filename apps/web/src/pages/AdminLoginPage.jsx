import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthcontext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1A3C8F] flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-slate-900 mb-2">
          Admin Login
        </h2>
        <p className="text-center text-sm text-slate-600 mb-8">
          Genius Academy Forbesganj
        </p>

        <Card className="shadow-xl border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-medium bg-[#1A3C8F] hover:bg-[#152e6e]"
              >
                {loading ? 'Logging in...' : 'Login as Admin'}
              </Button>

            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <a href="/student-login" className="text-sm text-[#1A3C8F] hover:underline">
            Student Login
          </a>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;