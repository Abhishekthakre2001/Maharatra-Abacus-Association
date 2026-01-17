import { Calendar, Clock } from "lucide-react";

const CreamCarouselCard = ({
    title,
    subtitle,
    examDate,
    startTime,
    endTime,
    image
}) => {
    return (
        <div
            className="
        mx-2 rounded-3xl overflow-hidden
        relative group
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.15)] 
        bg-blue/70 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-lg
      "
        //   style={{
        //     background:
        //       "bg-white/70 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-lg"
        //   }}
        >
            {/* SUBTLE BORDER */}
            <div className="absolute inset-0 rounded-3xl border border-[#F1D9A6]/60 pointer-events-none" />

            {/* CONTENT */}
            <div className="relative z-10 flex items-center px-5 py-8 pr-28">
                <div className="space-y-3">
                    {/* BADGE */}
                    <span className="
            inline-flex items-center gap-2
            text-xs font-semibold
            text-blue-600
            bg-white/70 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-lg
            px-3 py-1 
          ">
                        Upcoming Exam
                    </span>

                    {/* TITLE */}
                    <h2 className="text-xl md:text-2xl font-bold text-blue-600 leading-snug">
                        {title}
                    </h2>

                    {/* SUBTITLE */}
                    <p className="text-sm text-gray-500 max-w-[230px] leading-relaxed">
                        {subtitle}
                    </p>

                    {/* DIVIDER */}
                    <div className="w-12 h-[2px] bg-gradient-to-r from-[#D9A441] to-transparent rounded-full" />

                    {/* DATE & TIME */}
                    <div className="flex flex-col gap-2 text-sm text-gray-700">
                        {examDate && (
                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-gray-600" />
                                <span>
                                    {new Date(examDate).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>
                        )}

                        {startTime && endTime && (
                            <div className="flex items-center gap-2">
                                <Clock size={15} className="text-gray-600" />
                                <span>{startTime} – {endTime}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* IMAGE */}
            {image && (
                <div className="
          absolute right-2 top-0 h-full w-[45%]
          flex items-center justify-center
          pointer-events-none
        ">
                    <img
                        src={image}
                        alt={title}
                        className="
              h-[85%] w-auto object-contain
              drop-shadow-[0_18px_25px_rgba(0,0,0,0.25)]
              group-hover:scale-105
              transition-transform duration-300
            "
                    />
                </div>
            )}

            {/* SOFT LIGHT OVERLAY */}
            <div className="
        absolute inset-0
        bg-gradient-to-r
        from-white/70 via-white/20 to-transparent
        pointer-events-none
      " />
        </div>
    );
};

export default CreamCarouselCard;
