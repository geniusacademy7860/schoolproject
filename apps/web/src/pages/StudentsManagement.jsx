import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, Edit, Trash2, ShieldAlert, Users } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', rollNumber: '', class: '', section: 'A', email: '', password: '', 
    fatherName: '', motherName: '', fatherMobile: '', medium: 'English'
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let filterQuery = '';
      if (searchTerm) {
        filterQuery += `(name ~ "${searchTerm}" || rollNumber ~ "${searchTerm}")`;
      }
      
      const records = await pb.collection('Student').getList(page, 10, {
        sort: '-created',
        filter: filterQuery,
        $autoCancel: false
      });
      setStudents(records.items);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, filterClass, page]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openAddModal = () => {
    setFormData({
      name: '', rollNumber: '', class: '', section: 'A', email: '', password: '',
      fatherName: '', motherName: '', fatherMobile: '', medium: 'English'
    });
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || '',
      rollNumber: student.rollNumber || '',
      class: student.class || '',
      section: student.section || 'A',
      email: student.email || '',
      password: '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      fatherMobile: student.fatherMobile || '',
      medium: student.medium || 'English'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSave = { ...formData, passwordConfirm: formData.password };
      if (selectedStudent) {
        if (!dataToSave.password) {
          delete dataToSave.password;
          delete dataToSave.passwordConfirm;
        }
        await pb.collection('Student').update(selectedStudent.id, dataToSave, { $autoCancel: false });
        toast.success('Student updated successfully');
      } else {
        if (!dataToSave.password) dataToSave.password = 'password123';
        dataToSave.passwordConfirm = dataToSave.password;
        await pb.collection('Student').create(dataToSave, { $autoCancel: false });
        toast.success('Student added successfully');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await pb.collection('Student').delete(selectedStudent.id, { $autoCancel: false });
      toast.success('Student deleted');
      setIsDeleteDialogOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Students Management - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Students Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6 shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </div>

        <Card className="border-0 shadow-lg shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or roll number..." 
                  className="pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['All Classes', 'Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12'].map(filter => (
                  <Button 
                    key={filter}
                    variant={filterClass === filter ? 'default' : 'outline'}
                    onClick={() => setFilterClass(filter)}
                    className="whitespace-nowrap h-11"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Class & Sec</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
                  ) : students.length > 0 ? (
                    students.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-600">{student.rollNumber}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-medium">
                            Class {student.class}-{student.section}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{student.fatherMobile || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(student)}>
                            <Edit className="w-4 h-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent(student); setIsDeleteDialogOpen(true); }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Users className="w-12 h-12 mb-3 opacity-20" />
                          <p>No students found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-muted-foreground">Showing page {page}</span>
              <div className="flex gap-2">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <Button variant="outline" onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Roll Number *</Label>
                <Input required value={formData.rollNumber} onChange={e => handleInputChange('rollNumber', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={formData.class} onValueChange={v => handleInputChange('class', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={formData.section} onValueChange={v => handleInputChange('section', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['A','B','C','D'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Father's Name</Label>
                <Input value={formData.fatherName} onChange={e => handleInputChange('fatherName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input type="tel" value={formData.fatherMobile} onChange={e => handleInputChange('fatherMobile', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email (for login) *</Label>
                <Input type="email" required value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Password {selectedStudent && '(Leave blank to keep)'}</Label>
                <Input type="password" required={!selectedStudent} minLength={8} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Student'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete student <strong>{selectedStudent?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default StudentsManagement;