import { Calendar, Clock } from "lucide-react";



function formatDateTime(dateStr) {
    if (!dateStr) return '';

    const d = new Date(dateStr);

    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = d.toLocaleString("en-IN", { month: "short", timeZone: "UTC" });
    const year = d.getUTCFullYear();

    let hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
}


const CreamCarouselCard = ({
    title,
    subtitle,
    examDate,
    startTime,
    endTime,
    image,
    isExamLive
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
                    <span
                        className={`
        inline-flex items-center gap-2
        text-xs font-semibold
        px-3 py-1 rounded-2xl shadow-lg
        backdrop-blur-lg border
        ${isExamLive
                                ? "text-red-600 bg-red-50 border-red-200 animate-pulse"
                                : "text-blue-600 bg-white/70 border-blue-100"
                            }
    `}
                    >
                        {isExamLive ? "Exam is Live Now " : "Upcoming Exam"}
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
                    {examDate === "—" ?
                        <>
                            <div className="flex flex-col gap-2 text-sm text-gray-700">

                            </div>
                        </> : <>
                            <div className="flex flex-col gap-2 text-sm text-gray-700">
                                {/* {examDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={15} className="text-gray-600" />
                                        <span>
                                            {formatDate(startTime)}
                                            {formatDate(startTime) !== formatDate(endTime) &&
                                                ` - ${formatDate(endTime)}`
                                            }
                                        </span>
                                    </div>
                                )}

                                {startTime && endTime && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={15} className="text-gray-600" />
                                        <span>
                                            {formatTime(startTime)} – {formatTime(endTime)}
                                        </span>
                                    </div>
                                )} */}
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Clock size={15} className="text-gray-600" />
                                    <span>
                                        {formatDateTime(startTime)} to <br /> {formatDateTime(endTime)}
                                    </span>
                                </div>
                            </div>
                        </>
                    }

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
