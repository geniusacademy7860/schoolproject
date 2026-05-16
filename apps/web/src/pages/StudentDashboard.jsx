import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Award, Bell, User, LogOut,
  Menu, X, FileText, TrendingUp, DollarSign,
  CheckCircle, XCircle, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendancePercent: 0,
    presentDays: 0,
    totalDays: 0,
    lastRank: null,
    pendingFee: 0,
    paidFee: 0,
  });
  const [notices, setNotices] = useState([]);
  const [recentResult, setRecentResult] = useState(null);

  // Security — If the student is not logged in, redirect them to the student login page.
  useEffect(() => {
    if (!currentUser) {
      navigate('/student-login');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchAll = async () => {
      try {
        // --- Attendance ---
        const { data: attData } = await supabase
          .from('attendance')
          .select('status, total_present, total_days, attendance_percentage')
          .eq('student_id', currentUser.id)
          .order('date', { ascending: false })
          .limit(1);

        if (attData && attData.length > 0) {
          const rec = attData[0];
          setStats(prev => ({
            ...prev,
            attendancePercent: rec.attendance_percentage || 0,
            presentDays: rec.total_present || 0,
            totalDays: rec.total_days || 0,
          }));
        }

        // --- Results ---
        const { data: resultData } = await supabase
          .from('results')
          .select('*')
          .eq('student_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (resultData && resultData.length > 0) {
          setRecentResult(resultData[0]);
          setStats(prev => ({ ...prev, lastRank: resultData[0].rank || null }));
        }

        // --- Fees ---
        const { data: feeData } = await supabase
          .from('fees')
          .select('amount, status')
          .eq('student_id', currentUser.id);

        if (feeData) {
          const pending = feeData
            .filter(f => f.status === 'Pending')
            .reduce((s, f) => s + (f.amount || 0), 0);
          const paid = feeData
            .filter(f => f.status === 'Paid')
            .reduce((s, f) => s + (f.amount || 0), 0);
          setStats(prev => ({ ...prev, pendingFee: pending, paidFee: paid }));
        }

        // --- Notices ---
        const { data: noticeData } = await supabase
          .from('notices')
          .select('*')
          .order('date', { ascending: false })
          .limit(4);
        setNotices(noticeData || []);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/student-login');
  };

  // Sidebar menu — Student-only pages
  const menuItems = [
    { icon: User, label: 'Dashboard', path: '/student-dashboard' },
    { icon: Calendar, label: 'Attendance', path: '/attendance' },
    { icon: Award, label: 'Results', path: '/results' },
    { icon: DollarSign, label: 'Fees', path: '/fees' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const getResultGrade = (r) => {
    if (!r) return null;
    const subs = ['hindi', 'english', 'mathematics', 'science', 'social_science'];
    const total = subs.reduce((s, k) => s + (r[k] || 0), 0);
    const max = subs.reduce((s, k) => s + (r[`${k}_total`] || 100), 0);
    const pct = max > 0 ? (total / max) * 100 : 0;
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    return { grade, pct: pct.toFixed(0), total, max };
  };

  if (!currentUser) return null;

  const attGood = parseFloat(stats.attendancePercent) >= 75;
  const resultInfo = getResultGrade(recentResult);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A3C8F] z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="font-bold text-white text-sm">Student Portal</div>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg text-white">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ width: '240px', backgroundColor: '#1A3C8F' }}
      >
        {/* Student Info */}
        <div className="p-5 border-b border-white/10 mt-0 lg:mt-0">
          <div className="hidden lg:block mb-4">
            <div className="font-bold text-white text-base">Student Portal</div>
            <div className="text-white/60 text-xs">Genius Academy Forbesganj</div>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-lg">
              {currentUser.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{currentUser.name}</div>
              <div className="text-white/60 text-xs">
                Class {currentUser.class}-{currentUser.section}
              </div>
              <div className="text-white/50 text-xs">Roll: {currentUser.rollNumber}</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-[#1A3C8F]'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-red-500/20 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-60 pt-20 lg:pt-0 p-4 sm:p-6">

        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-5 sm:p-6 mb-6 text-white"
          style={{ background: 'linear-gradient(135deg, #1A3C8F 0%, #2563eb 100%)' }}
        >
          <div className="text-xs text-white/70 mb-1">Welcome back 👋</div>
          <div className="text-xl sm:text-2xl font-bold">{currentUser.name}</div>
          <div className="text-white/80 text-sm mt-1">
            Class {currentUser.class} - Section {currentUser.section} | Roll No: {currentUser.rollNumber}
          </div>
          <div className="text-white/60 text-xs mt-1">{currentUser.email}</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">

          {/* Attendance */}
          <Card
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/attendance')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className={`text-2xl font-bold ${attGood ? 'text-green-600' : 'text-red-500'}`}>
                {loading ? '...' : `${stats.attendancePercent}%`}
              </div>
              <div className="text-xs text-slate-500">Attendance</div>
              <div className="text-xs text-slate-400">{stats.presentDays}/{stats.totalDays} days</div>
            </CardContent>
          </Card>

          {/* Present Days */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {loading ? '...' : stats.presentDays}
              </div>
              <div className="text-xs text-slate-500">Present Days</div>
              <div className="text-xs text-slate-400">This session</div>
            </CardContent>
          </Card>

          {/* Last Rank */}
          <Card
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/results')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {loading ? '...' : stats.lastRank ? `#${stats.lastRank}` : '-'}
              </div>
              <div className="text-xs text-slate-500">Last Rank</div>
              <div className="text-xs text-slate-400">In class</div>
            </CardContent>
          </Card>

          {/* Pending Fee */}
          <Card
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/fees')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-500" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div className={`text-2xl font-bold ${stats.pendingFee > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {loading ? '...' : `Rs.${stats.pendingFee.toLocaleString()}`}
              </div>
              <div className="text-xs text-slate-500">Fee Pending</div>
              <div className="text-xs text-slate-400">Paid: Rs.{stats.paidFee.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all hover:border-l-4 hover:border-l-[#1A3C8F]"
            onClick={() => navigate('/attendance')}
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1A3C8F]" /> View Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground">Check monthly attendance records</p>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all hover:border-l-4 hover:border-l-[#1A3C8F]"
            onClick={() => navigate('/results')}
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1A3C8F]" /> Download Report Card
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground">View and download exam results</p>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-md cursor-pointer hover:shadow-lg transition-all hover:border-l-4 hover:border-l-[#1A3C8F]"
            onClick={() => navigate('/fees')}
          >
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#1A3C8F]" /> Fee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-muted-foreground">Check your fee payment status</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Result */}
        {recentResult && resultInfo && (
          <Card className="border-0 shadow-md mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#1A3C8F]" /> Latest Result
                </CardTitle>
                <button
                  onClick={() => navigate('/results')}
                  className="text-xs text-[#1A3C8F] hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <div className="font-medium text-sm">{recentResult.exam_name}</div>
                  <div className="text-xs text-slate-500">{recentResult.academic_year}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#1A3C8F]">{resultInfo.grade}</div>
                  <div className="text-xs text-slate-500">
                    {resultInfo.total}/{resultInfo.max} ({resultInfo.pct}%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notices — read only */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1A3C8F]" /> School Notices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="text-center py-4 text-slate-400 text-sm">Loading...</div>
            ) : notices.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm">No notices</div>
            ) : (
              <div className="space-y-3">
                {notices.map(n => (
                  <div key={n.id} className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{n.title}</span>
                          {n.is_important && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              Important
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.content}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                            {n.category}
                          </span>
                          <span className="text-xs text-slate-400">{n.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Alert */}
        {!loading && stats.totalDays > 0 && (
          <div className={`p-4 rounded-xl flex items-start gap-3 mb-6 ${
            attGood ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {attGood
              ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            }
            <div>
              <div className={`font-semibold text-sm ${attGood ? 'text-green-700' : 'text-red-700'}`}>
                {attGood ? 'Good Attendance!' : 'Attendance Warning!'}
              </div>
              <div className={`text-xs mt-0.5 ${attGood ? 'text-green-600' : 'text-red-600'}`}>
                {attGood
                  ? `Your attendance ${stats.attendancePercent}% It is. Very good – keep it that way!`
                  : `Your attendance ${stats.attendancePercent}% which is less than 75%. Please come to school!`
                }
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#EAF0FB] rounded-xl text-center">
          <div className="text-sm font-semibold text-[#1A3C8F]">Genius Academy Forbesganj</div>
          <div className="text-xs text-slate-600 mt-1">
            For any problem: <strong>+91 82980 68098</strong>
          </div>
        </div>

      </main>
    </div>
  );
};

export default StudentDashboard;