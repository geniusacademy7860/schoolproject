import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Bell } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const NoticesManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'General',
    date: new Date().toISOString().split('T')[0], isImportant: false
  });

  const categories = ['General', 'Exam', 'Holiday', 'Fee', 'Event', 'Urgent'];

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('Notices').getFullList({ sort: '-date', $autoCancel: false });
      setNotices(records);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const openAddModal = () => {
    setSelectedNotice(null);
    setFormData({ title: '', content: '', category: 'General', date: new Date().toISOString().split('T')[0], isImportant: false });
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title || '', content: notice.content || '',
      category: notice.category || 'General',
      date: notice.date ? notice.date.split(' ')[0] : new Date().toISOString().split('T')[0],
      isImportant: notice.isImportant || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedNotice) {
        await pb.collection('Notices').update(selectedNotice.id, formData, { $autoCancel: false });
        toast.success('Notice updated');
      } else {
        await pb.collection('Notices').create(formData, { $autoCancel: false });
        toast.success('Notice created');
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (error) {
      toast.error('Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await pb.collection('Notices').delete(id, { $autoCancel: false });
      toast.success('Notice deleted');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const getCategoryColor = (category) => {
    const colors = { 'Urgent': 'bg-red-100 text-red-700', 'Exam': 'bg-blue-100 text-blue-700', 'Holiday': 'bg-green-100 text-green-700', 'Fee': 'bg-yellow-100 text-yellow-700', 'Event': 'bg-purple-100 text-purple-700', 'General': 'bg-slate-100 text-slate-700' };
    return colors[category] || colors['General'];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Notices Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6"><Plus className="w-4 h-4 mr-2" /> Add Notice</Button>
        </div>
        <Card className="border-0 shadow-lg shadow-blue-900/5">
          <CardContent className="p-6">
            {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
            : notices.length === 0 ? (
              <div className="text-center py-16"><Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No notices yet</p></div>
            ) : (
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div key={notice.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm">{notice.title}</h3>
                        {notice.isImportant && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Important</span>}
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{notice.content}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getCategoryColor(notice.category)}`}>{notice.category}</Badge>
                        <span className="text-xs text-slate-400">{new Date(notice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(notice)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(notice.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader><DialogTitle>{selectedNotice ? 'Edit Notice' : 'Add New Notice'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Notice title" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Notice details..." rows={4} className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isImportant" checked={formData.isImportant} onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })} className="w-4 h-4 accent-[#1A3C8F]" />
              <Label htmlFor="isImportant" className="cursor-pointer">Mark as Important</Label>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">{submitting ? 'Saving...' : selectedNotice ? 'Update' : 'Add Notice'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default NoticesManagement;