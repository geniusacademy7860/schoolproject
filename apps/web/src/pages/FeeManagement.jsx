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
import pb from '@/lib/pocketbaseClient.js';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [formData, setFormData] = useState({
    studentId: '', studentName: '', class: '',
    feeType: 'Tuition Fee', amount: '',
    month: '', year: new Date().getFullYear().toString(),
    status: 'Pending', paidDate: ''
  });

  const feeTypes = ['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Sports Fee', 'Library Fee', 'Other'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const fetchFees = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('Fees').getFullList({ sort: '-created', $autoCancel: false });
      setFees(records);
    } catch (error) {
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const records = await pb.collection('Student').getFullList({ sort: 'name', $autoCancel: false });
      setStudents(records);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  useEffect(() => { fetchFees(); fetchStudents(); }, []);

  const openAddModal = () => {
    setSelectedFee(null);
    setFormData({ studentId: '', studentName: '', class: '', feeType: 'Tuition Fee', amount: '', month: months[new Date().getMonth()], year: new Date().getFullYear().toString(), status: 'Pending', paidDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (fee) => {
    setSelectedFee(fee);
    setFormData({ studentId: fee.studentId || '', studentName: fee.studentName || '', class: fee.class || '', feeType: fee.feeType || 'Tuition Fee', amount: fee.amount?.toString() || '', month: fee.month || '', year: fee.year || new Date().getFullYear().toString(), status: fee.status || 'Pending', paidDate: fee.paidDate || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSave = { ...formData, amount: parseFloat(formData.amount) };
      if (selectedFee) {
        await pb.collection('Fees').update(selectedFee.id, dataToSave, { $autoCancel: false });
        toast.success('Fee record updated');
      } else {
        await pb.collection('Fees').create(dataToSave, { $autoCancel: false });
        toast.success('Fee record added');
      }
      setIsModalOpen(false);
      fetchFees();
    } catch (error) {
      toast.error('Failed to save fee record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fee record?')) return;
    try {
      await pb.collection('Fees').delete(id, { $autoCancel: false });
      toast.success('Fee record deleted');
      fetchFees();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleMarkPaid = async (fee) => {
    try {
      await pb.collection('Fees').update(fee.id, { status: 'Paid', paidDate: new Date().toISOString().split('T')[0] }, { $autoCancel: false });
      toast.success('Fee marked as paid');
      fetchFees();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const filteredFees = fees.filter(f => {
    const matchSearch = f.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6"><Plus className="w-4 h-4 mr-2" /> Add Fee Record</Button>
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

        <Card className="border-0 shadow-lg shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by student name..." className="pl-9 h-11" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40 h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
            : filteredFees.length === 0 ? (
              <div className="text-center py-16"><DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No fee records found</p></div>
            ) : (
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
                    {filteredFees.map((fee) => (
                      <tr key={fee.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-800">{fee.studentName}</td>
                        <td className="px-6 py-4"><Badge variant="secondary" className="bg-blue-50 text-blue-700">Class {fee.class}</Badge></td>
                        <td className="px-6 py-4 text-slate-600">{fee.feeType}</td>
                        <td className="px-6 py-4 text-slate-600">{fee.month} {fee.year}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">Rs.{fee.amount?.toLocaleString()}</td>
                        <td className="px-6 py-4"><Badge className={fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}>{fee.status}</Badge></td>
                        <td className="px-6 py-4 text-right">
                          {fee.status === 'Pending' && (
                            <Button variant="outline" size="sm" className="mr-2 text-green-600 border-green-200 h-8" onClick={() => handleMarkPaid(fee)}>Mark Paid</Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(fee)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(fee.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{selectedFee ? 'Edit Fee Record' : 'Add Fee Record'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select value={formData.studentId} onValueChange={(v) => {
                const student = students.find(s => s.id === v);
                setFormData({ ...formData, studentId: v, studentName: student?.name || '', class: student?.class || '' });
              }}>
                <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — Class {s.class}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fee Type</Label>
                <Select value={formData.feeType} onValueChange={(v) => setFormData({ ...formData, feeType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{feeTypes.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (Rs.)</Label>
                <Input type="number" min="0" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="e.g. 1500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={formData.month} onValueChange={(v) => setFormData({ ...formData, month: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                  <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-2">
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