import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
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

const AdmissionsManagement = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('admissions').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setAdmissions(records);
    } catch (error) {
      toast.error('Failed to load admissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(true);
    try {
      await pb.collection('admissions').update(id, { status }, { $autoCancel: false });
      toast.success(`Admission ${status}`);
      setIsDetailOpen(false);
      fetchAdmissions();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const filteredAdmissions = admissions.filter(a => {
    const fullName = `${a.studentFirstName} ${a.studentLastName}`.toLowerCase();
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) ||
      a.classApplyingFor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pendingCount = admissions.filter(a => a.status === 'Pending').length;
  const approvedCount = admissions.filter(a => a.status === 'Approved').length;
  const rejectedCount = admissions.filter(a => a.status === 'Rejected').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Admissions Management</h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs text-slate-500 mt-1">Pending</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <div className="text-xs text-slate-500 mt-1">Approved</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{rejectedCount}</div>
              <div className="text-xs text-slate-500 mt-1">Rejected</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-blue-900/5">
          <CardContent className="p-6">

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or class..."
                  className="pl-9 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-44 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-16 text-slate-400">Loading admissions...</div>
            ) : filteredAdmissions.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">No admissions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Student Name</th>
                      <th className="px-6 py-4">Class</th>
                      <th className="px-6 py-4">Parent</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmissions.map((admission) => (
                      <tr key={admission.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {admission.studentFirstName} {admission.studentLastName}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {admission.classApplyingFor}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{admission.fatherName || '-'}</td>
                        <td className="px-6 py-4 text-slate-600">{admission.contactNumber || '-'}</td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(admission.created).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(admission.status)}>
                            {admission.status || 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedAdmission(admission); setIsDetailOpen(true); }}
                          >
                            <Eye className="w-4 h-4 text-slate-500" />
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

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admission Details</DialogTitle>
          </DialogHeader>

          {selectedAdmission && (
            <div className="space-y-4 py-2">

              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">Current Status</span>
                <Badge className={getStatusColor(selectedAdmission.status)}>
                  {selectedAdmission.status || 'Pending'}
                </Badge>
              </div>

              {/* Student Info */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student Information
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'First Name', value: selectedAdmission.studentFirstName },
                    { label: 'Last Name', value: selectedAdmission.studentLastName },
                    { label: 'Date of Birth', value: selectedAdmission.dateOfBirth },
                    { label: 'Gender', value: selectedAdmission.gender },
                    { label: 'Class Applying', value: selectedAdmission.classApplyingFor },
                    { label: 'Medium', value: selectedAdmission.medium },
                    { label: 'Previous School', value: selectedAdmission.previousSchool || 'N/A' },
                    { label: 'Previous Class', value: selectedAdmission.previousClass || 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      <div className="text-sm font-medium text-slate-800">{value || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Parent Information
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Father's Name", value: selectedAdmission.fatherName },
                    { label: "Mother's Name", value: selectedAdmission.motherName },
                    { label: 'Contact Number', value: selectedAdmission.contactNumber },
                    { label: 'Email', value: selectedAdmission.email },
                    { label: 'Address', value: selectedAdmission.address },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-lg p-3">
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      <div className="text-sm font-medium text-slate-800">{value || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedAdmission.status !== 'Approved' && selectedAdmission.status !== 'Rejected' && (
                <DialogFooter className="gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedAdmission.id, 'Rejected')}
                    disabled={updating}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedAdmission.id, 'Approved')}
                    disabled={updating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}

              {(selectedAdmission.status === 'Approved' || selectedAdmission.status === 'Rejected') && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default AdmissionsManagement;