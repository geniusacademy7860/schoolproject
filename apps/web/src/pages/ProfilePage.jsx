import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft, Calendar, Award, BookOpen, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    fatherName: currentUser?.fatherName || '',
    motherName: currentUser?.motherName || '',
    fatherMobile: currentUser?.fatherMobile || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await pb.collection('students').update(currentUser.id, formData, {
        $autoCancel: false
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/student-dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <p className="text-sm text-slate-500">View and update your information</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#EAF0FB] flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-[#1A3C8F]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{currentUser?.name || 'Student'}</h2>
                <p className="text-slate-500 text-sm mt-1">Roll No: {currentUser?.rollNumber || 'N/A'}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs bg-[#EAF0FB] text-[#1A3C8F] font-medium px-3 py-1 rounded-full">
                    Class {currentUser?.class} - {currentUser?.section}
                  </span>
                  <span className="text-xs bg-green-50 text-green-700 font-medium px-3 py-1 rounded-full">
                    Active Student
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Read-only Info */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1A3C8F]" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Class</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium">
                Class {currentUser?.class} - Section {currentUser?.section}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Roll Number</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium">
                {currentUser?.rollNumber || 'N/A'}
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs text-slate-500">Email (cannot be changed)</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm font-medium">
                {currentUser?.email || 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editable Info */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#1A3C8F]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Father's Name</Label>
                <Input
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="Father's name"
                />
              </div>
              <div className="space-y-2">
                <Label>Mother's Name</Label>
                <Input
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  placeholder="Mother's name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                type="tel"
                value={formData.fatherMobile}
                onChange={(e) => setFormData({ ...formData, fatherMobile: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-11 bg-[#1A3C8F] hover:bg-[#152e6e] mt-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;