import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Save, Search, Plus, Edit } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient.js';

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkData, setBulkData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [manualForm, setManualForm] = useState({
    studentId: '', studentName: '', date: new Date().toISOString().split('T')[0],
    status: 'present', class: '', section: 'A', totalPresent: '', totalDays: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const classes = ['1','2','3','4','5','6','7','8'];
  const sections = ['A','B','C','D'];

  const fetchStudents = async () => {
    if (!selectedClass) { toast.error('Please select a class'); return; }
    setLoading(true);
    try {
      const { data: studentData, error } = await supabase
        .from('Students').select('id, name, roll_number')
        .eq('class', selectedClass).eq('section', selectedSection);
      if (error) throw error;

      const mapped = (studentData || []).map(s => ({
        id: s.id, name: s.name, rollNumber: s.roll_number?.toString()
      }));
      setStudents(mapped);

      const { data: existing } = await supabase.from('attendance').select('*')
        .eq('date', selectedDate).eq('class', selectedClass).eq('section', selectedSection);

      const map = {};
      const bulk = {};
      mapped.forEach(s => {
        const rec = (existing || []).find(a => a.student_id === s.id);
        map[s.id] = rec ? rec.status : 'present';
        bulk[s.id] = {
          present: rec?.total_present?.toString() || '',
          total: rec?.total_days?.toString() || ''
        };
      });
      setAttendance(map);
      setBulkData(bulk);
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.from('Students').select('id, name, class, section, roll_number')
      .then(({ data }) => setAllStudents(data || []));
  }, []);

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === 'present' ? 'absent' : 'present' }));
  };

  const markAll = (status) => {
    const m = {};
    students.forEach(s => { m[s.id] = status; });
    setAttendance(m);
  };

  const saveAttendance = async (records) => {
    const { data: existing } = await supabase.from('attendance').select('*')
      .eq('date', selectedDate).eq('class', selectedClass).eq('section', selectedSection);
    for (const rec of records) {
      const found = (existing || []).find(r => r.student_id === rec.student_id);
      if (found) await supabase.from('attendance').update(rec).eq('id', found.id);
      else await supabase.from('attendance').insert([rec]);
    }
  };

  const handleSaveToggle = async () => {
    if (!students.length) { toast.error('No students loaded'); return; }
    setSaving(true);
    try {
      const records = students.map(s => ({
        student_id: s.id, student_name: s.name,
        date: selectedDate, status: attendance[s.id] || 'present',
        class: selectedClass, section: selectedSection,
        total_present: 0, total_days: 1,
        attendance_percentage: attendance[s.id] === 'present' ? 100 : 0
      }));
      await saveAttendance(records);
      const p = records.filter(r => r.status === 'present').length;
      toast.success(`Saved! ${p}/${students.length} present`);
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBulk = async () => {
    if (!students.length) { toast.error('No students loaded'); return; }
    setSaving(true);
    try {
      const records = students.map(s => {
        const present = parseInt(bulkData[s.id]?.present || '0');
        const total = parseInt(bulkData[s.id]?.total || '0');
        const pct = total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0;
        return {
          student_id: s.id, student_name: s.name,
          date: selectedDate, status: present > 0 ? 'present' : 'absent',
          class: selectedClass, section: selectedSection,
          total_present: present, total_days: total, attendance_percentage: pct
        };
      });
      await saveAttendance(records);
      toast.success('Attendance with totals saved!');
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.studentId) { toast.error('Please select student'); return; }
    setSubmitting(true);
    try {
      const present = parseInt(manualForm.totalPresent || '0');
      const total = parseInt(manualForm.totalDays || '1');
      await supabase.from('attendance').insert([{
        student_id: manualForm.studentId, student_name: manualForm.studentName,
        date: manualForm.date, status: manualForm.status,
        class: manualForm.class, section: manualForm.section,
        total_present: present, total_days: total,
        attendance_percentage: total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0
      }]);
      toast.success('Record added');
      setIsModalOpen(false);
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNumber?.includes(searchTerm)
  );
  const presentCount = Object.values(attendance).filter(s => s === 'present').length;
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="h-11 px-6 border-[#1A3C8F] text-[#1A3C8F]">
            <Plus className="w-4 h-4 mr-2" /> Add Manual Record
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2"><Label>Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date</Label>
                <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
              <div className="space-y-2"><Label className="opacity-0">Load</Label>
                <Button onClick={fetchStudents} disabled={loading} className="w-full bg-[#1A3C8F] hover:bg-[#152e6e]">
                  {loading ? 'Loading...' : 'Load Students'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {students.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Class {selectedClass}-{selectedSection} — {selectedDate}</CardTitle>
                  <div className="flex gap-3 mt-2">
                    <span className="text-sm text-green-600 font-medium">{presentCount} Present</span>
                    <span className="text-sm text-red-500 font-medium">{absentCount} Absent</span>
                    <span className="text-sm text-slate-500">{students.length} Total</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {!isBulkMode && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => markAll('present')} className="text-green-600 border-green-200">All Present</Button>
                      <Button variant="outline" size="sm" onClick={() => markAll('absent')} className="text-red-500 border-red-200">All Absent</Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setIsBulkMode(!isBulkMode)} className="text-[#1A3C8F] border-[#1A3C8F]">
                    <Edit className="w-3 h-3 mr-1" />
                    {isBulkMode ? 'Present/Absent Mode' : 'Enter Days Mode'}
                  </Button>
                </div>
              </div>

              <div className={`mt-3 p-3 rounded-lg text-xs font-medium ${isBulkMode ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                {isBulkMode
                  ? '📊 Days Mode: Har student ke liye kitne din aaye aur total din bhar do — percentage apne aap calculate hoga'
                  : '✅ Present/Absent Mode: Student ke naam par click karo — aaj ki attendance lagao'}
              </div>

              <div className="relative mt-3">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search student..." className="pl-9 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {isBulkMode ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-3 pb-2 text-xs font-semibold text-slate-500 border-b">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Student</div>
                    <div className="col-span-3 text-center">Aaye Din</div>
                    <div className="col-span-3 text-center">Kul Din</div>
                  </div>
                  {filtered.map(student => {
                    const p = parseInt(bulkData[student.id]?.present || '0');
                    const t = parseInt(bulkData[student.id]?.total || '0');
                    const pct = t > 0 ? ((p / t) * 100).toFixed(0) : null;
                    return (
                      <div key={student.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                        <div className="col-span-1 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs">{student.rollNumber || '#'}</div>
                        <div className="col-span-5">
                          <div className="font-medium text-sm">{student.name}</div>
                          {pct !== null && (
                            <div className={`text-xs font-medium ${parseInt(pct) >= 75 ? 'text-green-600' : 'text-red-500'}`}>{pct}%</div>
                          )}
                        </div>
                        <div className="col-span-3">
                          <Input type="number" min="0" placeholder="22" value={bulkData[student.id]?.present || ''}
                            onChange={e => setBulkData(p => ({ ...p, [student.id]: { ...p[student.id], present: e.target.value } }))}
                            className="h-9 text-sm text-center" />
                        </div>
                        <div className="col-span-3">
                          <Input type="number" min="0" placeholder="26" value={bulkData[student.id]?.total || ''}
                            onChange={e => setBulkData(p => ({ ...p, [student.id]: { ...p[student.id], total: e.target.value } }))}
                            className="h-9 text-sm text-center" />
                        </div>
                      </div>
                    );
                  })}
                  <Button onClick={handleSaveBulk} disabled={saving} className="w-full mt-4 h-12 bg-[#1A3C8F] hover:bg-[#152e6e]">
                    <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Attendance with Totals'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(student => (
                    <div key={student.id} onClick={() => toggleAttendance(student.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all select-none ${attendance[student.id] === 'present' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${attendance[student.id] === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {student.rollNumber || '#'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{student.name}</div>
                          <div className="text-xs text-slate-500">Roll: {student.rollNumber}</div>
                        </div>
                      </div>
                      <Badge className={attendance[student.id] === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>
                        {attendance[student.id] === 'present' ? <><CheckCircle className="w-3 h-3 mr-1" />Present</> : <><XCircle className="w-3 h-3 mr-1" />Absent</>}
                      </Badge>
                    </div>
                  ))}
                  <Button onClick={handleSaveToggle} disabled={saving} className="w-full mt-4 h-12 bg-[#1A3C8F] hover:bg-[#152e6e]">
                    <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Attendance'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Add Manual Attendance Record</DialogTitle></DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4 py-2">
            <div className="space-y-2"><Label>Select Student</Label>
              <Select value={manualForm.studentId} onValueChange={v => {
                const s = allStudents.find(s => s.id === v);
                setManualForm(p => ({ ...p, studentId: v, studentName: s?.name || '', class: s?.class || '', section: s?.section || 'A' }));
              }}>
                <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>{allStudents.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — Class {s.class}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date</Label>
                <Input type="date" value={manualForm.date} onChange={e => setManualForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={manualForm.status} onValueChange={v => setManualForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="absent">Absent</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Present Days </Label>
                <Input type="number" min="0" placeholder="e.g. 22" value={manualForm.totalPresent} onChange={e => setManualForm(p => ({ ...p, totalPresent: e.target.value }))} />
              </div>
              <div className="space-y-2"><Label>Total School Days</Label>
                <Input type="number" min="0" placeholder="e.g. 26" value={manualForm.totalDays} onChange={e => setManualForm(p => ({ ...p, totalDays: e.target.value }))} />
              </div>
            </div>
            {manualForm.totalPresent && manualForm.totalDays && parseInt(manualForm.totalDays) > 0 && (
              <div className={`p-3 rounded-lg text-sm font-medium text-center ${(parseInt(manualForm.totalPresent) / parseInt(manualForm.totalDays)) >= 0.75 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                Attendance: {((parseInt(manualForm.totalPresent) / parseInt(manualForm.totalDays)) * 100).toFixed(1)}%
                {(parseInt(manualForm.totalPresent) / parseInt(manualForm.totalDays)) >= 0.75 ? ' ✅ Good' : ' ⚠️ Below 75%'}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">{submitting ? 'Saving...' : 'Add Record'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AttendanceManagement;