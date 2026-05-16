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
import { supabase } from '@/lib/supabaseClient.js';

const NoticesManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'General',
    date: new Date().toISOString().split('T')[0], is_important: false
  });

  const categories = ['General', 'Exam', 'Holiday', 'Fee', 'Event', 'Urgent'];

  const fetchNotices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('notices').select('*').order('date', { ascending: false });
    if (error) console.error(error);
    setNotices(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotices(); }, []);

  const openAddModal = () => {
    setSelectedNotice(null);
    setFormData({ title: '', content: '', category: 'General', date: new Date().toISOString().split('T')[0], is_important: false });
    setIsModalOpen(true);
  };

  const openEditModal = (n) => {
    setSelectedNotice(n);
    setFormData({ title: n.title || '', content: n.content || '', category: n.category || 'General', date: n.date || new Date().toISOString().split('T')[0], is_important: n.is_important || false });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const save = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        date: formData.date,
        is_important: formData.is_important
      };
      if (selectedNotice) {
        const { error } = await supabase.from('notices').update(save).eq('id', selectedNotice.id);
        if (error) throw error;
        toast.success('Notice updated');
      } else {
        const { error } = await supabase.from('notices').insert([save]);
        if (error) throw error;
        toast.success('Notice created');
      }
      setIsModalOpen(false);
      fetchNotices();
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); fetchNotices(); }
    else toast.error('Failed to delete');
  };

  const catColor = c => ({
    'Urgent': 'bg-red-100 text-red-700', 'Exam': 'bg-blue-100 text-blue-700',
    'Holiday': 'bg-green-100 text-green-700', 'Fee': 'bg-yellow-100 text-yellow-700',
    'Event': 'bg-purple-100 text-purple-700', 'General': 'bg-slate-100 text-slate-700'
  }[c] || 'bg-slate-100 text-slate-700');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Notices Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6 bg-[#1A3C8F] hover:bg-[#152e6e]">
            <Plus className="w-4 h-4 mr-2" /> Add Notice
          </Button>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
              : notices.length === 0 ? <div className="text-center py-16"><Bell className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No notices yet</p></div>
              : (
                <div className="space-y-3">
                  {notices.map(n => (
                    <div key={n.id} className="flex items-start justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-sm">{n.title}</h3>
                          {n.is_important && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Important</span>}
                        </div>
                        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{n.content}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${catColor(n.category)}`}>{n.category}</Badge>
                          <span className="text-xs text-slate-400">{n.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(n)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{selectedNotice ? 'Edit Notice' : 'Add Notice'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title</Label><Input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Content</Label>
              <textarea required value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} rows={4} className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="imp" checked={formData.is_important} onChange={e => setFormData(p => ({ ...p, is_important: e.target.checked }))} className="w-4 h-4 accent-[#1A3C8F]" />
              <Label htmlFor="imp" className="cursor-pointer">Mark as Important</Label>
            </div>
            <DialogFooter>
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