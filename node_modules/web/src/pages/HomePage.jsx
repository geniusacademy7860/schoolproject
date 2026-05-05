import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Award, BookOpen, Shield, Lightbulb, DollarSign, Calendar, Download, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import pb from '@/lib/pocketbaseClient';
const HomePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const records = await pb.collection('notices').getList(1, 5, {
          sort: '-date',
          filter: 'displayOnHome = true',
          $autoCancel: false
        });
        setNotices(records.items);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);
  const features = [{
    icon: Users,
    title: 'Experienced Teachers',
    description: 'Qualified and dedicated faculty with years of teaching experience'
  }, {
    icon: Lightbulb,
    title: 'Smart Classrooms',
    description: 'Modern teaching aids and digital learning resources'
  }, {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Secure campus with CCTV surveillance and safety measures'
  }, {
    icon: DollarSign,
    title: 'Affordable Fees',
    description: 'Quality education at reasonable fee structure'
  }];
  const classes = [{
    range: 'Nursery - KG',
    medium: 'Play Group & Kindergarten',
    path: '/#classes'
  }, {
    range: 'Class 1-5',
    medium: 'Primary Education',
    path: '/#classes'
  }, {
    range: 'Class 6-8',
    medium: 'Middle School',
    path: '/#classes'
  }, {
    range: 'Class 9-10',
    medium: 'Secondary (CBSE)',
    path: '/#classes'
  }, {
    range: 'Class 11-12',
    medium: 'Senior Secondary',
    path: '/#classes'
  }];
  const getCategoryColor = category => {
    const colors = {
      'Exam': 'bg-blue-100 text-blue-800',
      'Holiday': 'bg-green-100 text-green-800',
      'Admission': 'bg-yellow-100 text-yellow-800',
      'Result': 'bg-purple-100 text-purple-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };
  return <>
      <Helmet>
        <title>Genius Academy Forbesganj - Quality Education for a Better Future</title>
        <meta name="description" content="Genius Academy Forbesganj offers quality CBSE education from Nursery to Class 12. Established in 2005, serving 500+ students with experienced faculty and modern facilities." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center px-4" style={{
      height: '580px',
      backgroundImage: 'url(https://images.unsplash.com/photo-1633526410179-cb915bdbda39)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="absolute inset-0" style={{
        backgroundColor: 'rgba(26, 60, 143, 0.85)'
      }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 px-4 py-1.5">
            Estd. 2005 | Forbesganj, Bihar
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{
          letterSpacing: '-0.02em'
        }}>
            Genius Academy Forbesganj
          </h1>
          <h2 className="text-xl md:text-2xl text-white/90 mb-8 font-medium">
            Quality Education for a Better Future
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => navigate('/admission')} className="h-12 px-8 text-base" style={{
            backgroundColor: '#F5A623',
            color: '#1C1C1C'
          }}>
              Admissions Open 2025
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Contact Now
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">CBSE Affiliated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">500+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">14+ Years</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notice Marquee */}
      <div className="py-3 overflow-hidden" style={{
      backgroundColor: '#F5A623'
    }}>
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium mx-8" style={{
          color: '#1C1C1C'
        }}>
            🎓 Admissions Open for Session 2025-26 | Limited Seats Available
          </span>
          <span className="text-sm font-medium mx-8" style={{
          color: '#1C1C1C'
        }}>
            📚 New Coaching Batches Starting from June 2025
          </span>
          <span className="text-sm font-medium mx-8" style={{
          color: '#1C1C1C'
        }}>
            🏆 100% Result in Class 10 Board Exams 2024
          </span>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-3">
              <div className="text-sm font-semibold tracking-wide uppercase mb-3" style={{
              color: '#F5A623'
            }}>
                About Us
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{
              letterSpacing: '-0.02em'
            }}>
                Shaping Young Minds Since 2005
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
                Genius Academy Forbesganj is a premier educational institution committed to providing quality education to students from Nursery to Class 12. With CBSE affiliation and a team of experienced educators, we focus on holistic development of every child.
              </p>
              <div className="space-y-4 mb-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4 bg-primary text-primary-foreground">
                    <h3 className="font-semibold mb-2">Our Vision</h3>
                    <p className="text-sm text-primary-foreground/90">
                      To be a center of excellence in education, nurturing responsible citizens and future leaders.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4" style={{
                borderLeftColor: '#F5A623'
              }}>
                  <CardContent className="p-4" style={{
                  backgroundColor: '#F5A623',
                  color: '#1C1C1C'
                }}>
                    <h3 className="font-semibold mb-2">Our Mission</h3>
                    <p className="text-sm opacity-90">
                      Provide affordable, quality education with modern teaching methods and strong moral values.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <a href="#contact" className="text-primary font-medium hover:underline">
                Learn More →
              </a>
            </div>
            <div className="md:col-span-2">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1596488711620-b36f025a805a" alt="Students in classroom" className="rounded-2xl shadow-lg w-full" />
                <Card className="absolute -bottom-6 -left-6 shadow-xl">
                  <CardContent className="p-6 bg-white">
                    <div className="text-4xl font-bold mb-1" style={{
                    color: '#1A3C8F'
                  }}>500+</div>
                    <div className="text-sm text-muted-foreground">Happy Students</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
            letterSpacing: '-0.02em'
          }}>
              Why Choose Genius Academy?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a nurturing environment with modern facilities and experienced faculty
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-transparent hover:border-t-[#F5A623]">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                backgroundColor: '#EAF0FB'
              }}>
                    <feature.icon className="w-8 h-8" style={{
                  color: '#1A3C8F'
                }} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
            letterSpacing: '-0.02em'
          }}>
              Classes We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From foundational learning to board exam preparation
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {classes.map((cls, index) => <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold mb-2" style={{
                color: '#1A3C8F'
              }}>
                    {cls.range}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{cls.medium}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Coaching Teaser */}
      <section className="py-20" style={{
      backgroundColor: '#EAF0FB'
    }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="border-none shadow-xl">
            <CardContent className="p-12">
              <Award className="w-16 h-16 mx-auto mb-6" style={{
              color: '#1A3C8F'
            }} />
              <h2 className="text-3xl font-bold mb-4" style={{
              color: '#1A3C8F'
            }}>
                Genius Coaching Center
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Special Coaching for Class 9 to 12 — Science & Commerce
              </p>
              <Button size="lg" onClick={() => navigate('/coaching')} style={{
              backgroundColor: '#F5A623',
              color: '#1C1C1C'
            }}>
                Explore Coaching
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
            letterSpacing: '-0.02em'
          }}>
              Campus Gallery
            </h2>
            <p className="text-muted-foreground">A glimpse of our vibrant campus life</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {['https://images.unsplash.com/photo-1503676260728-1c00da094a0b', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45', 'https://images.unsplash.com/photo-1509062522246-3755977927d7', 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'].map((img, index) => <div key={index} className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer">
                <img src={img} alt={`Campus photo ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg">
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section id="notices" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
            letterSpacing: '-0.02em'
          }}>
              Notice Board
            </h2>
            <p className="text-muted-foreground">Stay updated with latest announcements</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 text-lg">Latest Notices</h3>
                  {loading ? <div className="space-y-4">
                      {[1, 2, 3].map(i => <div key={i} className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>)}
                    </div> : notices.length > 0 ? <div className="space-y-4">
                      {notices.map(notice => <div key={notice.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {new Date(notice.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                                </span>
                                <Badge className={getCategoryColor(notice.category)}>
                                  {notice.category}
                                </Badge>
                              </div>
                              <h4 className="font-medium mb-1">{notice.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notice.content}
                              </p>
                            </div>
                            {notice.attachmentPDF && <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>}
                          </div>
                        </div>)}
                    </div> : <p className="text-muted-foreground text-center py-8">No notices available</p>}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center" style={{
                      backgroundColor: '#EAF0FB'
                    }}>
                        <div className="text-xs font-medium" style={{
                        color: '#1A3C8F'
                      }}>JUN</div>
                        <div className="text-lg font-bold" style={{
                        color: '#1A3C8F'
                      }}>15</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Annual Sports Day</div>
                        <div className="text-xs text-muted-foreground">School Ground</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg flex flex-col items-center justify-center" style={{
                      backgroundColor: '#EAF0FB'
                    }}>
                        <div className="text-xs font-medium" style={{
                        color: '#1A3C8F'
                      }}>JUL</div>
                        <div className="text-lg font-bold" style={{
                        color: '#1A3C8F'
                      }}>01</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">New Session Begins</div>
                        <div className="text-xs text-muted-foreground">2025-26</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2" style={{
              borderColor: '#F5A623'
            }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Admission Deadline</h3>
                  <div className="text-3xl font-bold mb-2" style={{
                  color: '#1A3C8F'
                }}>15 Days</div>
                  <p className="text-sm text-muted-foreground mb-4">Remaining for Session 2025-26</p>
                  <Button className="w-full" onClick={() => navigate('/admission')} style={{
                  backgroundColor: '#F5A623',
                  color: '#1C1C1C'
                }}>
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Student Portal Teaser */}
      <section className="py-20" style={{
      backgroundColor: '#1A3C8F'
    }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{
          letterSpacing: '-0.02em'
        }}>
            Students & Parents
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Check Attendance and Results Online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/student-login')} className="h-12 px-8 bg-white hover:bg-white/90" style={{
            color: '#1A3C8F'
          }}>
              Student Login
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-white text-white hover:bg-white" style={{
            backgroundColor: '#F5A623',
            borderColor: '#F5A623',
            color: '#1C1C1C'
          }}>
              Check Result
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
            letterSpacing: '-0.02em'
          }}>
              Get In Touch
            </h2>
            <p className="text-muted-foreground">Visit us or reach out for any queries</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                backgroundColor: '#EAF0FB'
              }}>
                  <MapPin className="w-6 h-6" style={{
                  color: '#1A3C8F'
                }} />
                </div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-sm text-muted-foreground">
                  Main Road, Forbesganj<br />
                  Araria District, Bihar 854318
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                backgroundColor: '#EAF0FB'
              }}>
                  <Phone className="w-6 h-6" style={{
                  color: '#1A3C8F'
                }} />
                </div>
                <h3 className="font-semibold mb-2">Phone & WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  +91 98765 43210<br />
                  +91 98765 43211
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                backgroundColor: '#EAF0FB'
              }}>
                  <Mail className="w-6 h-6" style={{
                  color: '#1A3C8F'
                }} />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">
                  info@geniusacademy.edu.in<br />
                  admission@geniusacademy.edu.in
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{
          height: '300px'
        }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.5!2d87.26!3d26.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE4JzAwLjAiTiA4N8KwMTUnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen="" loading="lazy" title="Genius Academy Forbesganj Location"></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{
      backgroundColor: '#0D2459'
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6" style={{
                  color: '#1A3C8F'
                }} />
                </div>
                <div>
                  <div className="font-bold text-white">Genius Academy</div>
                  <div className="text-xs text-white/70">Forbesganj</div>
                </div>
              </div>
              <p className="text-sm text-white/70 mb-4">
                Quality education for a better future since 2005
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/#classes" className="hover:text-white transition-colors">Classes</a></li>
                <li><a href="/#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="/#notices" className="hover:text-white transition-colors">Notice Board</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Coaching</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 9-10</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 11-12 Science</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Class 11-12 Commerce</a></li>
                <li><a href="/coaching" className="hover:text-white transition-colors">Batch Timings</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Main Road, Forbesganj</li>
                <li>Araria, Bihar 854318</li>
                <li>Phone: +91 98765 43210</li>
                <li>Email: info@geniusacademy.edu.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-sm text-white/70">
            <p>&copy; 2025 Genius Academy Forbesganj. All rights reserved.</p>
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
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>;
};
export default HomePage;