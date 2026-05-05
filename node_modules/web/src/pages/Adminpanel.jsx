import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, Bell } from 'lucide-react';

const AdminPanel = () => {
  return (
    <>
      <Helmet>
        <title>Admin Panel - Genius Academy Forbesganj</title>
        <meta name="description" content="Manage students, attendance, results, and notices" />
      </Helmet>

      <div className="min-h-screen bg-muted/30 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8" style={{ color: '#1A3C8F' }} />
                  <span className="text-3xl font-bold">487</span>
                </div>
                <div className="text-sm font-medium">Total Students</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8" style={{ color: '#1A3C8F' }} />
                  <span className="text-3xl font-bold">23</span>
                </div>
                <div className="text-sm font-medium">Admissions This Month</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8" style={{ color: '#1A3C8F' }} />
                  <span className="text-3xl font-bold">92.4%</span>
                </div>
                <div className="text-sm font-medium">Average Attendance</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Bell className="w-8 h-8" style={{ color: '#1A3C8F' }} />
                  <span className="text-3xl font-bold">8</span>
                </div>
                <div className="text-sm font-medium">Notices Posted</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Full admin panel functionality will be implemented with student management, attendance marking, results upload, and notice management features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;