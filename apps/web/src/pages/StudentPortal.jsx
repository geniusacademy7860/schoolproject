import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const StudentPortal = () => {
  const navigate = useNavigate();
  const { loginStudent, currentUser, isStudent } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginStudent(email, password);
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (isStudent && currentUser) {
    navigate('/student-dashboard');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Student Login - Genius Academy Forbesganj</title>
        <meta name="description" content="Login to access your student portal, view attendance, check results, and download report cards." />
      </Helmet>

      <Header />

      <div className="min-h-screen pt-24 pb-12 px-4 bg-muted/30">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#EAF0FB' }}
              >
                <GraduationCap className="w-8 h-8" style={{ color: '#1A3C8F' }} />
              </div>
              <CardTitle className="text-2xl">Student / Parent Login</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Access your attendance, results, and notices
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5 h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1.5 h-11"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {showForgotMsg && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Password Reset</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Please contact your school admin or call: <strong>+91 98765 43210</strong> to reset your password.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={loading}
                  style={{ backgroundColor: '#1A3C8F' }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotMsg(!showForgotMsg)}
                    className="text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                  <a href="/admin-login" className="text-primary hover:underline">
                    Admin Login
                  </a>
                </div>

              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            For any login issues, contact your school admin
          </p>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;