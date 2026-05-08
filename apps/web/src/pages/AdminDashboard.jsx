import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, FileText, Bell, DollarSign, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import AdminLayout from '@/components/AdminLayout.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    admissionsTotal: 0,
    pendingFees: 0,
    noticesPosted: 0,
    totalFeeCollected: 0,
    totalFeePending: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsList = await pb.collection('students').getList(1, 5, {
          sort: '-created', $autoCancel: false
        });

        const admissionsRes = await pb.collection('admissions').getList(1, 5, {
          sort: '-created', $autoCancel: false
        });

        const noticesRes = await pb.collection('notices').getList(1, 5, {
          sort: '-created', $autoCancel: false
        });

        const allFees = await pb.collection('fees').getFullList({
          $autoCancel: false
        });

        const totalFeeCollected = allFees
          .filter(f => f.status === 'Paid')
          .reduce((sum, f) => sum + (f.amount || 0), 0);

        const totalFeePending = allFees
          .filter(f => f.status === 'Pending')
          .reduce((sum, f) => sum + (f.amount || 0), 0);

        setStats({
          totalStudents: studentsList.totalItems,
          admissionsTotal: admissionsRes.totalItems,
          pendingFees: allFees.filter(f => f.status === 'Pending').length,
          noticesPosted: noticesRes.totalItems,
          totalFeeCollected,
          totalFeePending,
        });

        setRecentStudents(studentsList.items);
        setRecentAdmissions(admissionsRes.items);
        setRecentNotices(noticesRes.items);

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass, onClick }) => (
    <Card
      className={`shadow-lg shadow-blue-900/5 border-0 ${onClick ? 'cursor-pointer hover:shadow-xl transition-all' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColorClass}`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
          <span className="text-3xl font-bold text-slate-800">
            {loading ? <Skeleton className="h-8 w-16" /> : value}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-600">{title}</div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard - Admin Panel</title>
      </Helmet>

      <div className="space-y-8 pb-10">

        {/* Stats Row 1 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            colorClass="text-[#1A3C8F]"
            bgColorClass="bg-[#EAF0FB]"
            onClick={() => navigate('/admin/students')}
          />
          <StatCard
            title="Total Admissions"
            value={stats.admissionsTotal}
            icon={FileText}
            colorClass="text-green-600"
            bgColorClass="bg-green-50"
            onClick={() => navigate('/admin/admissions')}
          />
          <StatCard
            title="Pending Fee Records"
            value={stats.pendingFees}
            icon={DollarSign}
            colorClass="text-destructive"
            bgColorClass="bg-destructive/10"
            onClick={() => navigate('/admin/fees')}
          />
          <StatCard
            title="Notices Posted"
            value={stats.noticesPosted}
            icon={Bell}
            colorClass="text-[#F5A623]"
            bgColorClass="bg-[#FEF3E2]"
            onClick={() => navigate('/admin/notices')}
          />
        </div>

        {/* Fee Summary Row */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg shadow-blue-900/5 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 mb-1">Total Fee Collected</div>
                <div className="text-3xl font-bold text-green-600">
                  {loading ? <Skeleton className="h-8 w-32" /> : `₹${stats.totalFeeCollected.toLocaleString()}`}
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg shadow-blue-900/5 bg-gradient-to-br from-red-50 to-white cursor-pointer hover:shadow-xl transition-all"
            onClick={() => navigate('/admin/fees')}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 mb-1">Total Fee Pending</div>
                <div className="text-3xl font-bold text-red-500">
                  {loading ? <Skeleton className="h-8 w-32" /> : `₹${stats.totalFeePending.toLocaleString()}`}
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Recent Students */}
          <Card className="shadow-lg shadow-blue-900/5 border-0 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b pb-4 pt-5 px-6 rounded-t-xl">
              <CardTitle className="text-lg text-slate-800">Recent Students</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={() => navigate('/admin/students')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Class</th>
                    <th className="px-6 py-3">Roll No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={3} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td></tr>
                    ))
                  ) : recentStudents.length > 0 ? (
                    recentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{student.name || 'N/A'}</td>
                        <td className="px-6 py-4">Class {student.class}-{student.section}</td>
                        <td className="px-6 py-4 text-slate-500">{student.rollNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No students yet</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Recent Admissions */}
          <Card className="shadow-lg shadow-blue-900/5 border-0 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b pb-4 pt-5 px-6 rounded-t-xl">
              <CardTitle className="text-lg text-slate-800">Recent Admissions</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={() => navigate('/admin/admissions')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                  <tr>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Class</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={3} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td></tr>
                    ))
                  ) : recentAdmissions.length > 0 ? (
                    recentAdmissions.map((admission) => (
                      <tr key={admission.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {admission.studentFirstName} {admission.studentLastName}
                        </td>
                        <td className="px-6 py-4">{admission.classApplyingFor}</td>
                        <td className="px-6 py-4">
                          <Badge className={
                            admission.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            admission.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {admission.status || 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No admissions yet</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Recent Notices */}
          <Card className="shadow-lg shadow-blue-900/5 border-0 lg:col-span-2 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b pb-4 pt-5 px-6 rounded-t-xl">
              <CardTitle className="text-lg text-slate-800">Recent Notices</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-primary" onClick={() => navigate('/admin/notices')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i}><td colSpan={3} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td></tr>
                    ))
                  ) : recentNotices.length > 0 ? (
                    recentNotices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{notice.title}</td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                            {notice.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(notice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No notices yet</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;