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
        <>


            <div
                className="
        mx-2 rounded-3xl overflow-hidden py-10
        shadow-[0_14px_35px_rgba(0,0,0,0.12)]
        relative
      "
                style={{
                    background: "linear-gradient(135deg, #FFF3D6 0%, #FFFDF7 55%, #FFF3D6 100%)"
                }}
            >
                {/* CONTENT */}
                <div className="relative z-10 h-full flex items-center px-5 pr-28">
                    <div className="space-y-3">
                        <span className="inline-block text-xs font-semibold text-[#9C6B00] bg-[#FFE8B8] px-3 py-1 rounded-full">
                            Upcoming Exam
                        </span>

                        <h2 className="text-xl md:text-2xl font-bold text-[#4A3300] leading-tight">
                            {title}
                        </h2>

                        <p className="text-sm text-[#7A5A2A] max-w-[220px]">
                            {subtitle}
                        </p>

                        {/* DATE & TIME */}
                        <div className="flex gap-4 mt-3 text-sm text-[#6B4A1D]">
                            {examDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
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
                                <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>{startTime} – {endTime}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* IMAGE (RIGHT SIDE) */}
                {image && (
                    <div className="absolute right-0 top-0 h-full w-[45%] flex items-center justify-center">
                        <img
                            src={image}
                            alt={title}
                            className="h-[85%] w-auto object-contain drop-shadow-xl"
                        />
                    </div>
                )}

                {/* SOFT OVERLAY FOR DEPTH */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent pointer-events-none" />
            </div>
        </>
    );
};

export default CreamCarouselCard;
