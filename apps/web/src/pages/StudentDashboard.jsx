import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Calendar, Award, Bell, User, LogOut, Menu, X, FileText, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    attendance: 0, presentDays: 0, lastRank: 0, pendingFee: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return;
      try {
        const attendanceRecords = await pb.collection('attendece').getList(1, 1, {
          filter: `studentId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        if (attendanceRecords.items.length > 0) {
          const latest = attendanceRecords.items[0];
          setStats(prev => ({
            ...prev,
            attendance: latest.attendancePercentage || 0,
            presentDays: latest.totalPresent || 0
          }));
        }

        const resultRecords = await pb.collection('results').getList(1, 1, {
          filter: `studentId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        if (resultRecords.items.length > 0) {
          setStats(prev => ({ ...prev, lastRank: resultRecords.items[0].rank || 0 }));
        }

        const feeRecords = await pb.collection('Fees').getFullList({
          filter: `studentId = "${currentUser.id}" && status = "Pending"`,
          $autoCancel: false
        });
        const pendingTotal = feeRecords.reduce((sum, f) => sum + (f.amount || 0), 0);
        setStats(prev => ({ ...prev, pendingFee: pendingTotal }));

      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [currentUser]);

  const menuItems = [
    { icon: User, label: 'Dashboard', path: '/student-dashboard' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: Award, label: 'Results', path: '/results' },
    { icon: DollarSign, label: 'Fees', path: '/fees' },
    { icon: Bell, label: 'Notices', path: '/#notices' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>{`Student Dashboard - ${currentUser?.name || 'Student'}`}</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30">

        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1A3C8F' }}>
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Student Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-muted">
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <aside
          className={`fixed top-0 left-0 h-full bg-white border-r z-40 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
          style={{ width: '240px' }}
        >
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EAF0FB' }}>
                <User className="w-6 h-6" style={{ color: '#1A3C8F' }} />
              </div>
              <div>
                <div className="font-semibold text-sm">{currentUser?.name || 'Student'}</div>
                <div className="text-xs text-muted-foreground">
                  Class {currentUser?.class} - {currentUser?.section}
                </div>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        <main className="lg:ml-60 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">

          <div className="mb-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #1A3C8F 0%, #2563eb 100%)' }}>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-white/90">Here is your academic overview</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EAF0FB' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#1A3C8F' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#1A3C8F' }}>
                    {stats.attendance.toFixed(1)}%
                  </span>
                </div>
                <div className="text-sm font-medium">Attendance</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.attendance >= 75 ? 'Good attendance' : 'Below 75%'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EAF0FB' }}>
                    <Calendar className="w-6 h-6" style={{ color: '#1A3C8F' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#1A3C8F' }}>{stats.presentDays}</span>
                </div>
                <div className="text-sm font-medium">Present Days</div>
                <div className="text-xs text-muted-foreground mt-1">This session</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EAF0FB' }}>
                    <Award className="w-6 h-6" style={{ color: '#1A3C8F' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#1A3C8F' }}>
                    {stats.lastRank > 0 ? `${stats.lastRank}${stats.lastRank === 1 ? 'st' : stats.lastRank === 2 ? 'nd' : stats.lastRank === 3 ? 'rd' : 'th'}` : '-'}
                  </span>
                </div>
                <div className="text-sm font-medium">Last Exam Rank</div>
                <div className="text-xs text-muted-foreground mt-1">In class</div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate('/fees')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF3E2' }}>
                    <DollarSign className="w-6 h-6" style={{ color: '#F5A623' }} />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: '#F5A623' }}>
                    Rs.{stats.pendingFee.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm font-medium">Pending Fee</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.pendingFee === 0 ? 'All clear' : 'Tap to view'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/attendance')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" style={{ color: '#1A3C8F' }} />
                  View Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Check your monthly attendance records</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/results')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5" style={{ color: '#1A3C8F' }} />
                  Download Report Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View and download your exam results</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/fees')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5" style={{ color: '#1A3C8F' }} />
                  Fee Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Check your fee payment status</p>
              </CardContent>
            </Card>
          </div>

        </main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
};

export default StudentDashboard;