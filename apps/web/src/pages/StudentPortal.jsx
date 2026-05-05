import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Calendar, Award, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import pb from '@/lib/pocketbaseClient';

const StudentPortal = () => {
  const navigate = useNavigate();
  const { loginStudent, currentUser, isStudent } = useAuth();
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [classSection, setClassSection] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginStudent(rollNumber, password);
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
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}>
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
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="Enter your roll number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
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

                <div>
                  <Label htmlFor="classSection">Class & Section</Label>
                  <Select value={classSection} onValueChange={setClassSection}>
                    <SelectTrigger className="mt-1.5 h-11">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-A">Class 1 - A</SelectItem>
                      <SelectItem value="2-A">Class 2 - A</SelectItem>
                      <SelectItem value="3-A">Class 3 - A</SelectItem>
                      <SelectItem value="4-A">Class 4 - A</SelectItem>
                      <SelectItem value="5-A">Class 5 - A</SelectItem>
                      <SelectItem value="6-A">Class 6 - A</SelectItem>
                      <SelectItem value="7-A">Class 7 - A</SelectItem>
                      <SelectItem value="8-A">Class 8 - A</SelectItem>
                      <SelectItem value="9-A">Class 9 - A</SelectItem>
                      <SelectItem value="10-A">Class 10 - A</SelectItem>
                      <SelectItem value="11-Science">Class 11 - Science</SelectItem>
                      <SelectItem value="11-Commerce">Class 11 - Commerce</SelectItem>
                      <SelectItem value="12-Science">Class 12 - Science</SelectItem>
                      <SelectItem value="12-Commerce">Class 12 - Commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
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
                  <a href="#" className="text-primary hover:underline">
                    Forgot Password?
                  </a>
                  <a href="/admin-login" className="text-primary hover:underline">
                    Admin Login
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            For any login issues, contact: +91 98765 43210
          </p>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;