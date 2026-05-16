import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ShieldAlert, Users, Key, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient.js';

const StudentsManagement = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [resetRequests, setResetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '', rollNumber: '', class: '', section: 'A',
    email: '', password: '', fatherName: '', motherName: '',
    fatherMobile: '', medium: 'Hindi'
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let query = supabase.from('Students').select('*');
      if (searchTerm) query = query.ilike('name', `%${searchTerm}%`);
      query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      const { data, error } = await query;
      if (error) throw error;
      setStudents((data || []).map(s => ({
        id: s.id, name: s.name,
        rollNumber: s.roll_number?.toString(),
        email: s.email, password: s.password,
        class: s.class, section: s.section,
        fatherName: s.father_name, motherName: s.mother_name,
        fatherMobile: s.father_mobile, medium: s.medium,
      })));
    } catch (err) {
      toast.error('Failed to fetch students: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResetRequests = async () => {
    const { data } = await supabase.from('password_reset_requests').select('*').eq('status', 'Pending');
    setResetRequests(data || []);
  };

  useEffect(() => { fetchStudents(); }, [searchTerm, page]);
  useEffect(() => { fetchResetRequests(); }, []);

  const openAddModal = () => {
    setFormData({ name: '', rollNumber: '', class: '', section: 'A', email: '', password: '', fatherName: '', motherName: '', fatherMobile: '', medium: 'Hindi' });
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setSelectedStudent(s);
    setFormData({ name: s.name, rollNumber: s.rollNumber, class: s.class, section: s.section, email: s.email, password: '', fatherName: s.fatherName || '', motherName: s.motherName || '', fatherMobile: s.fatherMobile || '', medium: s.medium || 'Hindi' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSave = {
        name: formData.name, roll_number: formData.rollNumber,
        email: formData.email, class: formData.class, section: formData.section,
        father_name: formData.fatherName, mother_name: formData.motherName,
        father_mobile: formData.fatherMobile, medium: formData.medium,
      };
      if (selectedStudent) {
        if (formData.password) dataToSave.password = formData.password;
        const { error } = await supabase.from('Students').update(dataToSave).eq('id', selectedStudent.id);
        if (error) throw error;
        toast.success('Student updated!');
      } else {
        dataToSave.password = formData.password || 'password123';
        const { error } = await supabase.from('Students').insert([dataToSave]);
        if (error) throw error;
        toast.success(`Student added! Email: ${formData.email} | Password: ${dataToSave.password}`);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase.from('Students').delete().eq('id', selectedStudent.id);
      if (error) throw error;
      toast.success('Student deleted');
      setIsDeleteDialogOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    setSubmitting(true);
    try {
      const studentId = selectedRequest?.student_id || selectedStudent?.id;
      const { error } = await supabase.from('Students').update({ password: newPassword }).eq('id', studentId);
      if (error) throw error;
      if (selectedRequest) {
        await supabase.from('password_reset_requests').update({ status: 'Done' }).eq('id', selectedRequest.id);
        fetchResetRequests();
      }
      toast.success('Password reset successfully!');
      setIsResetModalOpen(false);
      setNewPassword('');
      setSelectedRequest(null);
      fetchStudents();
    } catch (err) {
      toast.error('Failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Students Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6 bg-[#1A3C8F] hover:bg-[#152e6e]">
            <Plus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant={activeTab === 'students' ? 'default' : 'outline'} onClick={() => setActiveTab('students')} className={activeTab === 'students' ? 'bg-[#1A3C8F]' : ''}>
            <Users className="w-4 h-4 mr-2" /> All Students
          </Button>
          <Button variant={activeTab === 'reset' ? 'default' : 'outline'} onClick={() => setActiveTab('reset')} className={activeTab === 'reset' ? 'bg-orange-500' : 'text-orange-600 border-orange-300'}>
            <Key className="w-4 h-4 mr-2" /> Password Reset Requests
            {resetRequests.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">{resetRequests.length}</span>}
          </Button>
        </div>

        {activeTab === 'students' && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name..." className="pl-9 h-11" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(0); }} />
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Roll No</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading...</td></tr>
                    ) : students.length > 0 ? students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-600">{s.rollNumber}</td>
                        <td className="px-6 py-4 font-medium">{s.name}</td>
                        <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700">Class {s.class}-{s.section}</Badge></td>
                        <td className="px-6 py-4 text-slate-600 text-xs">{s.email}</td>
                        <td className="px-6 py-4 text-slate-600">{s.fatherMobile || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent(s); setSelectedRequest(null); setIsResetModalOpen(true); }}>
                            <Key className="w-4 h-4 text-orange-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(s)}>
                            <Edit className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent(s); setIsDeleteDialogOpen(true); }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} className="text-center py-16">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-slate-500">No students found</p>
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-6">
                <span className="text-sm text-muted-foreground">Page {page + 1}</span>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <Button variant="outline" disabled={students.length < PAGE_SIZE} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reset' && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Password Reset Requests</h2>
                <Button variant="outline" size="sm" onClick={fetchResetRequests}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
              </div>
              {resetRequests.length === 0 ? (
                <div className="text-center py-16"><Key className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No pending requests</p></div>
              ) : resetRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-orange-100 bg-orange-50 mb-3">
                  <div>
                    <div className="font-semibold">{req.student_name}</div>
                    <div className="text-sm text-slate-500">{req.student_email}</div>
                  </div>
                  <Button onClick={() => { setSelectedRequest(req); setSelectedStudent(null); setIsResetModalOpen(true); }} className="bg-orange-500 hover:bg-orange-600" size="sm">
                    <Key className="w-4 h-4 mr-2" />Reset Password
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name *</Label><Input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Roll Number *</Label><Input required value={formData.rollNumber} onChange={e => setFormData(p => ({ ...p, rollNumber: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Class *</Label>
                <Select value={formData.class} onValueChange={v => setFormData(p => ({ ...p, class: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>{[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Section</Label>
                <Select value={formData.section} onValueChange={v => setFormData(p => ({ ...p, section: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['A','B','C','D'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Father's Name</Label><Input value={formData.fatherName} onChange={e => setFormData(p => ({ ...p, fatherName: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Contact Number</Label><Input value={formData.fatherMobile} onChange={e => setFormData(p => ({ ...p, fatherMobile: e.target.value }))} /></div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-semibold text-blue-800 mb-3">Login Credentials</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email *</Label><Input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="student@gmail.com" /></div>
                <div className="space-y-2"><Label>{selectedStudent ? 'New Password (blank = keep)' : 'Password *'}</Label><Input type="password" required={!selectedStudent} minLength={6} value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" /></div>
              </div>
              {!selectedStudent && <p className="text-xs text-blue-600 mt-2">Default: "password123" if blank</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">{submitting ? 'Saving...' : 'Save Student'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="w-5 h-5" />Confirm Deletion</DialogTitle>
            <DialogDescription>Delete <strong>{selectedStudent?.name}</strong>? Cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-orange-500" />Reset Password</DialogTitle></DialogHeader>
          <div className="py-2 space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-semibold">{selectedRequest?.student_name || selectedStudent?.name}</p>
              <p className="text-sm text-slate-500">{selectedRequest?.student_email || selectedStudent?.email}</p>
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="text" placeholder="Min 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsResetModalOpen(false); setNewPassword(''); }}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={submitting} className="bg-orange-500 hover:bg-orange-600">{submitting ? 'Resetting...' : 'Reset Password'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StudentsManagement;