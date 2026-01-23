import { useEffect, useRef, useState } from "react";

const MAX_WARNINGS = 3;

const ExamViolationGuard = ({ onExamEnd }) => {
    const warningCount = useRef(0);
    const isExamActive = useRef(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const examType = localStorage.getItem("examType");

        if (examType === "mock" || examType === "live") {
            isExamActive.current = true;
            registerListeners();
        }

        return () => removeListeners();
    }, []);

    /* ===================== WARNING HANDLER ===================== */
    const triggerWarning = (reason) => {
        if (!isExamActive.current) return;

        warningCount.current += 1;
        console.warn(`Exam violation: ${reason}`);

        setShowAlert(true);

        if (warningCount.current >= MAX_WARNINGS) {
            console.error("🚨 Exam Ended due to violations");
            isExamActive.current = false;

            removeListeners();

            onExamEnd?.(); // callback
        }
    };

    /* ===================== EVENT LISTENERS ===================== */
    const handleVisibilityChange = () => {
        if (document.hidden) {
            triggerWarning("Tab switched");
        }
    };

    const handleResize = () => {
        triggerWarning("Window resized");
    };

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            triggerWarning("Exited fullscreen");
        }
    };

    const handleKeyDown = (e) => {
        // Screenshot keys (best effort)
        if (
            e.key === "PrintScreen" ||
            (e.ctrlKey && e.key === "p") ||
            (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(e.key))
        ) {
            triggerWarning("Screenshot / DevTools attempt");
        }
    };

    const registerListeners = () => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("resize", handleResize);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("keydown", handleKeyDown);
    };

    const removeListeners = () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        document.removeEventListener("keydown", handleKeyDown);
    };

    /* ===================== UI ===================== */
    return (
        showAlert && (
            // <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse">
            //     ⚠️ Exam Rule Violation
            //     <br />
            //     Warning {warningCount.current} / {MAX_WARNINGS}
            // </div>

            <div class="fixed animate-pulse m-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Alert !</strong>
                <span class="block sm:inline"> Exam Rule Violation  Warning {warningCount.current} / {MAX_WARNINGS}</span>
            </div>
        )
    );
};

export default ExamViolationGuard;
