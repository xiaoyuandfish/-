export interface Course {
  id: string;
  name: string;
  teacher: string;
  location: string;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startPeriod: number; // 1-12
  duration: number; // Number of periods
  color?: string;
}

export const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const PERIODS = Array.from({ length: 12 }, (_, i) => i + 1);

export const COURSE_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
  'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
  'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200',
];
