import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GraduationCap, Calendar, Trash2 } from 'lucide-react';

import TimetableGrid from './components/TimetableGrid';
import CourseModal from './components/CourseModal';
import UploadParser from './components/UploadParser';
import { Course, COURSE_COLORS } from './types';

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; period: number } | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('uniSchedule_courses');
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load courses", e);
      }
    }
  }, []);

  // Save to local storage whenever courses change
  useEffect(() => {
    localStorage.setItem('uniSchedule_courses', JSON.stringify(courses));
  }, [courses]);

  const handleAddCourse = (newCourse: Course) => {
    if (selectedCourse) {
      // Edit existing
      setCourses(courses.map(c => c.id === newCourse.id ? newCourse : c));
    } else {
      // Add new
      // If user didn't pick a color, assign one
      if(!newCourse.color) {
        newCourse.color = COURSE_COLORS[Math.floor(Math.random() * COURSE_COLORS.length)];
      }
      setCourses([...courses, newCourse]);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    setIsModalOpen(false);
  };

  const handleSlotClick = (day: number, period: number) => {
    setSelectedCourse(null);
    setSelectedSlot({ day, period });
    setIsModalOpen(true);
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleParsedCourses = (parsedCourses: Course[]) => {
    if (parsedCourses.length > 0) {
      if (courses.length > 0) {
        if(window.confirm('检测到已有课程，是否覆盖当前课表？\n(点击“确定”覆盖，点击“取消”追加)')) {
          setCourses(parsedCourses);
        } else {
          setCourses([...courses, ...parsedCourses]);
        }
      } else {
        setCourses(parsedCourses);
      }
    }
  };

  const handleClearAll = () => {
    if(window.confirm('确定要清空所有课程吗？此操作无法撤销。')) {
      setCourses([]);
    }
  }

  return (
    <div className="min-h-screen flex flex-col pb-8">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">UniSchedule AI</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
                onClick={handleClearAll}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="清空课表"
            >
                <Trash2 size={20} />
            </button>
            <div className="hidden sm:block text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
              <Calendar className="inline mr-1 mb-0.5" size={14} />
              {courses.length} 门课程
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        
        {/* Upload Section */}
        <UploadParser onParsed={handleParsedCourses} />

        {/* Timetable Grid */}
        <div className="h-[calc(100vh-250px)] min-h-[500px]">
          <TimetableGrid 
            courses={courses} 
            onSlotClick={handleSlotClick} 
            onCourseClick={handleCourseClick}
          />
        </div>
      </main>

      {/* Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCourse}
        onDelete={handleDeleteCourse}
        initialData={selectedCourse}
        selectedSlot={selectedSlot}
      />
    </div>
  );
};

export default App;
