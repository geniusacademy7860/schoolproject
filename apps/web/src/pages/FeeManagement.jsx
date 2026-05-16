import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, DollarSign, Search } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient.js';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const emptyForm = {
    studentId: '', studentName: '', class: '',
    feeType: 'Tuition Fee', amount: '',
    month: '', year: new Date().getFullYear().toString(),
    status: 'Pending', paidDate: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  const feeTypes = ['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Sports Fee', 'Library Fee', 'Other'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const fetchFees = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('fees').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Fees load error: ' + error.message);
    setFees(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFees();
    supabase.from('Students').select('id, name, class, roll_number').order('name')
      .then(({ data, error }) => {
        if (error) toast.error('Students load error: ' + error.message);
        setStudents(data || []);
      });
  }, []);

  const openEditModal = (f) => {
    setSelectedFee(f);
    setFormData({
      studentId: f.student_id || '', studentName: f.student_name || '',
      class: f.class || '', feeType: f.fee_type || 'Tuition Fee',
      amount: f.amount?.toString() || '', month: f.month || '',
      year: f.year || new Date().getFullYear().toString(),
      status: f.status || 'Pending', paidDate: f.paid_date || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) { toast.error('Please select a student'); return; }
    if (!formData.amount) { toast.error('Please enter amount'); return; }
    setSubmitting(true);
    try {
      const save = {
        student_id: formData.studentId,
        student_name: formData.studentName,
        class: formData.class,
        fee_type: formData.feeType,
        amount: parseFloat(formData.amount),
        month: formData.month || null,
        year: formData.year,
        status: formData.status,
        paid_date: formData.paidDate || null,
      };
      if (selectedFee) {
        const { error } = await supabase.from('fees').update(save).eq('id', selectedFee.id);
        if (error) throw error;
        toast.success('Fee updated');
      } else {
        const { error } = await supabase.from('fees').insert([save]);
        if (error) throw error;
        toast.success('Fee record added');
      }
      setIsModalOpen(false);
      fetchFees();
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    const { error } = await supabase.from('fees').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); fetchFees(); }
    else toast.error('Failed: ' + error.message);
  };

  const handleMarkPaid = async (fee) => {
    const { error } = await supabase.from('fees').update({
      status: 'Paid', paid_date: new Date().toISOString().split('T')[0]
    }).eq('id', fee.id);
    if (!error) { toast.success('Marked as paid'); fetchFees(); }
    else toast.error('Failed: ' + error.message);
  };

  const filtered = fees.filter(f =>
    (f.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'All' || f.status === filterStatus)
  );
  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((s, f) => s + (f.amount || 0), 0);
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
          <Button onClick={() => { setSelectedFee(null); setFormData(emptyForm); setIsModalOpen(true); }} className="h-11 px-6 bg-[#1A3C8F] hover:bg-[#152e6e]">
            <Plus className="w-4 h-4 mr-2" /> Add Fee Record
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">Rs.{totalCollected.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">Total Collected</div>
          </CardContent></Card>
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">Rs.{totalPending.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">Total Pending</div>
          </CardContent></Card>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by student name..." className="pl-9 h-11" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
              : filtered.length === 0 ? <div className="text-center py-16"><DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No fee records</p></div>
              : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Class</th>
                        <th className="px-6 py-4">Fee Type</th>
                        <th className="px-6 py-4">Month</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium">{f.student_name}</td>
                          <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700">Class {f.class}</Badge></td>
                          <td className="px-6 py-4">{f.fee_type}</td>
                          <td className="px-6 py-4">{f.month} {f.year}</td>
                          <td className="px-6 py-4 font-semibold">Rs.{f.amount?.toLocaleString()}</td>
                          <td className="px-6 py-4"><Badge className={f.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>{f.status}</Badge></td>
                          <td className="px-6 py-4 text-right">
                            {f.status === 'Pending' && (
                              <Button variant="outline" size="sm" className="mr-2 text-green-600 border-green-200 h-8" onClick={() => handleMarkPaid(f)}>Mark Paid</Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(f)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{selectedFee ? 'Edit Fee' : 'Add Fee Record'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2"><Label>Student *</Label>
              <Select value={formData.studentId} onValueChange={v => {
                const s = students.find(s => s.id === v);
                setFormData(p => ({ ...p, studentId: v, studentName: s?.name || '', class: s?.class || '' }));
              }}>
                <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>
                  {students.length === 0
                    ? <SelectItem value="_none" disabled>No students found</SelectItem>
                    : students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — Class {s.class}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Fee Type</Label>
                <Select value={formData.feeType} onValueChange={v => setFormData(p => ({ ...p, feeType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{feeTypes.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Amount (Rs.) *</Label>
                <Input type="number" required min="0" step="0.01" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 1500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Month</Label>
                <Select value={formData.month} onValueChange={v => setFormData(p => ({ ...p, month: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                  <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Year</Label>
                <Input value={formData.year} onChange={e => setFormData(p => ({ ...p, year: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">{submitting ? 'Saving...' : selectedFee ? 'Update' : 'Add Fee'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FeeManagement;