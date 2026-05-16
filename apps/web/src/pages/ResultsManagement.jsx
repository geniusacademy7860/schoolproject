import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Award, Search } from 'lucide-react';
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

const ResultsManagement = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  const emptyForm = { studentId: '', studentName: '', examName: '', academicYear: '2024-25', class: '', section: 'A', hindi: '', english: '', mathematics: '', science: '', socialScience: '', hindiTotal: '100', englishTotal: '100', mathematicsTotal: '100', scienceTotal: '100', socialScienceTotal: '100', rank: '' };
  const [formData, setFormData] = useState(emptyForm);

  const examTypes = ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Final Exam', 'Pre-Board'];
  const classes = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('results').select('*').order('created_at', { ascending: false });
    if (!error) setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
    supabase.from('Students').select('id, name, class, section, roll_number').order('name')
      .then(({ data }) => setStudents(data || []));
  }, []);

  const openEditModal = (r) => {
    setSelectedResult(r);
    setFormData({
      studentId: r.student_id || '', studentName: r.student_name || '',
      examName: r.exam_name || '', academicYear: r.academic_year || '2024-25',
      class: r.class || '', section: r.section || 'A',
      hindi: r.hindi?.toString() || '', english: r.english?.toString() || '',
      mathematics: r.mathematics?.toString() || '', science: r.science?.toString() || '',
      socialScience: r.social_science?.toString() || '',
      hindiTotal: r.hindi_total?.toString() || '100', englishTotal: r.english_total?.toString() || '100',
      mathematicsTotal: r.mathematics_total?.toString() || '100', scienceTotal: r.science_total?.toString() || '100',
      socialScienceTotal: r.social_science_total?.toString() || '100',
      rank: r.rank?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const save = {
        student_id: formData.studentId, student_name: formData.studentName,
        exam_name: formData.examName, academic_year: formData.academicYear,
        class: formData.class, section: formData.section,
        hindi: formData.hindi ? parseFloat(formData.hindi) : null,
        english: formData.english ? parseFloat(formData.english) : null,
        mathematics: formData.mathematics ? parseFloat(formData.mathematics) : null,
        science: formData.science ? parseFloat(formData.science) : null,
        social_science: formData.socialScience ? parseFloat(formData.socialScience) : null,
        hindi_total: parseFloat(formData.hindiTotal),
        english_total: parseFloat(formData.englishTotal),
        mathematics_total: parseFloat(formData.mathematicsTotal),
        science_total: parseFloat(formData.scienceTotal),
        social_science_total: parseFloat(formData.socialScienceTotal),
        rank: formData.rank ? parseInt(formData.rank) : null
      };

      if (selectedResult) {
        const { error } = await supabase.from('results').update(save).eq('id', selectedResult.id);
        if (error) throw error;
        toast.success('Result updated');
      } else {
        const { error } = await supabase.from('results').insert([save]);
        if (error) throw error;
        toast.success('Result added');
      }
      setIsModalOpen(false);
      fetchResults();
    } catch (e) {
      toast.error('Failed to save result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (!error) { toast.success('Deleted'); fetchResults(); }
    else toast.error('Failed to delete');
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-700' };
    if (pct >= 80) return { grade: 'A', color: 'bg-green-100 text-green-700' };
    if (pct >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-700' };
    if (pct >= 60) return { grade: 'B', color: 'bg-blue-100 text-blue-700' };
    if (pct >= 50) return { grade: 'C', color: 'bg-yellow-100 text-yellow-700' };
    return { grade: 'F', color: 'bg-red-100 text-red-700' };
  };

  const filtered = results.filter(r => {
    const ms = r.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || r.exam_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (filterClass === 'All' || r.class === filterClass);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Results Management</h1>
          <Button onClick={() => { setSelectedResult(null); setFormData(emptyForm); setIsModalOpen(true); }} className="h-11 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Result
          </Button>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-11" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-40 h-11"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="All">All Classes</SelectItem>{classes.map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
              : filtered.length === 0 ? <div className="text-center py-16"><Award className="w-12 h-12 mx-auto mb-4 text-slate-300" /><p className="text-slate-500">No results found</p></div>
              : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr><th className="px-6 py-4">Student</th><th className="px-6 py-4">Exam</th><th className="px-6 py-4">Class</th><th className="px-6 py-4">Marks</th><th className="px-6 py-4">Grade</th><th className="px-6 py-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(r => {
                        const subs = ['hindi', 'english', 'mathematics', 'science', 'social_science'];
                        const total = subs.reduce((s, k) => s + (r[k] || 0), 0);
                        const max = subs.reduce((s, k) => s + (r[`${k}_total`] || 100), 0);
                        const pct = max > 0 ? (total / max) * 100 : 0;
                        const { grade, color } = getGrade(pct);
                        return (
                          <tr key={r.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-medium">{r.student_name || 'N/A'}</td>
                            <td className="px-6 py-4">{r.exam_name}</td>
                            <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700">Class {r.class}-{r.section}</Badge></td>
                            <td className="px-6 py-4">{total}/{max}</td>
                            <td className="px-6 py-4"><Badge className={color}>{grade} ({pct.toFixed(0)}%)</Badge></td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="ghost" size="icon" onClick={() => openEditModal(r)}><Edit className="w-4 h-4 text-slate-500" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selectedResult ? 'Edit Result' : 'Add Result'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2"><Label>Student</Label>
              <Select value={formData.studentId} onValueChange={v => {
                const s = students.find(s => s.id === v);
                setFormData(p => ({ ...p, studentId: v, studentName: s?.name || '', class: s?.class || '', section: s?.section || 'A' }));
              }}>
                <SelectTrigger><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — Class {s.class} (Roll: {s.roll_number})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Exam</Label>
                <Select value={formData.examName} onValueChange={v => setFormData(p => ({ ...p, examName: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{examTypes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Academic Year</Label><Input value={formData.academicYear} onChange={e => setFormData(p => ({ ...p, academicYear: e.target.value }))} /></div>
            </div>
            <div className="border rounded-lg p-4 space-y-3">
              <Label className="font-semibold">Subject Marks</Label>
              {[['hindi','Hindi'],['english','English'],['mathematics','Mathematics'],['science','Science'],['socialScience','Social Science']].map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <Label className="w-32 text-sm">{label}</Label>
                  <Input type="number" min="0" placeholder="Marks" value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} className="flex-1" />
                  <span className="text-slate-400">/</span>
                  <Input type="number" min="0" value={formData[`${key}Total`]} onChange={e => setFormData(p => ({ ...p, [`${key}Total`]: e.target.value }))} className="w-20" />
                </div>
              ))}
            </div>
            <div className="space-y-2"><Label>Class Rank (optional)</Label><Input type="number" min="1" value={formData.rank} onChange={e => setFormData(p => ({ ...p, rank: e.target.value }))} placeholder="e.g. 1" /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">{submitting ? 'Saving...' : selectedResult ? 'Update' : 'Add Result'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ResultsManagement;