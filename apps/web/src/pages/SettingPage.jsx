import React, { useState, useEffect, useCallback } from 'react';
import { Save, Building, ShieldCheck, UserCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthcontext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient.js';

const SettingsPage = () => {
  const { currentAdmin } = useAdminAuth();

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolPhone, setSchoolPhone] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [schoolWebsite, setSchoolWebsite] = useState('');
  const [schoolSettingId, setSchoolSettingId] = useState(null);
  const [savingSchool, setSavingSchool] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (currentAdmin) {
      setAdminName(currentAdmin.name || '');
      setAdminEmail(currentAdmin.email || '');
    }

    const fetchSchoolSettings = async () => {
      const { data } = await supabase
        .from('school_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data) {
        setSchoolSettingId(data.id);
        setSchoolName(data.school_name || '');
        setSchoolAddress(data.school_address || '');
        setSchoolPhone(data.school_phone || '');
        setSchoolEmail(data.school_email || '');
        setSchoolWebsite(data.school_website || '');
      }
    };
    fetchSchoolSettings();
  }, [currentAdmin]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await supabase
      .from('admins')
      .update({ name: adminName })
      .eq('id', currentAdmin.id);

    if (!error) toast.success('Profile updated');
    else toast.error('Failed to update profile');
    setSavingProfile(false);
  };

  const handleSaveSchool = async () => {
    setSavingSchool(true);
    try {
      const save = {
        school_name: schoolName,
        school_address: schoolAddress,
        school_phone: schoolPhone,
        school_email: schoolEmail,
        school_website: schoolWebsite,
      };

      if (schoolSettingId) {
        const { error } = await supabase
          .from('school_settings')
          .update(save)
          .eq('id', schoolSettingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('school_settings')
          .insert([save])
          .select()
          .single();
        if (error) throw error;
        setSchoolSettingId(data.id);
      }
      toast.success('School settings saved');
    } catch (e) {
      toast.error('Failed: ' + e.message);
    } finally {
      setSavingSchool(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) { toast.error('Please enter new password'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }

    setSavingPassword(true);
    const { error } = await supabase
      .from('admins')
      .update({ password: newPassword })
      .eq('id', currentAdmin.id);

    if (!error) {
      toast.success('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error('Failed: ' + error.message);
    }
    setSavingPassword(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your profile and school information</p>
        </div>

        {/* Admin Profile */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0FB] flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-[#1A3C8F]" />
              </div>
              <div>
                <CardTitle className="text-base">Admin Profile</CardTitle>
                <CardDescription>Update your name</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Full Name</Label>
              <Input
                id="adminName"
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                placeholder="Admin name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                value={adminEmail}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="bg-[#1A3C8F] hover:bg-[#152e6e]"
            >
              <Save className="w-4 h-4 mr-2" />
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card className="border-0 shadow-sm">
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
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="Genius Academy Forbesganj"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolPhone">Phone Number</Label>
                <Input
                  id="schoolPhone"
                  value={schoolPhone}
                  onChange={e => setSchoolPhone(e.target.value)}
                  placeholder="+91 82980 68098"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolEmailField">School Email</Label>
                <Input
                  id="schoolEmailField"
                  value={schoolEmail}
                  onChange={e => setSchoolEmail(e.target.value)}
                  placeholder="school@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolWebsite">Website</Label>
                <Input
                  id="schoolWebsite"
                  value={schoolWebsite}
                  onChange={e => setSchoolWebsite(e.target.value)}
                  placeholder="www.geniusacademy.in"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolAddress">Address</Label>
              <Input
                id="schoolAddress"
                value={schoolAddress}
                onChange={e => setSchoolAddress(e.target.value)}
                placeholder="Dhatta Tola, Genius Academy Road, Forbesganj"
              />
            </div>
            <Button
              onClick={handleSaveSchool}
              disabled={savingSchool}
              className="bg-[#1A3C8F] hover:bg-[#152e6e]"
            >
              <Save className="w-4 h-4 mr-2" />
              {savingSchool ? 'Saving...' : 'Save School Info'}
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0FB] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#1A3C8F]" />
              </div>
              <div>
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>Update your admin login password</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPass">New Password</Label>
              <Input
                id="newPass"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPass">Confirm Password</Label>
              <Input
                id="confirmPass"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className="bg-[#1A3C8F] hover:bg-[#152e6e]"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              {savingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
};

export default SettingsPage;