import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import { toast } from 'sonner';

const StudentPortal = () => {
  const navigate = useNavigate();
  const { loginStudent, currentUser, isStudent } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginStudent(email, password);
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      // Case-insensitive email search
      const { data: students, error } = await supabase
        .from('Students')
        .select('id, name, email')
        .ilike('email', forgotEmail.trim());

      if (error) throw error;

      if (!students || students.length === 0) {
        toast.error('Email not found. Please check your email.');
        setForgotLoading(false);
        return;
      }

      const student = students[0];

      const { error: insertError } = await supabase
        .from('password_reset_requests')
        .insert([{
          student_id: student.id,
          student_name: student.name,
          student_email: student.email,
          status: 'Pending',
        }]);

      if (insertError) throw insertError;

      toast.success('Request sent! Admin will reset your password. Contact: +91 82980 68098');
      setShowForgot(false);
      setForgotEmail('');
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  React.useEffect(() => {
    if (isStudent && currentUser) {
      navigate('/student-dashboard');
    }
  }, [isStudent, currentUser, navigate]);

  return (
    <>
      <Helmet>
        <title>Student Login - Genius Academy Forbesganj</title>
      </Helmet>
      <Header />
      <div className="min-h-screen pt-24 pb-12 px-4 bg-muted/30">
        <div className="max-w-md mx-auto">
          {!showForgot ? (
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}>
                  <GraduationCap className="w-8 h-8" style={{ color: '#1A3C8F' }} />
                </div>
                <CardTitle className="text-2xl">Student / Parent Login</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Access your attendance, results, and notices</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="student@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1.5 h-11" />
                  </div>
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-11" disabled={loading} style={{ backgroundColor: '#1A3C8F' }}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                  <div className="flex justify-between text-sm pt-1">
                    <button type="button" onClick={() => setShowForgot(true)} className="text-primary hover:underline">
                      Forgot Password?
                    </button>
                    <a href="/admin-login" className="text-primary hover:underline">Admin Login</a>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Reset Password Request</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Enter your email — admin will reset your password</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <Label>Your Email Address</Label>
                    <Input type="email" placeholder="student@gmail.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required className="mt-1.5 h-11" />
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">How it works:</p>
                    <p className="text-xs text-blue-600 mt-1">Admin will see your request and reset your password. You will get new password from school.</p>
                    <p className="text-xs text-blue-600 mt-1 font-medium">Contact: +91 82980 68098</p>
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={forgotLoading} style={{ backgroundColor: '#1A3C8F' }}>
                    {forgotLoading ? 'Sending...' : 'Send Reset Request'}
                  </Button>
                  <button type="button" onClick={() => setShowForgot(false)} className="w-full text-sm text-slate-500 hover:text-slate-700">
                    Back to Login
                  </button>
                </form>
              </CardContent>
            </Card>
          )}
          <p className="text-center text-sm text-muted-foreground mt-6">
            For login issues, contact school admin: +91 82980 68098
          </p>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;