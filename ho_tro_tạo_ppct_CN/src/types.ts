export interface CurriculumEntry {
  tietPpct: string;
  baiHoc: string;
  soTiet: number;
  thoiDiem: string;
  thietBi: string;
  diaDiem: string;
  ghiChu: string;
}

export interface GenerateRequest {
  subject: string;
  grade: string;
  totalPeriods: number;
}
