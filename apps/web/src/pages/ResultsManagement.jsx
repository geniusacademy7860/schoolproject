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
import pb from '@/lib/pocketbaseClient.js';

const ResultsManagement = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    examName: '',
    academicYear: '2024-25',
    class: '',
    section: 'A',
    hindi: '',
    english: '',
    mathematics: '',
    science: '',
    socialScience: '',
    hindiTotal: '100',
    englishTotal: '100',
    mathematicsTotal: '100',
    scienceTotal: '100',
    socialScienceTotal: '100',
    rank: ''
  });

  const examTypes = ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Final Exam', 'Pre-Board'];
  const classes = ['1','2','3','4','5','6','7','8','9','10','11','12'];

  const fetchResults = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('results').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setResults(records);
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const records = await pb.collection('students').getFullList({
        sort: 'name',
        $autoCancel: false
      });
      setStudents(records);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  useEffect(() => {
    fetchResults();
    fetchStudents();
  }, []);

  const openAddModal = () => {
    setSelectedResult(null);
    setFormData({
      studentId: '',
      studentName: '',
      examName: '',
      academicYear: '2024-25',
      class: '',
      section: 'A',
      hindi: '',
      english: '',
      mathematics: '',
      science: '',
      socialScience: '',
      hindiTotal: '100',
      englishTotal: '100',
      mathematicsTotal: '100',
      scienceTotal: '100',
      socialScienceTotal: '100',
      rank: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (result) => {
    setSelectedResult(result);
    setFormData({
      studentId: result.studentId || '',
      studentName: result.studentName || '',
      examName: result.examName || '',
      academicYear: result.academicYear || '2024-25',
      class: result.class || '',
      section: result.section || 'A',
      hindi: result.hindi?.toString() || '',
      english: result.english?.toString() || '',
      mathematics: result.mathematics?.toString() || '',
      science: result.science?.toString() || '',
      socialScience: result.socialScience?.toString() || '',
      hindiTotal: result.hindiTotal?.toString() || '100',
      englishTotal: result.englishTotal?.toString() || '100',
      mathematicsTotal: result.mathematicsTotal?.toString() || '100',
      scienceTotal: result.scienceTotal?.toString() || '100',
      socialScienceTotal: result.socialScienceTotal?.toString() || '100',
      rank: result.rank?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSave = {
        ...formData,
        hindi: formData.hindi ? parseFloat(formData.hindi) : null,
        english: formData.english ? parseFloat(formData.english) : null,
        mathematics: formData.mathematics ? parseFloat(formData.mathematics) : null,
        science: formData.science ? parseFloat(formData.science) : null,
        socialScience: formData.socialScience ? parseFloat(formData.socialScience) : null,
        hindiTotal: parseFloat(formData.hindiTotal),
        englishTotal: parseFloat(formData.englishTotal),
        mathematicsTotal: parseFloat(formData.mathematicsTotal),
        scienceTotal: parseFloat(formData.scienceTotal),
        socialScienceTotal: parseFloat(formData.socialScienceTotal),
        rank: formData.rank ? parseInt(formData.rank) : null
      };

      if (selectedResult) {
        await pb.collection('results').update(selectedResult.id, dataToSave, { $autoCancel: false });
        toast.success('Result updated successfully');
      } else {
        await pb.collection('results').create(dataToSave, { $autoCancel: false });
        toast.success('Result added successfully');
      }
      setIsModalOpen(false);
      fetchResults();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return;
    try {
      await pb.collection('results').delete(id, { $autoCancel: false });
      toast.success('Result deleted');
      fetchResults();
    } catch (error) {
      toast.error('Failed to delete result');
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-700' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-100 text-green-700' };
    if (percentage >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-700' };
    if (percentage >= 60) return { grade: 'B', color: 'bg-blue-100 text-blue-700' };
    if (percentage >= 50) return { grade: 'C', color: 'bg-yellow-100 text-yellow-700' };
    return { grade: 'F', color: 'bg-red-100 text-red-700' };
  };

  const filteredResults = results.filter(r => {
    const matchSearch = r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.examName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = filterClass === 'All' || r.class === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Results Management</h1>
          <Button onClick={openAddModal} className="h-11 px-6">
            <Plus className="w-4 h-4 mr-2" /> Add Result
          </Button>
        </div>

        <Card className="border-0 shadow-lg shadow-blue-900/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student or exam..."
                  className="pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-40 h-11">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c} value={c}>Class {c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-16 text-slate-400">Loading results...</div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-16">
                <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No results found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Exam</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4">Marks</th>
                      <th className="px-6 py-4">Grade</th>
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResults.map((result) => {
                      const subjects = ['hindi', 'english', 'mathematics', 'science', 'socialScience'];
                      const totalMarks = subjects.reduce((sum, s) => sum + (result[s] || 0), 0);
                      const totalMax = subjects.reduce((sum, s) => sum + (result[`${s}Total`] || 100), 0);
                      const percentage = totalMax > 0 ? ((totalMarks / totalMax) * 100) : 0;
                      const { grade, color } = getGrade(percentage);
                      return (
                        <tr key={result.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium text-slate-800">{result.studentName || 'N/A'}</td>
                          <td className="px-6 py-4 text-slate-600">{result.examName}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              Class {result.class}-{result.section}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">{totalMarks}/{totalMax}</td>
                          <td className="px-6 py-4">
                            <Badge className={color}>{grade} ({percentage.toFixed(0)}%)</Badge>
                          </td>
                          <td className="px-6 py-4">{result.rank || '-'}</td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(result)}>
                              <Edit className="w-4 h-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(result.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
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
          <DialogHeader>
            <DialogTitle>{selectedResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">

            <div className="space-y-2">
              <Label>Select Student</Label>
              <Select
                value={formData.studentId}
                onValueChange={(v) => {
                  const student = students.find(s => s.id === v);
                  setFormData({
                    ...formData,
                    studentId: v,
                    studentName: student?.name || '',
                    class: student?.class || '',
                    section: student?.section || 'A'
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — Class {s.class}-{s.section} (Roll: {s.rollNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exam Name</Label>
                <Select
                  value={formData.examName}
                  onValueChange={(v) => setFormData({ ...formData, examName: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(e => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Input
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="2024-25"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <Label className="text-sm font-semibold text-slate-700">Subject Marks</Label>
              {[
                { key: 'hindi', label: 'Hindi' },
                { key: 'english', label: 'English' },
                { key: 'mathematics', label: 'Mathematics' },
                { key: 'science', label: 'Science' },
                { key: 'socialScience', label: 'Social Science' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <Label className="w-32 text-sm text-slate-600">{label}</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Marks"
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="flex-1"
                  />
                  <span className="text-slate-400 text-sm">/</span>
                  <Input
                    type="number"
                    min="0"
                    value={formData[`${key}Total`]}
                    onChange={(e) => setFormData({ ...formData, [`${key}Total`]: e.target.value })}
                    className="w-20"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Class Rank (optional)</Label>
              <Input
                type="number"
                min="1"
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                placeholder="e.g. 1"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-[#1A3C8F] hover:bg-[#152e6e]">
                {submitting ? 'Saving...' : selectedResult ? 'Update Result' : 'Add Result'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default ResultsManagement;