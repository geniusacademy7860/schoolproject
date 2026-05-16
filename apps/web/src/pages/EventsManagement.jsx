import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient.js';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ title: '', date: '', description: '', image: null });

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (!error) setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAddModal = () => { setSelectedEvent(null); setFormData({ title: '', date: '', description: '', image: null }); setPreview(null); setIsModalOpen(true); };
  const openEditModal = (e) => { setSelectedEvent(e); setFormData({ title: e.title, date: e.date, description: e.description || '', image: null }); setPreview(e.image_url); setIsModalOpen(true); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setFormData(p => ({ ...p, image: file })); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageUrl = selectedEvent?.image_url || null;

      if (formData.image) {
        const ext = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('events').upload(fileName, formData.image);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const save = { title: formData.title, date: formData.date, description: formData.description, image_url: imageUrl };

      if (selectedEvent) {
        const { error } = await supabase.from('events').update(save).eq('id', selectedEvent.id);
        if (error) throw error;
        toast.success('Event updated');
      } else {
        const { error } = await supabase.from('events').insert([save]);
        if (error) throw error;
        toast.success('Event added');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (e) {
      toast.error('Failed to save: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      if (event.image_url) {
        const fileName = event.image_url.split('/').pop();
        await supabase.storage.from('events').remove([fileName]);
      }
      const { error } = await supabase.from('events').delete().eq('id', event.id);
      if (error) throw error;
      toast.success('Deleted');
      fetchEvents();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Events Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6 bg-[#1A3C8F] hover:bg-[#152e6e]"><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
        </div>
        {loading ? <div className="text-center py-20 text-slate-400">Loading...</div>
          : events.length === 0 ? <Card className="border-0 shadow-lg"><CardContent className="py-20 text-center"><Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No events yet</p></CardContent></Card>
          : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <Card key={event.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                  <div style={{ height: '180px' }} className="overflow-hidden bg-muted">
                    {event.image_url ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
                      : <div className="w-full h-full flex items-center justify-center text-slate-400"><Calendar className="w-12 h-12" /></div>}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{event.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><Calendar className="w-3 h-3" /> {event.date}</p>
                    {event.description && <p className="text-xs text-slate-600 line-clamp-2 mb-3">{event.description}</p>}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(event)}><Edit className="w-3 h-3 mr-1" />Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(event)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2"><Label>Title</Label><Input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Date</Label><Input required value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} placeholder="e.g. January 2025" /></div>
            <div className="space-y-2"><Label>Description</Label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
            <div className="space-y-2"><Label>Photo {selectedEvent && '(leave empty to keep current)'}</Label><Input type="file" accept="image/*" required={!selectedEvent} onChange={handleFileChange} className="cursor-pointer" /></div>
            {preview && <div className="rounded-xl overflow-hidden" style={{ height: '160px' }}><img src={preview} alt="Preview" className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} /></div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">{submitting ? 'Saving...' : selectedEvent ? 'Update' : 'Add Event'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default EventsManagement;