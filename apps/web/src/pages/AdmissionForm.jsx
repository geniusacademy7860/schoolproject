import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    studentFirstName: '', studentLastName: '', dateOfBirth: '',
    gender: '', classApplyingFor: '', medium: 'Hindi',
    previousSchool: '', previousClass: '',
    fatherName: '', motherName: '', contactNumber: '',
    email: '', address: '',
  });

  const classes = ['Play Group','Nursery','KG','Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
  setSubmitting(true);
  try {
    const insertData = {
      student_first_name: formData.studentFirstName,
      student_last_name: formData.studentLastName,
      date_of_birth: formData.dateOfBirth || null,
      gender: formData.gender,
      class_applying_for: formData.classApplyingFor,
      medium: formData.medium,
      previous_school: formData.previousSchool || null,
      previous_class: formData.previousClass || null,
      father_name: formData.fatherName,
      mother_name: formData.motherName || null,
      contact_number: formData.contactNumber,
      email: formData.email || null,
      address: formData.address,
      status: 'Pending',
    };

    const { error } = await supabase.from('admissions').insert([insertData]);
    if (error) throw error;

    setSubmitted(true);
    toast.success('Application submitted successfully!');
  } catch (error) {
    toast.error('Failed: ' + error.message);
  } finally {
    setSubmitting(false);
  }
};

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 pt-20">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-3">Application Submitted!</h2>
              <p className="text-slate-500 mb-6">Thank you for applying to Genius Academy Forbesganj. We will contact you soon.</p>
              <p className="text-sm font-medium text-slate-600 mb-6">Contact: +91 82980 68098</p>
              <Button onClick={() => navigate('/')} className="w-full" style={{ backgroundColor: '#1A3C8F' }}>Back to Home</Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Admission Form - Genius Academy Forbesganj</title></Helmet>
      <Header />
      <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Admission Form</h1>
            <p className="text-slate-500">Genius Academy Forbesganj — Admission FREE</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'text-white' : 'bg-slate-200 text-slate-500'}`} style={step >= s ? { backgroundColor: '#1A3C8F' } : {}}>
                  {s}
                </div>
                {s < 3 && <div className={`h-0.5 w-12 ${step > s ? 'bg-[#1A3C8F]' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">
                {step === 1 && 'Student Information'}
                {step === 2 && 'Parent Information'}
                {step === 3 && 'Review & Submit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input required value={formData.studentFirstName} onChange={e => handleChange('studentFirstName', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input required value={formData.studentLastName} onChange={e => handleChange('studentLastName', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={formData.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Gender *</Label>
                      <Select value={formData.gender} onValueChange={v => handleChange('gender', v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Class Applying For *</Label>
                      <Select value={formData.classApplyingFor} onValueChange={v => handleChange('classApplyingFor', v)}>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Medium</Label>
                      <Select value={formData.medium} onValueChange={v => handleChange('medium', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Hindi">Hindi</SelectItem><SelectItem value="English">English</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Previous School</Label><Input value={formData.previousSchool} onChange={e => handleChange('previousSchool', e.target.value)} placeholder="If any" /></div>
                    <div className="space-y-2"><Label>Previous Class</Label><Input value={formData.previousClass} onChange={e => handleChange('previousClass', e.target.value)} /></div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Father's Name *</Label><Input required value={formData.fatherName} onChange={e => handleChange('fatherName', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Mother's Name</Label><Input value={formData.motherName} onChange={e => handleChange('motherName', e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Contact Number *</Label><Input type="tel" required value={formData.contactNumber} onChange={e => handleChange('contactNumber', e.target.value)} placeholder="+91 XXXXX XXXXX" /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="Optional" /></div>
                  </div>
                  <div className="space-y-2"><Label>Address *</Label><Input required value={formData.address} onChange={e => handleChange('address', e.target.value)} placeholder="Village, Block, District" /></div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <p className="font-semibold text-slate-700 text-sm">Student Details</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        ['Name', `${formData.studentFirstName} ${formData.studentLastName}`],
                        ['Gender', formData.gender], ['Class', formData.classApplyingFor],
                        ['Medium', formData.medium], ['Previous School', formData.previousSchool || 'N/A'],
                      ].map(([label, value]) => (
                        <div key={label}><span className="text-slate-500">{label}: </span><span className="font-medium">{value}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <p className="font-semibold text-slate-700 text-sm">Parent Details</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        ["Father's Name", formData.fatherName], ["Mother's Name", formData.motherName || 'N/A'],
                        ['Contact', formData.contactNumber], ['Address', formData.address],
                      ].map(([label, value]) => (
                        <div key={label}><span className="text-slate-500">{label}: </span><span className="font-medium">{value}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-800 font-medium">Admission is FREE at Genius Academy Forbesganj</p>
                    <p className="text-xs text-green-700 mt-1">We will contact you at {formData.contactNumber} within 2-3 days.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
                )}

                {step < 3 ? (
                  <Button
                    onClick={() => setStep(s => s + 1)}
                    disabled={
                      (step === 1 && (!formData.studentFirstName || !formData.studentLastName || !formData.gender || !formData.classApplyingFor)) ||
                      (step === 2 && (!formData.fatherName || !formData.contactNumber || !formData.address))
                    }
                    style={{ backgroundColor: '#1A3C8F' }}
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting} className="bg-green-600 hover:bg-green-700">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdmissionForm;