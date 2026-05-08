import React, { useState, useEffect } from 'react';
import { Save, Building, ShieldCheck, UserCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthcontext';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const SettingsPage = () => {
  const { currentAdmin } = useAdminAuth();
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [schoolSettings, setSchoolSettings] = useState({ id: '', schoolName: '', schoolAddress: '', schoolPhone: '', schoolEmail: '', schoolWebsite: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', password: '', passwordConfirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSchool, setSavingSchool] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (currentAdmin) {
      setProfileForm({ name: currentAdmin.name || '', email: currentAdmin.email || '' });
    }
    fetchSchoolSettings();
  }, [currentAdmin]);

  const fetchSchoolSettings = async () => {
    try {
      const records = await pb.collection('SchoolSetting').getFullList({ $autoCancel: false });
      if (records.length > 0) setSchoolSettings(records[0]);
    } catch (error) {
      console.error('Error fetching school settings:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await pb.collection('Admin').update(currentAdmin.id, { name: profileForm.name });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSchool = async () => {
    setSavingSchool(true);
    try {
      if (schoolSettings.id) {
        await pb.collection('SchoolSetting').update(schoolSettings.id, schoolSettings);
      } else {
        await pb.collection('SchoolSetting').create(schoolSettings);
      }
      toast.success('School settings saved');
    } catch (error) {
      toast.error('Failed to save school settings');
    } finally {
      setSavingSchool(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.password !== passwordForm.passwordConfirm) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await pb.collection('Admin').update(currentAdmin.id, {
        oldPassword: passwordForm.oldPassword,
        password: passwordForm.password,
        passwordConfirm: passwordForm.passwordConfirm
      });
      toast.success('Password changed successfully');
      setPasswordForm({ oldPassword: '', password: '', passwordConfirm: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your profile and school information</p>
        </div>

        <Card className="shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0FB] flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-[#1A3C8F]" />
              </div>
              <div>
                <CardTitle className="text-base">Admin Profile</CardTitle>
                <CardDescription>Update your name and email</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Admin Name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profileForm.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-[#1A3C8F] hover:bg-[#152e6e]">
              <Save className="w-4 h-4 mr-2" />{savingProfile ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0FB] flex items-center justify-center">
                <Building className="w-5 h-5 text-[#1A3C8F]" />
              </div>
              <div>
                <CardTitle className="text-base">School Information</CardTitle>
                <CardDescription>Update school details shown on website</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input value={schoolSettings.schoolName} onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })} placeholder="Genius Academy Forbesganj" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={schoolSettings.schoolPhone} onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolPhone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={schoolSettings.schoolEmail} onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolEmail: e.target.value })} placeholder="info@geniusacademy.edu.in" />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={schoolSettings.schoolWebsite} onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolWebsite: e.target.value })} placeholder="www.geniusacademy.edu.in" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={schoolSettings.schoolAddress} onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolAddress: e.target.value })} placeholder="Main Road, Forbesganj, Bihar" />
            </div>
            <Button onClick={handleSaveSchool} disabled={savingSchool} className="bg-[#1A3C8F] hover:bg-[#152e6e]">
              <Save className="w-4 h-4 mr-2" />{savingSchool ? 'Saving...' : 'Save School Info'}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0FB] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#1A3C8F]" />
              </div>
              <div>
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>Update your admin password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" value={passwordForm.passwordConfirm} onChange={(e) => setPasswordForm({ ...passwordForm, passwordConfirm: e.target.value })} placeholder="••••••••" />
            </div>
            <Button onClick={handleChangePassword} disabled={savingPassword} className="bg-[#1A3C8F] hover:bg-[#152e6e]">
              <ShieldCheck className="w-4 h-4 mr-2" />{savingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;