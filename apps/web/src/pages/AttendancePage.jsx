import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

const AttendancePage = () => {
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!currentUser) return;

      try {
        const [month, year] = selectedMonth.split(' ');
        const records = await pb.collection('attendance').getFullList({
          filter: `studentId = "${currentUser.id}" && month = "${month}" && year = ${year}`,
          $autoCancel: false
        });

        if (records.length > 0) {
          setAttendanceData(records[0]);
        } else {
          setAttendanceData(null);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [currentUser, selectedMonth]);

  const getDaysInMonth = (monthYear) => {
    const [month, year] = monthYear.split(' ');
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const getAttendanceStatus = (day) => {
    if (!attendanceData?.attendanceData) return 'none';
    const dayData = attendanceData.attendanceData[day];
    if (!dayData) return 'none';
    return dayData.status || 'none';
  };

  const getStatusColor = (status) => {
    const colors = {
      'present': 'bg-green-500',
      'absent': 'bg-red-500',
      'holiday': 'bg-gray-400',
      'half-day': 'bg-yellow-500',
      'none': 'bg-gray-200'
    };
    return colors[status] || colors['none'];
  };

  const daysInMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const attendancePercentage = attendanceData?.attendancePercentage || 0;
  const totalPresent = attendanceData?.totalPresent || 0;
  const totalAbsent = attendanceData?.totalAbsent || 0;
  const totalHolidays = attendanceData?.totalHolidays || 0;

  return (
    <>
      <Helmet>
        <title>Attendance - Student Portal</title>
        <meta name="description" content="View your monthly attendance records" />
      </Helmet>

      <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Attendance</h1>
            <p className="text-muted-foreground">View your monthly attendance records</p>
          </div>

          {/* Month Selector */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Select Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="April 2025">April 2025</SelectItem>
                    <SelectItem value="May 2025">May 2025</SelectItem>
                    <SelectItem value="June 2025">June 2025</SelectItem>
                    <SelectItem value="July 2025">July 2025</SelectItem>
                    <SelectItem value="August 2025">August 2025</SelectItem>
                    <SelectItem value="September 2025">September 2025</SelectItem>
                    <SelectItem value="October 2025">October 2025</SelectItem>
                    <SelectItem value="November 2025">November 2025</SelectItem>
                    <SelectItem value="December 2025">December 2025</SelectItem>
                    <SelectItem value="January 2026">January 2026</SelectItem>
                    <SelectItem value="February 2026">February 2026</SelectItem>
                    <SelectItem value="March 2026">March 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading attendance...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Calendar Grid */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Attendance Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                      const status = getAttendanceStatus(day);
                      return (
                        <div
                          key={day}
                          className="aspect-square flex items-center justify-center rounded-lg border relative"
                        >
                          <span className="text-sm font-medium">{day}</span>
                          <div className={`absolute bottom-1 w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm font-medium mb-3">Legend</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Absent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-sm">Holiday</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Half Day</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Present</div>
                      <div className="text-2xl font-bold text-green-600">{totalPresent}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Absent</div>
                      <div className="text-2xl font-bold text-red-600">{totalAbsent}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Holidays</div>
                      <div className="text-2xl font-bold text-gray-600">{totalHolidays}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Attendance</div>
                      <div className="text-2xl font-bold" style={{ color: '#1A3C8F' }}>
                        {attendancePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {attendancePercentage < 75 && (
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-900 mb-1">
                          Attendance below 75%
                        </div>
                        <p className="text-sm text-yellow-800">
                          Please contact your class teacher to improve attendance
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Download Button */}
              <Button className="w-full sm:w-auto" style={{ backgroundColor: '#1A3C8F' }}>
                <Download className="w-4 h-4 mr-2" />
                Download Attendance PDF
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendancePage;