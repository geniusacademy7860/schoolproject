import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const ResultPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('student_id', currentUser.id)
        .order('created_at', { ascending: false });
      if (!error) setResults(data || []);
      setLoading(false);
    };
    fetchResults();
  }, [currentUser]);

  const getGrade = (obtained, total) => {
    if (!obtained || !total) return { grade: '-', color: 'bg-slate-100 text-slate-600' };
    const pct = (obtained / total) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'bg-green-100 text-green-700' };
    if (pct >= 80) return { grade: 'A', color: 'bg-green-100 text-green-700' };
    if (pct >= 70) return { grade: 'B+', color: 'bg-blue-100 text-blue-700' };
    if (pct >= 60) return { grade: 'B', color: 'bg-blue-100 text-blue-700' };
    if (pct >= 50) return { grade: 'C', color: 'bg-yellow-100 text-yellow-700' };
    if (pct >= 33) return { grade: 'D', color: 'bg-orange-100 text-orange-700' };
    return { grade: 'F', color: 'bg-red-100 text-red-700' };
  };

  const getSubjects = (result) => [
    { name: 'Hindi', obtained: result.hindi, total: result.hindi_total || 100 },
    { name: 'English', obtained: result.english, total: result.english_total || 100 },
    { name: 'Mathematics', obtained: result.mathematics, total: result.mathematics_total || 100 },
    { name: 'Science', obtained: result.science, total: result.science_total || 100 },
    { name: 'Social Science', obtained: result.social_science, total: result.social_science_total || 100 },
  ];

  const getTotals = (result) => {
    const subjects = getSubjects(result);
    const totalObtained = subjects.reduce((s, sub) => s + (sub.obtained || 0), 0);
    const totalMax = subjects.reduce((s, sub) => s + (sub.total || 0), 0);
    const pct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;
    return { totalObtained, totalMax, pct };
  };

  // PDF Download — FIXED WIDTH always, mobile ya laptop dono pe same result
  const handleDownload = async (result) => {
    setDownloading(true);
    toast.info('Preparing report card...');

    try {
      const subjects = getSubjects(result);
      const { totalObtained, totalMax, pct } = getTotals(result);
      const overallGrade = getGrade(totalObtained, totalMax);

      // Fixed HTML — always desktop size, screen size se koi fark nahi
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              color: #1a1a1a;
              background: white;
              width: 794px;
              padding: 30px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #1A3C8F;
              padding-bottom: 16px;
              margin-bottom: 20px;
            }
            .school-name {
              font-size: 26px;
              font-weight: bold;
              color: #1A3C8F;
              letter-spacing: 1px;
            }
            .school-sub {
              font-size: 13px;
              color: #555;
              margin-top: 4px;
            }
            .report-title {
              font-size: 18px;
              font-weight: bold;
              color: #F5A623;
              margin-top: 8px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .student-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              background: #EAF0FB;
              padding: 14px 18px;
              border-radius: 8px;
              margin-bottom: 20px;
              font-size: 13px;
            }
            .info-row {
              display: flex;
              gap: 6px;
            }
            .info-label {
              font-weight: bold;
              color: #1A3C8F;
              min-width: 110px;
            }
            .info-value { color: #333; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #1A3C8F;
              color: white;
              padding: 10px 14px;
              text-align: left;
              font-size: 13px;
            }
            td {
              padding: 9px 14px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }
            tr:nth-child(even) td { background: #f8faff; }
            .grade-badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 12px;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin-bottom: 20px;
            }
            .summary-box {
              background: #EAF0FB;
              border-radius: 8px;
              padding: 12px;
              text-align: center;
            }
            .summary-value {
              font-size: 22px;
              font-weight: bold;
              color: #1A3C8F;
            }
            .summary-label {
              font-size: 11px;
              color: #666;
              margin-top: 3px;
            }
            .pass { color: #16a34a; font-weight: bold; }
            .fail { color: #dc2626; font-weight: bold; }
            .footer {
              border-top: 2px solid #1A3C8F;
              padding-top: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              font-size: 12px;
              color: #666;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 160px;
              text-align: center;
              padding-top: 4px;
              font-size: 12px;
              margin-top: 30px;
            }
            .result-status {
              background: ${parseFloat(pct) >= 33 ? '#dcfce7' : '#fee2e2'};
              color: ${parseFloat(pct) >= 33 ? '#16a34a' : '#dc2626'};
              padding: 8px 16px;
              border-radius: 6px;
              font-weight: bold;
              font-size: 15px;
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Genius Academy Forbesganj</div>
            <div class="school-sub">
              Govt. of Bihar Approved | Regd. No.: FP-217/15 | S.Code: 10071811007<br/>
              Dhatta Tola, Genius Academy Road, Forbesganj, Araria, Bihar<br/>
              📞 +91 82980 68098 | +91 98521 40097
            </div>
            <div class="report-title">📋 Academic Report Card</div>
          </div>

          <div class="student-info">
            <div class="info-row">
              <span class="info-label">Student Name:</span>
              <span class="info-value">${result.student_name || currentUser?.name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Exam:</span>
              <span class="info-value">${result.exam_name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Class:</span>
              <span class="info-value">Class ${result.class || currentUser?.class || 'N/A'} - ${result.section || currentUser?.section || ''}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Academic Year:</span>
              <span class="info-value">${result.academic_year || '2024-25'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Roll Number:</span>
              <span class="info-value">${currentUser?.rollNumber || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Class Rank:</span>
              <span class="info-value">${result.rank ? `#${result.rank}` : 'Not assigned'}</span>
            </div>
          </div>

          <div class="result-status">
            ${parseFloat(pct) >= 33 ? '✅ RESULT: PASS' : '❌ RESULT: FAIL'}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            Overall: ${pct}% — Grade: ${overallGrade.grade}
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th style="text-align:center">Marks Obtained</th>
                <th style="text-align:center">Maximum Marks</th>
                <th style="text-align:center">Percentage</th>
                <th style="text-align:center">Grade</th>
                <th style="text-align:center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${subjects.map(sub => {
                const pctSub = sub.total > 0 && sub.obtained != null
                  ? ((sub.obtained / sub.total) * 100).toFixed(1)
                  : null;
                const g = getGrade(sub.obtained, sub.total);
                const pass = sub.obtained != null && sub.obtained >= (sub.total * 0.33);
                return `
                  <tr>
                    <td><strong>${sub.name}</strong></td>
                    <td style="text-align:center">${sub.obtained ?? '-'}</td>
                    <td style="text-align:center">${sub.total}</td>
                    <td style="text-align:center">${pctSub ? `${pctSub}%` : '-'}</td>
                    <td style="text-align:center">
                      <span class="grade-badge" style="background:${g.grade === 'F' ? '#fee2e2' : '#dcfce7'};color:${g.grade === 'F' ? '#dc2626' : '#16a34a'}">
                        ${g.grade}
                      </span>
                    </td>
                    <td style="text-align:center" class="${pass ? 'pass' : 'fail'}">
                      ${sub.obtained != null ? (pass ? 'Pass' : 'Fail') : '-'}
                    </td>
                  </tr>
                `;
              }).join('')}
              <tr style="background:#1A3C8F;color:white;">
                <td><strong>TOTAL</strong></td>
                <td style="text-align:center"><strong>${totalObtained}</strong></td>
                <td style="text-align:center"><strong>${totalMax}</strong></td>
                <td style="text-align:center"><strong>${pct}%</strong></td>
                <td style="text-align:center"><strong>${overallGrade.grade}</strong></td>
                <td style="text-align:center" class="${parseFloat(pct) >= 33 ? 'pass' : 'fail'}" style="color:white">
                  <strong>${parseFloat(pct) >= 33 ? 'PASS' : 'FAIL'}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-box">
              <div class="summary-value">${totalObtained}/${totalMax}</div>
              <div class="summary-label">Total Marks</div>
            </div>
            <div class="summary-box">
              <div class="summary-value">${pct}%</div>
              <div class="summary-label">Percentage</div>
            </div>
            <div class="summary-box">
              <div class="summary-value">${overallGrade.grade}</div>
              <div class="summary-label">Overall Grade</div>
            </div>
            <div class="summary-box">
              <div class="summary-value">${result.rank ? `#${result.rank}` : 'N/A'}</div>
              <div class="summary-label">Class Rank</div>
            </div>
          </div>

          <div class="footer">
            <div>
              <div>Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div style="margin-top:2px;color:#999;font-size:11px">This is a computer generated report card.</div>
            </div>
            <div style="text-align:center">
              <div class="signature-line">Principal's Signature</div>
              <div style="margin-top:4px;font-size:11px;color:#1A3C8F;font-weight:bold">Md. Naushad Ansari</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:#1A3C8F;font-weight:bold">Genius Academy Forbesganj</div>
              <div style="font-size:10px;color:#999;margin-top:2px">Estd. March 2012 | Govt. of Bihar Approved</div>
            </div>
          </div>
        </body>
        </html>
      `;

      // New window mein open karo aur print/save karo
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Window load hone ke baad print dialog open karo
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setDownloading(false);
          toast.success('Report card ready! Save as PDF from print dialog.');
        }, 500);
      };

    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report card');
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/student-dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Results</h1>
            <p className="text-sm text-slate-500">View and download your report cards</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading results...</div>
        ) : results.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-20 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No results found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {results.map(result => {
              const subjects = getSubjects(result);
              const { totalObtained, totalMax, pct } = getTotals(result);
              const overallGrade = getGrade(totalObtained, totalMax);
              const passed = parseFloat(pct) >= 33;

              return (
                <Card key={result.id} className="border-0 shadow-lg overflow-hidden">

                  {/* Header */}
                  <div className="p-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #1A3C8F, #2563eb)' }}>
                    <div>
                      <h3 className="font-bold text-white text-lg">{result.exam_name}</h3>
                      <p className="text-white/70 text-sm">{result.academic_year} | Class {result.class}-{result.section}</p>
                    </div>
                    <Button
                      onClick={() => handleDownload(result)}
                      disabled={downloading}
                      size="sm"
                      className="flex items-center gap-2 bg-white hover:bg-white/90"
                      style={{ color: '#1A3C8F' }}
                    >
                      <Download className="w-4 h-4" />
                      {downloading ? 'Preparing...' : 'Download PDF'}
                    </Button>
                  </div>

                  <CardContent className="p-5">

                    {/* Summary Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#1A3C8F]">{totalObtained}/{totalMax}</div>
                        <div className="text-xs text-slate-500">Total Marks</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className={`text-lg font-bold ${parseFloat(pct) >= 75 ? 'text-green-600' : parseFloat(pct) >= 33 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {pct}%
                        </div>
                        <div className="text-xs text-slate-500">Percentage</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-[#1A3C8F]">{overallGrade.grade}</div>
                        <div className="text-xs text-slate-500">Grade</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <div className={`text-lg font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>
                          {passed ? 'PASS' : 'FAIL'}
                        </div>
                        <div className="text-xs text-slate-500">Result</div>
                      </div>
                    </div>

                    {/* Subject Table — Scrollable on mobile */}
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-sm" style={{ minWidth: '400px' }}>
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                          <tr>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-center">Obtained</th>
                            <th className="px-4 py-3 text-center">Total</th>
                            <th className="px-4 py-3 text-center">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {subjects.map(sub => {
                            const g = getGrade(sub.obtained, sub.total);
                            return (
                              <tr key={sub.name} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium">{sub.name}</td>
                                <td className="px-4 py-3 text-center font-semibold">
                                  {sub.obtained ?? '-'}
                                </td>
                                <td className="px-4 py-3 text-center text-slate-500">
                                  {sub.total}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <Badge className={g.color}>{g.grade}</Badge>
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-[#EAF0FB] font-semibold">
                            <td className="px-4 py-3 text-[#1A3C8F]">TOTAL</td>
                            <td className="px-4 py-3 text-center text-[#1A3C8F]">{totalObtained}</td>
                            <td className="px-4 py-3 text-center text-[#1A3C8F]">{totalMax}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge className={overallGrade.color}>{overallGrade.grade}</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {result.rank && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-medium">
                          Class Rank: #{result.rank}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* How to download tip for mobile */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700 font-medium">📱 how to save pdf on mobile or Laptop:</p>
          <ol className="text-xs text-blue-600 mt-2 space-y-1 list-decimal list-inside">
            <li>Click the "Download PDF" button</li>
            <li>Print Page will open</li>
            <li>Select "Save as PDF" in "Destination"</li>
            <li>Click the "Save" button</li>
          </ol>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;