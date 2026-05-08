import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResultPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const reportRef = useRef();

  useEffect(() => {
    const fetchResults = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('results').getFullList({
          filter: `studentId = "${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setResults(records);
        if (records.length > 0) setSelectedResult(records[0]);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [currentUser]);

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ReportCard_${currentUser?.name}_${selectedResult?.examName || 'Exam'}.pdf`);
      toast.success('Report card downloaded!');
    } catch (error) {
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  const subjects = selectedResult ? [
    { name: 'Hindi', marks: selectedResult.hindi, total: selectedResult.hindiTotal || 100 },
    { name: 'English', marks: selectedResult.english, total: selectedResult.englishTotal || 100 },
    { name: 'Mathematics', marks: selectedResult.mathematics, total: selectedResult.mathematicsTotal || 100 },
    { name: 'Science', marks: selectedResult.science, total: selectedResult.scienceTotal || 100 },
    { name: 'Social Science', marks: selectedResult.socialScience, total: selectedResult.socialScienceTotal || 100 },
  ].filter(s => s.marks !== undefined && s.marks !== null) : [];

  const totalMarks = subjects.reduce((sum, s) => sum + (s.marks || 0), 0);
  const totalMax = subjects.reduce((sum, s) => sum + (s.total || 100), 0);
  const percentage = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) : 0;
  const { grade, color } = getGrade(parseFloat(percentage));

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/student-dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">My Results</h1>
              <p className="text-sm text-slate-500">View and download your report cards</p>
            </div>
          </div>
          {selectedResult && (
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-[#1A3C8F] hover:bg-[#152e6e]"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Downloading...' : 'Download PDF'}
            </Button>
          )}
        </div>

        {/* Exam Selector */}
        {results.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedResult?.id === result.id
                    ? 'bg-[#1A3C8F] text-white'
                    : 'bg-white text-slate-600 border hover:bg-muted'
                }`}
              >
                {result.examName || 'Exam'}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading results...</div>
        ) : results.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-20 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No results found yet</p>
            </CardContent>
          </Card>
        ) : (
          /* Report Card — this div gets converted to PDF */
          <div ref={reportRef} className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* Report Card Header */}
            <div className="p-8 text-white text-center" style={{ background: 'linear-gradient(135deg, #1A3C8F 0%, #2563eb 100%)' }}>
              <h2 className="text-2xl font-bold mb-1">Genius Academy Forbesganj</h2>
              <p className="text-white/80 text-sm mb-4">Academic Report Card</p>
              <div className="inline-block bg-white/20 rounded-xl px-6 py-2">
                <span className="text-lg font-semibold">{selectedResult?.examName || 'Examination'}</span>
              </div>
            </div>

            {/* Student Info */}
            <div className="p-6 border-b bg-slate-50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Student Name</div>
                  <div className="font-semibold text-slate-800">{currentUser?.name}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Roll Number</div>
                  <div className="font-semibold text-slate-800">{currentUser?.rollNumber}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Class</div>
                  <div className="font-semibold text-slate-800">Class {currentUser?.class} - {currentUser?.section}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Academic Year</div>
                  <div className="font-semibold text-slate-800">{selectedResult?.academicYear || '2024-25'}</div>
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 rounded-l-lg text-slate-500 font-medium">Subject</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Marks Obtained</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Maximum Marks</th>
                    <th className="text-center px-4 py-3 rounded-r-lg text-slate-500 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((subject) => {
                    const subPercent = ((subject.marks / subject.total) * 100);
                    const { grade: subGrade, color: subColor } = getGrade(subPercent);
                    return (
                      <tr key={subject.name}>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            {subject.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-800">{subject.marks}</td>
                        <td className="px-4 py-3 text-center text-slate-500">{subject.total}</td>
                        <td className={`px-4 py-3 text-center font-bold ${subColor}`}>{subGrade}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#EAF0FB]">
                    <td className="px-4 py-3 font-bold text-slate-800 rounded-l-lg">Total</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">{totalMarks}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800">{totalMax}</td>
                    <td className={`px-4 py-3 text-center font-bold text-xl ${color} rounded-r-lg`}>{grade}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Summary */}
            <div className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1A3C8F]">{percentage}%</div>
                  <div className="text-xs text-slate-500 mt-1">Percentage</div>
                </div>
                <div className="text-center border-x border-slate-200">
                  <div className={`text-2xl font-bold ${color}`}>{grade}</div>
                  <div className="text-xs text-slate-500 mt-1">Overall Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {selectedResult?.rank ? `${selectedResult.rank}${selectedResult.rank === 1 ? 'st' : selectedResult.rank === 2 ? 'nd' : selectedResult.rank === 3 ? 'rd' : 'th'}` : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Class Rank</div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-slate-400 border-t pt-4">
                This is a computer generated report card — Genius Academy Forbesganj
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;