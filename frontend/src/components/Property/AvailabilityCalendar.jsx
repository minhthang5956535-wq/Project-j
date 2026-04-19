import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Check, X, ChevronRight, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const AvailabilityCalendar = ({ availability }) => {
  if (!availability || availability.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <Loader2 className="animate-spin mb-4" />
        <p className="font-bold text-sm uppercase tracking-widest">Đang đồng bộ lịch...</p>
    </div>
  );

  const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Helper to group by month
  const groupedByMonth = availability.reduce((acc, current) => {
    const date = new Date(current.date);
    const monthYear = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(current);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {/* Legend */}
      <div className="flex flex-wrap gap-6 p-6 bg-slate-50/50 rounded-[24px] border border-slate-100">
        <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Còn trống</span>
        </div>
        <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 bg-slate-300 rounded-full" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đã hết phòng</span>
        </div>
        <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 bg-sky-200 rounded-full" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày trả / Check-out</span>
        </div>
      </div>

      {Object.entries(groupedByMonth).map(([month, days]) => {
        const firstDate = new Date(days[0].date);
        let firstDayIndex = firstDate.getDay(); 
        const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const emptySlots = Array(adjustedFirstDayIndex).fill(null);

        return (
          <div key={month} className="animate-fade-in">
            <h4 className="text-xl font-black mb-6 pl-2 font-['Outfit'] capitalize flex items-center gap-3">
                <CalendarIcon size={20} className="text-[var(--primary)]" /> {month}
            </h4>
            
            <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm relative">
                <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-200">
                    {dayLabels.map(label => (
                        <div key={label} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {label}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 divide-x divide-y divide-slate-50 border-l border-t border-transparent">
                    {emptySlots.map((_, i) => (
                        <div key={`empty-${i}`} className="h-24 bg-slate-50/30" />
                    ))}

                    {days.map((item, index) => {
                        const dateObj = new Date(item.date);
                        const dateStr = item.date;
                        const isToday = new Date().toLocaleDateString('en-CA') === dateStr;
                        
                        // Check if it's a Check-out day: 
                        // It is available AND the previous day is booked
                        const isCheckoutDay = item.is_available && index > 0 && !days[index-1].is_available;
                        
                        return (
                            <div 
                                key={index}
                                className={`relative h-24 p-3 transition-all flex flex-col justify-between group 
                                    ${!item.is_available ? 'bg-slate-50/50' : isCheckoutDay ? 'bg-sky-50/30' : 'hover:bg-slate-50/30 cursor-pointer'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-sm font-black transition-all 
                                        ${isToday ? 'bg-[var(--primary)] text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg shadow-red-100 scale-110' : 'text-slate-900 group-hover:scale-110'}`}>
                                        {dateObj.getDate()}
                                    </span>
                                    {!item.is_available ? (
                                        <X size={14} className="text-slate-300" />
                                    ) : isCheckoutDay ? (
                                        <ArrowRight size={14} className="text-sky-400" />
                                    ) : null}
                                </div>

                                <div className="mt-auto">
                                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${item.is_available ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                                        {item.is_available ? (
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: '100%' }}
                                                className={`h-full ${isCheckoutDay ? 'bg-sky-400' : 'bg-emerald-500'}`} 
                                            />
                                        ) : null}
                                    </div>
                                    <p className={`text-[10px] font-black uppercase tracking-tighter mt-1.5 
                                        ${!item.is_available ? 'text-slate-400' : isCheckoutDay ? 'text-sky-600' : 'text-emerald-600'}`}>
                                        {!item.is_available ? 'Hết phòng' : isCheckoutDay ? 'Trả phòng' : 'Còn trống'}
                                    </p>
                                </div>
                                
                                {!item.is_available && (
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] pointer-events-none" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        );
      })}

      <div className="mt-8 flex items-start gap-4 p-6 bg-blue-50/30 border border-blue-50 rounded-[28px]">
          <AlertCircle size={22} className="text-blue-500 mt-1 flex-shrink-0" />
          <p className="text-xs font-bold text-gray-700 leading-relaxed">
             <span className="text-sky-600">Trả phòng:</span> Khách sẽ rời đi vào buổi sáng, nên bạn vẫn có thể đặt phòng để nhận (Check-in) vào buổi chiều ngày hôm đó. Hệ thống của Ông Hai Home tự động tối ưu lịch để đảm bảo trải nghiệm tốt nhất.
          </p>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
