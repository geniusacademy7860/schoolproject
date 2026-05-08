import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Award, Users, Calendar, TrendingUp, MessageCircle, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/Header';

const CoachingPage = () => {
  const navigate = useNavigate();

  const batches = [
    {
      title: 'Class 6-7-8',
      subjects: 'Hindi, English, Math, Science, Social Science',
      timing: 'Evening 4-6 PM',
      seats: '10 seats left',
      fees: 'Contact for fees',
      featured: false
    },
    {
      title: 'Class 9 Foundation',
      subjects: 'All Subjects — Bihar Board',
      timing: 'Evening 5-7 PM',
      seats: '8 seats left',
      fees: 'Contact for fees',
      featured: false
    },
    {
      title: 'Class 10 Board Exam',
      subjects: 'All Subjects + Board Preparation',
      timing: 'Morning 6-8 AM',
      seats: '5 seats left',
      fees: 'Contact for fees',
      featured: true
    },
    {
      title: 'Class 11-12 Arts',
      subjects: 'Hindi, English, History, Geography, Political Science',
      timing: 'Morning 6-8 AM',
      seats: '10 seats left',
      fees: 'Contact for fees',
      featured: false
    },
    {
      title: 'Class 11-12 Science',
      subjects: 'Physics, Chemistry, Biology, Mathematics',
      timing: 'Evening 5-7 PM',
      seats: '6 seats left',
      fees: 'Contact for fees',
      featured: false
    },
    {
      title: 'Inter Special Classes',
      subjects: 'Arts & Science — Extra Practice & Revision',
      timing: 'Sunday 9 AM-12 PM',
      seats: '15 seats left',
      fees: 'Contact for fees',
      featured: false
    }
  ];

  const features = [
    { icon: Users, title: 'Small Batch Size', description: 'Personal attention to every student' },
    { icon: Award, title: 'Weekly Tests', description: 'Regular assessment and feedback' },
    { icon: Calendar, title: 'Monthly PTM', description: 'Parent-Teacher meetings every month' },
    { icon: TrendingUp, title: 'Bihar Board Focused', description: 'Targeted board exam preparation' },
    { icon: CheckCircle, title: 'Top Results', description: '100% passing record in board exams' },
    { icon: MessageCircle, title: 'Doubt Solving', description: 'Via WhatsApp group anytime' }
  ];

  const timings = [
    { batch: 'Morning Batch', days: 'Monday - Saturday', time: '6:00 AM - 8:00 AM' },
    { batch: 'Evening Batch', days: 'Monday - Saturday', time: '5:00 PM - 7:00 PM' },
    { batch: 'Sunday Special (Inter)', days: 'Sunday', time: '9:00 AM - 12:00 PM' }
  ];

  return (
    <>
      <Helmet>
        <title>Genius Coaching Center — Bihar Board Class 6 to 12 | Forbesganj</title>
        <meta name="description" content="Genius Coaching Center Forbesganj — Bihar Board coaching for Class 6 to 12. Arts and Science streams. Special Inter classes. Contact: 82980 68098." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-24 pb-20 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1A3C8F 0%, #2563eb 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 px-4 py-1.5">
            Bihar Board | Class 6 to 12
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Genius Coaching Center
          </h1>
          <p className="text-xl text-white/90 mb-3">
            Arts & Science Coaching — Class 6 to 12
          </p>
          <p className="text-base text-white/70 mb-8">
            Special Classes for Inter (Arts & Science) | Forbesganj, Araria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8"
              style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}
              onClick={() => navigate('/admission')}
            >
              Enroll Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 bg-transparent text-white border-white hover:bg-white hover:text-primary"
              onClick={() => window.location.href = 'tel:8298068098'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call: 82980 68098
            </Button>
          </div>
        </div>
      </section>

      {/* Batches Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Available Batches
            </h2>
            <p className="text-muted-foreground">Choose the right batch for your class</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch, index) => (
              <Card
                key={index}
                className={`relative ${batch.featured ? 'border-2 shadow-lg' : ''}`}
                style={batch.featured ? { borderColor: '#F5A623' } : {}}
              >
                {batch.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{batch.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Subjects</div>
                    <div className="text-sm">{batch.subjects}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Timing</div>
                      <div className="text-sm">{batch.timing}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Seats</div>
                      <div className="text-sm font-semibold text-destructive">{batch.seats}</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-600">{batch.fees}</div>
                    <Button
                      size="sm"
                      style={batch.featured ? { backgroundColor: '#F5A623', color: '#1C1C1C' } : {}}
                      onClick={() => window.location.href = 'tel:8298068098'}
                    >
                      Enroll
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Streams We Offer
            </h2>
            <p className="text-muted-foreground">Bihar Board — Arts & Science only</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAF0FB' }}>
                    <Award className="w-5 h-5" style={{ color: '#1A3C8F' }} />
                  </div>
                  Science Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'].map((subject) => (
                    <li key={subject} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: '#27AE60' }} />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EAF0FB' }}>
                    <Award className="w-5 h-5" style={{ color: '#1A3C8F' }} />
                  </div>
                  Arts Stream
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Hindi', 'English', 'History', 'Geography', 'Political Science', 'Economics'].map((subject) => (
                    <li key={subject} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" style={{ color: '#27AE60' }} />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Why Choose Genius Coaching?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}>
                    <feature.icon className="w-8 h-8" style={{ color: '#1A3C8F' }} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timing Table */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Batch Timings
            </h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timings.map((timing, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{timing.batch}</TableCell>
                      <TableCell>{timing.days}</TableCell>
                      <TableCell>{timing.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20" style={{ backgroundColor: '#F5A623' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1C1C1C', letterSpacing: '-0.02em' }}>
            Seats Filling Fast — Enroll Today!
          </h2>
          <p className="text-lg mb-2" style={{ color: '#1C1C1C', opacity: 0.9 }}>
            Class 6 to 12 | Bihar Board | Arts & Science
          </p>
          <p className="text-base mb-8" style={{ color: '#1C1C1C', opacity: 0.8 }}>
            Dhatta Tola, Genius Academy Road, Forbesganj, Araria
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 bg-white hover:bg-white/90"
              style={{ color: '#1A3C8F' }}
              onClick={() => window.location.href = 'https://wa.me/918298068098'}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp: 82980 68098
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border-[#1C1C1C] hover:bg-black/10"
              style={{ color: '#1C1C1C' }}
              onClick={() => window.location.href = 'tel:9852140097'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call: 98521 40097
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoachingPage;