import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Classes', path: '/#classes' },
    { name: 'Coaching', path: '/coaching' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Notice Board', path: '/#notices' },
    { name: 'Contact', path: '/#contact' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
      style={{ height: '60px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight" style={{ color: '#1A3C8F' }}>
                Genius Academy
              </div>
              <div className="text-xs text-muted-foreground">Forbesganj</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student-login')}
                  className="h-11 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Student Login
                </Button>
                <Button
                  onClick={() => navigate('/admission')}
                  className="h-11"
                  style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}
                >
                  Admissions Open
                </Button>
              </>
            )}
            {isStudent && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student-dashboard')}
                  className="h-11"
                >
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="h-11">
                  Logout
                </Button>
              </>
            )}
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="h-11"
                >
                  Admin Panel
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="h-11">
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t space-y-2">
              {!isAuthenticated && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/student-login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full h-11 border-primary text-primary"
                  >
                    Student Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/admission');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full h-11"
                    style={{ backgroundColor: '#F5A623', color: '#1C1C1C' }}
                  >
                    Admissions Open
                  </Button>
                </>
              )}
              {isStudent && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/student-dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full h-11"
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full h-11"
                  >
                    Logout
                  </Button>
                </>
              )}
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate('/admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full h-11"
                  >
                    Admin Panel
                  </Button>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full h-11"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;