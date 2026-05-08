import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AttendancePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalDays: 0, presentDays: 0, absentDays: 0, percentage: 0 });

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('attendece').getFullList({
          filter: `studentId = "${currentUser.id}"`,
          sort: '-date',
          $autoCancel: false
        });
        setAttendanceRecords(records);
        const totalDays = records.length;
        const presentDays = records.filter(r => r.status === 'Present').length;
        const absentDays = totalDays - presentDays;
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
        setSummary({ totalDays, presentDays, absentDays, percentage });
      } catch (error) {
        toast.error('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [currentUser]);

  const getMonthName = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const groupedByMonth = attendanceRecords.reduce((acc, record) => {
    const month = getMonthName(record.date);
    if (!acc[month]) acc[month] = [];
    acc[month].push(record);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/student-dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Attendance</h1>
            <p className="text-sm text-slate-500">Track your daily attendance records</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#1A3C8F]">{summary.percentage}%</div>
            <div className="text-xs text-slate-500 mt-1">Attendance</div>
          </CardContent></Card>
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-700">{summary.totalDays}</div>
            <div className="text-xs text-slate-500 mt-1">Total Days</div>
          </CardContent></Card>
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{summary.presentDays}</div>
            <div className="text-xs text-slate-500 mt-1">Present</div>
          </CardContent></Card>
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{summary.absentDays}</div>
            <div className="text-xs text-slate-500 mt-1">Absent</div>
          </CardContent></Card>
        </div>

        <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${parseFloat(summary.percentage) >= 75 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <TrendingUp className={`w-5 h-5 ${parseFloat(summary.percentage) >= 75 ? 'text-green-600' : 'text-red-500'}`} />
          <div>
            <div className={`font-semibold text-sm ${parseFloat(summary.percentage) >= 75 ? 'text-green-700' : 'text-red-600'}`}>
              {parseFloat(summary.percentage) >= 75 ? 'Good Attendance!' : 'Attendance Below 75%'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {parseFloat(summary.percentage) >= 75 ? 'Keep it up! You are eligible for exams.' : 'Please improve your attendance.'}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading attendance...</div>
        ) : attendanceRecords.length === 0 ? (
          <Card className="border-0 shadow-lg"><CardContent className="py-20 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">No attendance records found</p>
          </CardContent></Card>
        ) : (
          Object.entries(groupedByMonth).map(([month, records]) => {
            const monthPresent = records.filter(r => r.status === 'Present').length;
            const monthPercent = ((monthPresent / records.length) * 100).toFixed(0);
            return (
              <Card key={month} className="border-0 shadow-md mb-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-slate-700">{month}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{monthPresent}/{records.length} days</span>
                      <Badge className={`text-xs ${parseFloat(monthPercent) >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {monthPercent}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {records.map((record) => (
                      <div key={record.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        record.status === 'Present' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {record.status === 'Present' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AttendancePage;