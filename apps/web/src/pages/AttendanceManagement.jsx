import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Save, Search, Plus } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // Manual add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [manualForm, setManualForm] = useState({
    studentId: '',
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    class: '',
    section: 'A'
  });
  const [submitting, setSubmitting] = useState(false);

  const classes = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  const sections = ['A','B','C','D'];

  const fetchStudents = async () => {
    if (!selectedClass) { toast.error('Please select a class first'); return; }
    setLoading(true);
    try {
      const records = await pb.collection('Student').getFullList({
        filter: `class = "${selectedClass}" && section = "${selectedSection}"`,
        sort: 'rollNumber',
        $autoCancel: false
      });
      setStudents(records);

      // Check existing attendance for this date — using correct field names
      const existingAttendance = await pb.collection('Attendance').getFullList({
        filter: `date >= "${selectedDate} 00:00:00" && date <= "${selectedDate} 23:59:59"`,
        $autoCancel: false
      });

      const attendanceMap = {};
      records.forEach(student => {
        const existing = existingAttendance.find(a => a.studentId === student.id);
        attendanceMap[student.id] = existing ? existing.status : 'present';
      });
      setAttendance(attendanceMap);

    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const records = await pb.collection('Student').getFullList({ sort: 'name', $autoCancel: false });
      setAllStudents(records);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchAllStudents(); }, []);

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
    }));
  };

  const markAll = (status) => {
    const newAttendance = {};
    students.forEach(s => { newAttendance[s.id] = status; });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (students.length === 0) { toast.error('No students to save'); return; }
    setSaving(true);
    try {
      const existingRecords = await pb.collection('Attendance').getFullList({
        filter: `date >= "${selectedDate} 00:00:00" && date <= "${selectedDate} 23:59:59"`,
        $autoCancel: false
      });

      const presentCount = Object.values(attendance).filter(s => s === 'present').length;

      for (const student of students) {
        const status = attendance[student.id] || 'present';
        const existing = existingRecords.find(r => r.studentId === student.id);

        const allAttendance = await pb.collection('Attendance').getFullList({
          filter: `studentId = "${student.id}"`,
          $autoCancel: false
        });

        const totalPresent = allAttendance.filter(r => r.status === 'present').length + (status === 'present' ? 1 : 0);
        const totalDays = allAttendance.length + 1;
        const attendancePercentage = parseFloat(((totalPresent / totalDays) * 100).toFixed(1));

        // Using exact PocketBase field names
        const data = {
          studentId: student.id,
          studentName: student.name,
          date: `${selectedDate} 00:00:00`,
          status: status,
          class: selectedClass,
          section: selectedSection,
          totalPresent: totalPresent,
          totalDays,
          attendancePercentage
        };

        if (existing) {
          await pb.collection('Attendance').update(existing.id, data, { $autoCancel: false });
        } else {
          await pb.collection('Attendance').create(data, { $autoCancel: false });
        }
      }
      toast.success(`Attendance saved! ${presentCount}/${students.length} present`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        studentId: manualForm.studentId,
        studentName: manualForm.studentName,
        date: `${manualForm.date} 00:00:00`,
        status: manualForm.status,
        class: manualForm.class,
        section: manualForm.section,
        totalPresent: 0,
        totalDays: 1,
        attendancePercentage: manualForm.status === 'present' ? 100 : 0
      };
      await pb.collection('Attendance').create(data, { $autoCancel: false });
      toast.success('Attendance record added');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add attendance record');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="h-11 px-6 border-[#1A3C8F] text-[#1A3C8F]"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Manual Record
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="opacity-0">Load</Label>
                <Button onClick={fetchStudents} disabled={loading} className="w-full bg-[#1A3C8F] hover:bg-[#152e6e]">
                  {loading ? 'Loading...' : 'Load Students'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        {students.length > 0 && (
          <Card className="border-0 shadow-lg shadow-blue-900/5">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-base">
                    Class {selectedClass}-{selectedSection} — {new Date(selectedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </CardTitle>
                  <div className="flex gap-3 mt-2">
                    <span className="text-sm text-green-600 font-medium">{presentCount} Present</span>
                    <span className="text-sm text-red-500 font-medium">{absentCount} Absent</span>
                    <span className="text-sm text-slate-500">{students.length} Total</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => markAll('present')} className="text-green-600 border-green-200">All Present</Button>
                  <Button variant="outline" size="sm" onClick={() => markAll('absent')} className="text-red-500 border-red-200">All Absent</Button>
                </div>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search student..." className="pl-9 h-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => toggleAttendance(student.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      attendance[student.id] === 'present' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        attendance[student.id] === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {student.rollNumber || '#'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{student.name}</div>
                        <div className="text-xs text-slate-500">Roll: {student.rollNumber}</div>
                      </div>
                    </div>
                    <Badge className={attendance[student.id] === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>
                      {attendance[student.id] === 'present'
                        ? <><CheckCircle className="w-3 h-3 mr-1" />Present</>
                        : <><XCircle className="w-3 h-3 mr-1" />Absent</>
                      }
                    </Badge>
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full mt-6 h-12 text-base bg-[#1A3C8F] hover:bg-[#152e6e]">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Attendance'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Manual Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Manual Attendance Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select
                value={manualForm.studentId}
                onValueChange={(v) => {
                  const student = allStudents.find(s => s.id === v);
                  setManualForm({
                    ...manualForm,
                    studentId: v,
                    studentName: student?.name || '',
                    class: student?.class || '',
                    section: student?.section || 'A'
                  });
                }}
              >
                <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>
                  {allStudents.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — Class {s.class} (Roll: {s.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={manualForm.date} onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={manualForm.status} onValueChange={(v) => setManualForm({ ...manualForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">
                {submitting ? 'Saving...' : 'Add Record'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default AttendanceManagement;