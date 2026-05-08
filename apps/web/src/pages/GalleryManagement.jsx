import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const GalleryManagement = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Campus',
    image: null
  });
  const [preview, setPreview] = useState(null);

  const categories = ['Campus', 'Classroom', 'Students', 'Nursery', 'Events', 'Sports', 'Other'];

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('gallery').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setPhotos(records);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('image', formData.image);

      await pb.collection('gallery').create(data, { $autoCancel: false });
      toast.success('Photo uploaded successfully');
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Campus', image: null });
      setPreview(null);
      fetchPhotos();
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await pb.collection('gallery').delete(id, { $autoCancel: false });
      toast.success('Photo deleted');
      fetchPhotos();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getImageUrl = (record) => {
    if (!record.image) return null;
    return `${pb.baseUrl}/api/files/gallery/${record.id}/${record.image}`;
  };

  const filteredPhotos = filterCategory === 'All'
    ? photos
    : photos.filter(p => p.category === filterCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Gallery Management</h1>
          <Button onClick={() => setIsModalOpen(true)} className="h-11 px-6 bg-[#1A3C8F] hover:bg-[#152e6e]">
            <Plus className="w-4 h-4 mr-2" /> Upload Photo
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['All', ...categories].map(cat => (
            <Button
              key={cat}
              variant={filterCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(cat)}
              className={filterCategory === cat ? 'bg-[#1A3C8F]' : ''}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading gallery...</div>
        ) : filteredPhotos.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-20 text-center">
              <Image className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No photos yet. Upload your first photo!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden border shadow-sm" style={{ height: '200px' }}>
                <img
                  src={getImageUrl(photo)}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  style={{ imageOrientation: 'from-image' }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 p-2">
                  <p className="text-white font-medium text-sm text-center">{photo.title}</p>
                  <Badge className="bg-white/20 text-white text-xs">{photo.category}</Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                    className="mt-2"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Upload New Photo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Photo Title</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Annual Function 2025"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Photo</Label>
              <Input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            {preview && (
              <div className="rounded-xl overflow-hidden" style={{ height: '180px' }}>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{ imageOrientation: 'from-image' }}
                />
              </div>
            )}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setPreview(null); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">
                {submitting ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default GalleryManagement;