import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

const ResultPage = () => {
  const { currentUser } = useAuth();
  const [selectedExam, setSelectedExam] = useState('Unit Test 1');
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!currentUser) return;

      try {
        const records = await pb.collection('results').getFullList({
          filter: `studentId = "${currentUser.id}" && examType = "${selectedExam}"`,
          sort: '-created',
          $autoCancel: false
        });

        if (records.length > 0) {
          setResultData(records[0]);
        } else {
          setResultData(null);
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [currentUser, selectedExam]);

  const examTypes = ['Unit Test 1', 'Half Yearly', 'Annual Exam'];

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const chartData = resultData?.marksData ? Object.entries(resultData.marksData).map(([subject, data]) => ({
    subject,
    obtained: data.obtained || 0,
    max: data.max || 100
  })) : [];

  return (
    <>
      <Helmet>
        <title>Results - Student Portal</title>
        <meta name="description" content="View your exam results and report cards" />
      </Helmet>

      <div className="min-h-screen bg-muted/30 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Exam Results</h1>
            <p className="text-muted-foreground">View your exam performance and report cards</p>
          </div>

          {/* Exam Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {examTypes.map((exam) => (
              <Button
                key={exam}
                variant={selectedExam === exam ? 'default' : 'outline'}
                onClick={() => setSelectedExam(exam)}
                style={selectedExam === exam ? { backgroundColor: '#1A3C8F' } : {}}
              >
                {exam}
              </Button>
            ))}
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading results...</p>
              </CardContent>
            </Card>
          ) : resultData ? (
            <>
              {/* Student Info */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Name</div>
                      <div className="font-medium">{currentUser?.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Class</div>
                      <div className="font-medium">{resultData.class}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Roll No</div>
                      <div className="font-medium">{resultData.rollNo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Exam Year</div>
                      <div className="font-medium">{resultData.examYear}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marks Table */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Subject-wise Marks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Max Marks</TableHead>
                        <TableHead className="text-right">Obtained</TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultData.marksData && Object.entries(resultData.marksData).map(([subject, data]) => (
                        <TableRow key={subject}>
                          <TableCell className="font-medium">{subject}</TableCell>
                          <TableCell className="text-right">{data.max}</TableCell>
                          <TableCell className="text-right font-semibold">{data.obtained}</TableCell>
                          <TableCell className="text-right">
                            <Badge className={getGradeColor(data.grade)}>
                              {data.grade}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{resultData.maxTotalMarks}</TableCell>
                        <TableCell className="text-right" style={{ color: '#1A3C8F' }}>
                          {resultData.totalMarks}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getGradeColor(resultData.grade)}>
                            {resultData.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Result Summary */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Result Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Percentage</span>
                      <span className="text-2xl font-bold" style={{ color: '#1A3C8F' }}>
                        {resultData.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Grade</span>
                      <Badge className={`text-lg px-4 py-1 ${getGradeColor(resultData.grade)}`}>
                        {resultData.grade}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Rank in Class</span>
                      <span className="text-xl font-bold" style={{ color: '#1A3C8F' }}>
                        {resultData.rank}{resultData.rank === 1 ? 'st' : resultData.rank === 2 ? 'nd' : resultData.rank === 3 ? 'rd' : 'th'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={resultData.status === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {resultData.status} {resultData.status === 'PASS' ? '✅' : '❌'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Teacher's Remark</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {resultData.teacherRemark || 'No remarks available'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="obtained" fill="#1A3C8F" />
                      <Bar dataKey="max" fill="#EAF0FB" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Download Button */}
              <Button className="w-full sm:w-auto" style={{ backgroundColor: '#1A3C8F' }}>
                <Download className="w-4 h-4 mr-2" />
                Download Report Card PDF
              </Button>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No results available for {selectedExam}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultPage;