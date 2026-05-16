import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const FeePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchFees = async () => {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (!error) setFees(data || []);
      setLoading(false);
    };
    fetchFees();
  }, [currentUser]);

  const totalPaid = fees
    .filter(f => f.status === 'Paid')
    .reduce((s, f) => s + (f.amount || 0), 0);

  const totalPending = fees
    .filter(f => f.status === 'Pending')
    .reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/student-dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Fees</h1>
            <p className="text-sm text-slate-500">View your fee payment details</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  Rs.{totalPaid.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Total Paid</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  Rs.{totalPending.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">Total Pending</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Records – View only, no action */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : fees.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-20 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No fee records found</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Fee History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {fees.map(fee => (
                  <div key={fee.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-800 text-sm">
                        {fee.fee_type}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {fee.month} {fee.year}
                        {fee.paid_date ? ` — Paid on ${fee.paid_date}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">
                        Rs.{fee.amount?.toLocaleString()}
                      </span>
                      <Badge className={
                        fee.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }> 
                        {fee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Notice */}
        {totalPending > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 font-medium">⚠️ Pending Fee Notice</p>
            <p className="text-xs text-yellow-700 mt-1">
              Your Rs.{totalPending.toLocaleString()} Fee are pending.
              Please contact the school administrator.
            </p>
            <p className="text-xs text-yellow-700 font-medium mt-1">
              Contact: +91 82980 68098
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeePage;