import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Award, BookOpen, Bus, Monitor, Home, Calendar, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import pb from '@/lib/pocketbaseClient';

const HomePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [pbGallery, setPbGallery] = useState([]);
  const [pbEvents, setPbEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, galleryRes, eventsRes] = await Promise.all([
          pb.collection('Notices').getList(1, 5, { sort: '-date', $autoCancel: false }),
          pb.collection('gallery').getFullList({ sort: '-created', $autoCancel: false }),
          pb.collection('events').getFullList({ sort: '-created', $autoCancel: false }),
        ]);
        setNotices(noticesRes.items);
        setPbGallery(galleryRes);
        setPbEvents(eventsRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGalleryImageUrl = (record) => {
    if (!record.image) return null;
    return `${pb.baseUrl}/api/files/gallery/${record.id}/${record.image}`;
  };

  const getEventImageUrl = (record) => {
    if (!record.image) return null;
    return `${pb.baseUrl}/api/files/events/${record.id}/${record.image}`;
  };

  const features = [
    { icon: Users, title: 'Experienced Teachers', description: 'Qualified and dedicated faculty with years of teaching experience' },
    { icon: Bus, title: 'School Van Facility', description: 'Safe and reliable transport facility for students' },
    { icon: Home, title: 'Hostel Facility', description: 'Residential facility available for outstation students' },
    { icon: Monitor, title: 'Computer Classes', description: 'Modern computer lab with latest equipment and software' }
  ];

  const schoolClasses = [
    { range: 'Play Group', medium: 'Pre-Primary Education' },
    { range: 'Class 1 - 3', medium: 'Primary Education' },
    { range: 'Class 4 - 5', medium: 'Upper Primary' },
    { range: 'Class 6 - 7', medium: 'Middle School' },
    { range: 'Class 8', medium: 'Upper Middle School' },
  ];

  const staticEvents = [
    { src: '/images/gallery/events/event1.jpg', title: 'Annual Function 2024', date: 'January 2024' },
    { src: '/images/gallery/events/event2.jpg', title: 'Independence Day', date: 'August 2024' },
    { src: '/images/gallery/events/event3.jpg', title: 'Sports Day', date: 'December 2024' },
    { src: '/images/gallery/events/event4.jpg', title: 'Republic Day', date: 'January 2025' },
    { src: '/images/gallery/events/event5.jpg', title: "Children's Day", date: 'November 2024' },
    { src: '/images/gallery/events/event6.jpg', title: 'Prize Distribution', date: 'March 2025' },
    { src: '/images/gallery/events/event7.jpg', title: 'Matric Exam', date: 'February 2026' },
    { src: '/images/gallery/events/event8.jpg', title: 'Old Celebration', date: 'October 2015' },
  ];

  const getCategoryColor = category => {
    const colors = {
      'Exam': 'bg-blue-100 text-blue-800',
      'Holiday': 'bg-green-100 text-green-800',
      'Fee': 'bg-yellow-100 text-yellow-800',
      'Event': 'bg-purple-100 text-purple-800',
      'Urgent': 'bg-red-100 text-red-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };

  return (
    <>
      <Helmet>
        <title>Genius Academy Forbesganj - Approved by Govt. of Bihar</title>
        <meta name="description" content="Genius Academy Forbesganj - Residential School Play Group to Class 8. Genius Coaching Center Class 6-12 Arts & Science. Approved by Govt. of Bihar. Estd. March 2012." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center text-center px-4"
        style={{
          height: '520px',
          backgroundImage: 'url(/images/hero/school-building.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26, 60, 143, 0.85)' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 px-4 py-1.5">
            Estd. March-2012 | Approved by Govt. of Bihar
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
            Genius Academy
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-2">Forbesganj</h2>
          <p className="text-lg text-white/80 mb-6">Genius Coaching Center</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button size="lg" onClick={() => navigate('/admission')} className="h-12 px-8 text-base" style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>
              Admission Free — Apply Now
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent text-white border-white hover:bg-white hover:text-primary" onClick={() => window.location.href = 'tel:8298068098'}>
              Call: 82980 68098
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Govt. of Bihar Approved</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Residential School</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">Admission Free</span></div>
          </div>
        </div>
      </section>

      {/* Notice Marquee */}
      <div className="py-3 overflow-hidden" style={{ backgroundColor: '#F5A623' }}>
        <div className="animate-marquee whitespace-nowrap">
          {[1, 2].map(i => (
            <span key={i}>
              <span className="text-sm font-medium mx-8" style={{ color: '#1C1C1C' }}>🎓 Admission FREE — Session 2025-26 | Play Group to Class 8 (School) | Class 6-12 (Coaching)</span>
              <span className="text-sm font-medium mx-8" style={{ color: '#1C1C1C' }}>📚 Genius Coaching Center — Bihar Board Class 6 to 12 | Arts & Science</span>
              <span className="text-sm font-medium mx-8" style={{ color: '#1C1C1C' }}>🏠 Hostel Facility Available | School Van Facility | Computer Classes</span>
              <span className="text-sm font-medium mx-8" style={{ color: '#1C1C1C' }}>📞 Contact: 82980 68098 | 98521 40097</span>
            </span>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <div className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: '#F5A623' }}>About Us</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em' }}>Shaping Young Minds Since March 2012</h2>
              <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
                Genius Academy Forbesganj is a Govt. of Bihar approved Residential School offering quality education from Play Group to Class 8. Our Genius Coaching Center provides specialized Bihar Board coaching from Class 6 to 12 in Arts and Science streams.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
                Regd. No.: FP-217/15 | Trust Deed No.: 212/17 | S.Code: 10071811007
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-[#EAF0FB] text-center">
                  <div className="text-2xl font-bold text-[#1A3C8F]">12+</div>
                  <div className="text-sm text-slate-600">Years of Excellence</div>
                </div>
                <div className="p-4 rounded-xl bg-[#EAF0FB] text-center">
                  <div className="text-2xl font-bold text-[#1A3C8F]">FREE</div>
                  <div className="text-sm text-slate-600">Admission</div>
                </div>
              </div>
              <div className="space-y-3">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4 bg-primary text-primary-foreground">
                    <h3 className="font-semibold mb-1">Our Vision</h3>
                    <p className="text-sm text-primary-foreground/90">To be a center of excellence in education, nurturing responsible citizens and future leaders of Bihar.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4" style={{ borderLeftColor: '#F5A623' }}>
                  <CardContent className="p-4" style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>
                    <h3 className="font-semibold mb-1">Our Mission</h3>
                    <p className="text-sm opacity-90">Provide free, quality education with modern teaching methods and strong moral values to every child.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="relative">
                <img
                  src="/images/gallery/campus/school-students.jpg"
                  alt="Genius Academy Students"
                  className="rounded-2xl shadow-lg w-full object-cover"
                  style={{ height: '350px', imageOrientation: 'from-image' }}
                />
                <Card className="absolute -bottom-6 -left-6 shadow-xl">
                  <CardContent className="p-4 bg-white flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
                      <img src="/images/principal/principal.jpg" alt="Principal" className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }}
                        onError={(e) => { e.target.parentElement.innerHTML = `<div style="width:56px;height:56px;border-radius:50%;background:#EAF0FB;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:bold;color:#1A3C8F">MN</div>`; }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#1A3C8F' }}>Principal</div>
                      <div className="text-xs text-muted-foreground">Md. Naushad Ansari</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>Our Facilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We provide a nurturing residential environment with modern facilities</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-transparent hover:border-t-[#F5A623]">
                <CardContent className="p-6 text-center">
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

      {/* School Classes */}
      <section id="classes" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>School — Play Group to Class 8</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Bihar Board Residential School | Admission FREE</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {schoolClasses.map((cls, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-xl font-bold mb-2" style={{ color: '#1A3C8F' }}>{cls.range}</div>
                  <p className="text-sm text-muted-foreground mb-4">{cls.medium}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/admission')}>Apply Free</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Teaser */}
      <section className="py-20" style={{ backgroundColor: '#EAF0FB' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="border-none shadow-xl">
            <CardContent className="p-12">
              <Award className="w-16 h-16 mx-auto mb-6" style={{ color: '#1A3C8F' }} />
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A3C8F' }}>Genius Coaching Center</h2>
              <p className="text-base font-semibold text-slate-600 mb-4">Bihar Board | Class 6 to 12</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge className="bg-[#1A3C8F] text-white px-4 py-1">Arts Stream</Badge>
                <Badge className="bg-[#F5A623] text-[#1C1C1C] px-4 py-1">Science Stream</Badge>
                <Badge className="bg-green-100 text-green-800 px-4 py-1">Special Inter Classes</Badge>
              </div>
              <p className="text-muted-foreground mb-6">Expert coaching for Bihar Board students with special focus on Inter (Arts & Science)</p>
              <Button size="lg" onClick={() => navigate('/coaching')} style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>Explore Coaching</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>Campus Gallery</h2>
            <p className="text-muted-foreground">A glimpse of our vibrant campus life</p>
          </div>

          {/* Campus Photos — Static */}
          <div className="mb-14">
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-900">Our Campus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { src: '/images/gallery/campus/school-students.jpg', title: 'School Students' },
                { src: '/images/gallery/campus/school-students1.jpg', title: 'Campus View' },
                { src: '/images/gallery/campus/school-students2.jpg', title: 'School Activities' },
              ].map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '280px' }}>
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" style={{ imageOrientation: 'from-image' }}
                    onError={(e) => { e.target.parentElement.style.background = '#EAF0FB'; e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-white text-lg font-bold text-center px-2">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nursery Photos — Static */}
          <div className="mb-14">
            <h3 className="text-2xl font-bold mb-6 text-center text-pink-700">Nursery & UKG Students</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                '/images/nursery/photo1.jpg',
                '/images/nursery/photo2.jpg',
                '/images/nursery/photo3.jpg',
                '/images/nursery/photo4.jpg',
                '/images/nursery/photo5.jpg',
                '/images/nursery/photo6.jpg',
              ].map((src, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg" style={{ height: '280px' }}>
                  <img src={src} alt={`Nursery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" style={{ imageOrientation: 'from-image' }}
                    onError={(e) => { e.target.parentElement.style.background = '#fce7f3'; e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-white text-lg font-bold">Nursery Kids</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Principal Section — Static */}
          <div className="mb-14">
            <h3 className="text-2xl font-bold mb-6 text-center text-green-700">Our Principal</h3>
            <div className="flex justify-center">
              <div className="max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white">
                <img src="/images/principal/principal.jpg" alt="Principal" className="w-full object-cover" style={{ height: '400px', imageOrientation: 'from-image' }}
                  onError={(e) => { e.target.parentElement.innerHTML = `<div style="height:200px;background:#EAF0FB;display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:bold;color:#1A3C8F">MN</div>`; }}
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-blue-900">Md. Naushad Ansari</h3>
                  <p className="text-muted-foreground mt-2">Principal — Genius Academy Forbesganj</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin se upload ki gayi photos — PocketBase se */}
          {pbGallery.length > 0 && (
            <div className="mb-14">
              <h3 className="text-2xl font-bold mb-6 text-center text-purple-700">More Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pbGallery.map((photo) => (
                  <div key={photo.id} className="group relative overflow-hidden rounded-xl cursor-pointer" style={{ height: '220px' }}>
                    <img src={getGalleryImageUrl(photo)} alt={photo.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" style={{ imageOrientation: 'from-image' }} />
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white font-semibold text-center px-2">{photo.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: '#F5A623' }}>School Events</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>Memorable Moments</h2>
            <p className="text-muted-foreground">Functions, celebrations aur special events ki jhalak</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Static events — jo pehle se hain */}
            {staticEvents.map((event, index) => (
              <Card key={`static-${index}`} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="overflow-hidden bg-muted" style={{ height: '200px' }}>
                  <img src={event.src} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" style={{ imageOrientation: 'from-image' }}
                    onError={(e) => { e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:13px;padding:10px;text-align:center">📷 ${event.title}</div>`; }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Admin se add kiye gaye events — PocketBase se */}
            {pbEvents.map((event) => (
              <Card key={`pb-${event.id}`} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="overflow-hidden bg-muted" style={{ height: '200px' }}>
                  {event.image ? (
                    <img src={getEventImageUrl(event)} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" style={{ imageOrientation: 'from-image' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><Calendar className="w-12 h-12" /></div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </p>
                  {event.description && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{event.description}</p>}
                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </section>

      {/* Notice Board */}
      <section id="notices" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>Notice Board</h2>
            <p className="text-muted-foreground">Stay updated with latest announcements</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-lg">Latest Notices</h3>
                  {loading ? (
                    <div className="space-y-4">{[1, 2, 3].map(i => (<div key={i} className="animate-pulse"><div className="h-4 bg-muted rounded w-3/4 mb-2"></div><div className="h-3 bg-muted rounded w-1/2"></div></div>))}</div>
                  ) : notices.length > 0 ? (
                    <div className="space-y-4">
                      {notices.map(notice => (
                        <div key={notice.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <Badge className={getCategoryColor(notice.category)}>{notice.category}</Badge>
                            {notice.isImportant && <Badge className="bg-red-100 text-red-700">Important</Badge>}
                          </div>
                          <h4 className="font-medium mb-1">{notice.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No notices available</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">School Information</h3>
                  <div className="space-y-3 text-sm">
                    {['School: Play Group to Class 8', 'Coaching: Class 6 to 12 (Bihar Board)', 'Arts & Science Stream', 'Hostel & Van Facility', 'Admission FREE'].map(info => (
                      <div key={info} className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2" style={{ borderColor: '#F5A623' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Admissions Open</h3>
                  <div className="text-3xl font-bold mb-2" style={{ color: '#1A3C8F' }}>FREE</div>
                  <p className="text-sm text-muted-foreground mb-4">Session 2025-26 | Play Group to Class 8</p>
                  <Button className="w-full" onClick={() => navigate('/admission')} style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>Apply Now — Free</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Student Portal */}
      <section className="py-20" style={{ backgroundColor: '#1A3C8F' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Students & Parents Portal</h2>
          <p className="text-white/90 text-lg mb-8">Check Attendance, Results and Fee Details Online</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/student-login')} className="h-12 px-8 bg-white hover:bg-white/90" style={{ color: '#1A3C8F' }}>Student Login</Button>
            <Button size="lg" onClick={() => navigate('/admission')} className="h-12 px-8" style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}>Apply for Admission</Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>Contact Us</h2>
            <p className="text-muted-foreground">Visit us or reach out for any queries</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card><CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}><MapPin className="w-6 h-6" style={{ color: '#1A3C8F' }} /></div>
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-sm text-muted-foreground">Dhatta Tola, Genius Academy Road<br />Forbesganj, Araria, Bihar</p>
            </CardContent></Card>
            <Card><CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}><Phone className="w-6 h-6" style={{ color: '#1A3C8F' }} /></div>
              <h3 className="font-semibold mb-2">Phone & WhatsApp</h3>
              <p className="text-sm text-muted-foreground">
                <a href="tel:8298068098" className="hover:text-primary">+91 82980 68098</a><br />
                <a href="tel:9852140097" className="hover:text-primary">+91 98521 40097</a>
              </p>
            </CardContent></Card>
            <Card><CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#EAF0FB' }}>
                <img src="/images/principal/principal.jpg" alt="Principal" className="w-full h-full rounded-xl object-cover" style={{ imageOrientation: 'from-image' }}
                  onError={(e) => { e.target.parentElement.innerHTML = `<span style="font-weight:bold;color:#1A3C8F;font-size:18px">MN</span>`; }}
                />
              </div>
              <h3 className="font-semibold mb-2">Principal</h3>
              <p className="text-sm text-muted-foreground">Md. Naushad Ansari<br /><span className="text-xs">M.N Ansari</span></p>
            </CardContent></Card>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '300px' }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.5!2d87.26!3d26.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE4JzAwLjAiTiA4N8KwMTUnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Genius Academy Location"></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: '#0D2459' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="/images/logo/logo.jpg" alt="School Logo" className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="color:#1A3C8F;font-weight:bold;font-size:12px">GA</span>'; }}
                  />
                </div>
                <div>
                  <div className="font-bold text-white">Genius Academy</div>
                  <div className="text-xs text-white/70">Forbesganj</div>
                </div>
              </div>
              <p className="text-sm text-white/70 mb-2">Govt. of Bihar Approved Residential School</p>
              <p className="text-xs text-white/50 mb-4">Regd. No.: FP-217/15 | Estd. March-2012</p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/#classes" className="hover:text-white transition-colors">School Classes</a></li>
                <li><a href="/#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="/#notices" className="hover:text-white transition-colors">Notice Board</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Coaching Center</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 6-8</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 9-10</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 11-12 Arts</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 11-12 Science</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Batch Timings</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Dhatta Tola, Genius Academy Road</li>
                <li>Forbesganj, Araria, Bihar</li>
                <li><a href="tel:8298068098" className="hover:text-white">+91 82980 68098</a></li>
                <li><a href="tel:9852140097" className="hover:text-white">+91 98521 40097</a></li>
                <li>Principal: Md. Naushad Ansari</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm text-white/70">
            <p>© 2025 Genius Academy Forbesganj. All rights reserved. | Regd. No.: FP-217/15 | S.Code: 10071811007</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </>
  );
};

export default HomePage;