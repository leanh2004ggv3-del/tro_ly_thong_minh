import React, { useState } from 'react';
import { Upload, FileText, Download, Loader2, BookOpen } from 'lucide-react';
import { CurriculumEntry } from './types';

export default function App() {
  const [subject, setSubject] = useState('Công nghệ');
  const [grade, setGrade] = useState('Lớp 10');
  const [totalPeriods, setTotalPeriods] = useState<number>(35);
  const [textbookFile, setTextbookFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CurriculumEntry[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTextbookFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!textbookFile) {
      setError('Vui lòng tải lên tệp Sách giáo khoa.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('grade', grade);
    formData.append('totalPeriods', String(totalPeriods));
    formData.append('textbook', textbookFile);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate');
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!data) return;

    try {
      const response = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PhanPhoiChuongTrinh_${subject}_${grade}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError('Không thể xuất file Word. ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600 w-6 h-6" />
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Trợ lí tạo PPCT thông minh</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Configuration */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Cấu hình PPCT</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                <select 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                >
                  <option value="Công nghệ">Công nghệ</option>
                  <option value="Tin học">Tin học</option>
                  <option value="Toán học">Toán học</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp</label>
                <select 
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                >
                  {Array.from({length: 10}, (_, i) => i + 3).map(num => (
                    <option key={num} value={`Lớp ${num}`}>Lớp {num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số tiết năm học</label>
                <input 
                  type="number"
                  value={totalPeriods}
                  onChange={e => setTotalPeriods(parseInt(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Sách giáo khoa (PDF/Word)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Tải tệp tin</span>
                        <input type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">{textbookFile ? textbookFile.name : 'PDF hoặc Word'}</p>
                  </div>
                </div>
              </div>

              {/* Template Note */}
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                Lưu ý: Ứng dụng sẽ tự động sinh dữ liệu định dạng bảng PPCT chuẩn với 7 cột.
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !textbookFile}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lí AI...</>
                  ) : (
                    'Tạo Phân phối chương trình'
                  )}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-8 flex flex-col">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            
            <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-medium text-gray-900">Bảng kết quả</h2>
              {data && (
                <button
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất kết quả ra file Word
                </button>
              )}
            </div>

            <div className="flex-1 p-0 overflow-auto">
              {error && (
                <div className="m-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {!data && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <Upload className="w-12 h-12 mb-4 text-gray-300" />
                  <p>Hãy tải lên tài liệu SGK và điền cấu hình để bắt đầu.</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center p-12 text-gray-500">
                  <div className="animate-pulse space-y-4 w-full max-w-2xl">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-100 rounded w-full"></div>
                    <div className="h-6 bg-gray-100 rounded w-full"></div>
                    <div className="h-6 bg-gray-100 rounded w-5/6"></div>
                  </div>
                  <p className="mt-8 text-sm animate-pulse text-gray-400">Đang đọc tài liệu bằng AI...</p>
                </div>
              )}

              {data && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Tiết PPCT</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Bài học / Chủ đề</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Số tiết</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Thời điểm (tuần)</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Thiết bị dạy học</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Địa điểm</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-4 text-sm text-gray-900">{item.tietPpct}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.baiHoc}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.soTiet}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.thoiDiem}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.thietBi}</td>
                          <td className="px-3 py-4 text-sm text-gray-900">{item.diaDiem}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{item.ghiChu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

