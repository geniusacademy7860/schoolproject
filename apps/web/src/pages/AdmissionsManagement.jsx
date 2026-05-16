import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, FileText, Trash2, Edit } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient.js';

const AdmissionsManagement = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAdmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admissions').select('*')
      .order('created_at', { ascending: false });
    if (!error) setAdmissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAdmissions(); }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(true);
    const { error } = await supabase
      .from('admissions').update({ status }).eq('id', id);
    if (!error) {
      toast.success(`Admission ${status}`);
      setIsDetailOpen(false);
      fetchAdmissions();
    } else {
      toast.error('Failed to update status');
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase
      .from('admissions').delete().eq('id', deleteTarget.id);
    if (!error) {
      toast.success('Admission record deleted');
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      fetchAdmissions();
    } else {
      toast.error('Failed to delete');
    }
  };

  const getStatusColor = (s) =>
    s === 'Approved' ? 'bg-green-100 text-green-700' :
    s === 'Rejected' ? 'bg-red-100 text-red-700' :
    'bg-yellow-100 text-yellow-700';

  const filtered = admissions.filter(a => {
    const name = `${a.student_first_name} ${a.student_last_name}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'All' || a.status === filterStatus);
  });

  const counts = {
    pending: admissions.filter(a => a.status === 'Pending').length,
    approved: admissions.filter(a => a.status === 'Approved').length,
    rejected: admissions.filter(a => a.status === 'Rejected').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Admissions Management</h1>

        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
            <div className="text-xs text-slate-500 mt-1">Pending</div>
          </CardContent></Card>
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{counts.approved}</div>
            <div className="text-xs text-slate-500 mt-1">Approved</div>
          </CardContent></Card>
          <Card className="border-0 shadow-md"><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{counts.rejected}</div>
            <div className="text-xs text-slate-500 mt-1">Rejected</div>
          </CardContent></Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name..." className="pl-9 h-11"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-44 h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
              : filtered.length === 0
              ? <div className="text-center py-16">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">No admissions found</p>
                </div>
              : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Class</th>
                        <th className="px-6 py-4">Parent</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium">
                            {a.student_first_name} {a.student_last_name}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-blue-50 text-blue-700">
                              {a.class_applying_for}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{a.father_name || '-'}</td>
                          <td className="px-6 py-4 text-slate-600">{a.contact_number || '-'}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(a.status)}>
                              {a.status || 'Pending'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                            {/* View/Edit button — hamesha dikhega */}
                            <Button variant="ghost" size="icon"
                              onClick={() => { setSelectedAdmission(a); setIsDetailOpen(true); }}
                              title="View & Edit Status">
                              <Eye className="w-4 h-4 text-slate-500" />
                            </Button>
                            {/* Delete button — hamesha dikhega */}
                            <Button variant="ghost" size="icon"
                              onClick={() => { setDeleteTarget(a); setIsDeleteOpen(true); }}
                              title="Delete">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
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

      {/* Detail / Edit Status Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#1A3C8F]" /> Admission Details & Status
            </DialogTitle>
          </DialogHeader>
          {selectedAdmission && (
            <div className="space-y-4 py-2">

              {/* Current Status */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className={getStatusColor(selectedAdmission.status)}>
                  {selectedAdmission.status || 'Pending'}
                </Badge>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['First Name', selectedAdmission.student_first_name],
                  ['Last Name', selectedAdmission.student_last_name],
                  ['Date of Birth', selectedAdmission.date_of_birth],
                  ['Gender', selectedAdmission.gender],
                  ['Class Applying', selectedAdmission.class_applying_for],
                  ['Medium', selectedAdmission.medium],
                  ["Father's Name", selectedAdmission.father_name],
                  ["Mother's Name", selectedAdmission.mother_name],
                  ['Contact', selectedAdmission.contact_number],
                  ['Email', selectedAdmission.email],
                  ['Address', selectedAdmission.address],
                  ['Previous School', selectedAdmission.previous_school],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                    <div className="text-sm font-medium">{value || 'N/A'}</div>
                  </div>
                ))}
              </div>

              {/* Action buttons — to change the status — will always be visible*/}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Status Change karo:
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => handleStatusUpdate(selectedAdmission.id, 'Pending')}
                    disabled={updating || selectedAdmission.status === 'Pending'}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Pending par Wapas Karo
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedAdmission.id, 'Rejected')}
                    disabled={updating || selectedAdmission.status === 'Rejected'}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedAdmission.id, 'Approved')}
                    disabled={updating || selectedAdmission.status === 'Approved'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete Admission
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-slate-600">
              Do you? <strong>{deleteTarget?.student_first_name} {deleteTarget?.student_last_name}</strong> Do you want to delete the admission record?
            </p>
            <p className="text-xs text-red-500 mt-2">
              ⚠️ This Action Cannot be undone!
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default AdmissionsManagement;