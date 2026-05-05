import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Header from '@/components/Header';
import pb from '@/lib/pocketbaseClient';

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formNumber, setFormNumber] = useState('');
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    dateOfBirth: '',
    gender: '',
    aadhar: '',
    bloodGroup: '',
    nationality: 'Indian',
    religion: '',
    category: '',
    mothertongue: '',
    previousSchool: '',
    lastClass: '',
    lastPercentage: '',
    tcNumber: '',
    classApplyingFor: '',
    stream: '',
    medium: '',
    coachingEnrollment: false,
    coachingSubjects: [],
    preferredBatch: '',
    fatherName: '',
    fatherQualification: '',
    fatherOccupation: '',
    fatherMobile: '',
    fatherEmail: '',
    fatherAnnualIncome: '',
    motherName: '',
    motherQualification: '',
    motherOccupation: '',
    motherMobile: '',
    guardianName: '',
    guardianRelation: '',
    address: '',
    village: '',
    postOffice: '',
    district: 'Araria',
    state: 'Bihar',
    pinCode: '',
    documentsSubmitted: [],
    declarationAccepted: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedFormNumber = `GA-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const record = await pb.collection('admissions').create({
        formNumber: generatedFormNumber,
        ...formData,
        status: 'Pending'
      }, { $autoCancel: false });

      setFormNumber(generatedFormNumber);
      toast.success('Admission form submitted successfully');
      setCurrentStep(7); // Success screen
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 6;

  if (currentStep === 7) {
    return (
      <>
        <Helmet>
          <title>Admission Successful - Genius Academy Forbesganj</title>
        </Helmet>
        <Header />
        <div className="min-h-screen pt-24 pb-12 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#27AE60' }}>
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Form Submitted Successfully!</h1>
                <p className="text-lg mb-2">Form Number: <span className="font-bold" style={{ color: '#1A3C8F' }}>{formNumber}</span></p>
                <p className="text-muted-foreground mb-8">
                  Our team will contact you within 24 hours on: {formData.fatherMobile}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admission Form 2025-26 - Genius Academy Forbesganj</title>
        <meta name="description" content="Apply for admission to Genius Academy Forbesganj for the academic year 2025-26" />
      </Helmet>

      <Header />

      <div className="min-h-screen pt-24 pb-12 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6 border-t-4" style={{ borderTopColor: '#F5A623' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}>
                <GraduationCap className="w-8 h-8" style={{ color: '#1A3C8F' }} />
              </div>
              <CardTitle className="text-2xl">Admission Form 2025–26</CardTitle>
              <p className="text-muted-foreground">Genius Academy Forbesganj</p>
              {formNumber && (
                <p className="text-sm font-medium mt-2">Form No: {formNumber}</p>
              )}
            </CardHeader>
          </Card>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Section {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(currentStep / totalSteps) * 100}%`,
                  backgroundColor: '#1A3C8F'
                }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Student Details'}
                  {currentStep === 2 && 'Admission Details'}
                  {currentStep === 3 && 'Parent/Guardian Information'}
                  {currentStep === 4 && 'Address Details'}
                  {currentStep === 5 && 'Documents Checklist'}
                  {currentStep === 6 && 'Declaration'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === 1 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.studentFirstName}
                          onChange={(e) => handleInputChange('studentFirstName', e.target.value)}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.studentLastName}
                          onChange={(e) => handleInputChange('studentLastName', e.target.value)}
                          required
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dob">Date of Birth *</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="aadhar">Aadhar Number</Label>
                        <Input
                          id="aadhar"
                          value={formData.aadhar}
                          onChange={(e) => handleInputChange('aadhar', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input
                          id="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div>
                      <Label htmlFor="classApplying">Class Applying For *</Label>
                      <Select value={formData.classApplyingFor} onValueChange={(value) => handleInputChange('classApplyingFor', value)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nursery">Nursery</SelectItem>
                          <SelectItem value="KG">KG</SelectItem>
                          <SelectItem value="1">Class 1</SelectItem>
                          <SelectItem value="2">Class 2</SelectItem>
                          <SelectItem value="3">Class 3</SelectItem>
                          <SelectItem value="4">Class 4</SelectItem>
                          <SelectItem value="5">Class 5</SelectItem>
                          <SelectItem value="6">Class 6</SelectItem>
                          <SelectItem value="7">Class 7</SelectItem>
                          <SelectItem value="8">Class 8</SelectItem>
                          <SelectItem value="9">Class 9</SelectItem>
                          <SelectItem value="10">Class 10</SelectItem>
                          <SelectItem value="11">Class 11</SelectItem>
                          <SelectItem value="12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="medium">Medium</Label>
                        <Select value={formData.medium} onValueChange={(value) => handleInputChange('medium', value)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select medium" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="stream">Stream (for 11-12)</Label>
                        <Select value={formData.stream} onValueChange={(value) => handleInputChange('stream', value)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select stream" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="Commerce">Commerce</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="coaching"
                        checked={formData.coachingEnrollment}
                        onCheckedChange={(checked) => handleInputChange('coachingEnrollment', checked)}
                      />
                      <Label htmlFor="coaching" className="cursor-pointer">
                        Enroll in Genius Coaching Center
                      </Label>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Father's Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fatherName">Name</Label>
                          <Input
                            id="fatherName"
                            value={formData.fatherName}
                            onChange={(e) => handleInputChange('fatherName', e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fatherMobile">Mobile *</Label>
                          <Input
                            id="fatherMobile"
                            type="tel"
                            value={formData.fatherMobile}
                            onChange={(e) => handleInputChange('fatherMobile', e.target.value)}
                            required
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fatherEmail">Email</Label>
                          <Input
                            id="fatherEmail"
                            type="email"
                            value={formData.fatherEmail}
                            onChange={(e) => handleInputChange('fatherEmail', e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fatherOccupation">Occupation</Label>
                          <Input
                            id="fatherOccupation"
                            value={formData.fatherOccupation}
                            onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Mother's Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="motherName">Name</Label>
                          <Input
                            id="motherName"
                            value={formData.motherName}
                            onChange={(e) => handleInputChange('motherName', e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="motherMobile">Mobile</Label>
                          <Input
                            id="motherMobile"
                            type="tel"
                            value={formData.motherMobile}
                            onChange={(e) => handleInputChange('motherMobile', e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div>
                      <Label htmlFor="address">House No / Street</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="village">Village</Label>
                        <Input
                          id="village"
                          value={formData.village}
                          onChange={(e) => handleInputChange('village', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postOffice">Post Office</Label>
                        <Input
                          id="postOffice"
                          value={formData.postOffice}
                          onChange={(e) => handleInputChange('postOffice', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="district">District</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pinCode">PIN Code</Label>
                        <Input
                          id="pinCode"
                          value={formData.pinCode}
                          onChange={(e) => handleInputChange('pinCode', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <div className="space-y-3">
                    {['Birth Certificate', 'Aadhar (Student)', 'Aadhar (Parent)', 'Last Marksheet', 'Transfer Certificate', 'Caste Certificate', '4 Passport Photos', 'Migration Certificate'].map((doc) => (
                      <div key={doc} className="flex items-center space-x-2">
                        <Checkbox id={doc} />
                        <Label htmlFor={doc} className="cursor-pointer">{doc}</Label>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 6 && (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm leading-relaxed">
                        I hereby declare that all the information provided in this admission form is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of admission.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="declaration"
                        checked={formData.declarationAccepted}
                        onCheckedChange={(checked) => handleInputChange('declarationAccepted', checked)}
                        required
                      />
                      <Label htmlFor="declaration" className="cursor-pointer">
                        I accept the declaration *
                      </Label>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex-1"
                  style={{ backgroundColor: '#1A3C8F' }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading || !formData.declarationAccepted}
                  className="flex-1"
                  style={{ backgroundColor: '#1A3C8F' }}
                >
                  {loading ? 'Submitting...' : 'Submit Form Online'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdmissionForm;