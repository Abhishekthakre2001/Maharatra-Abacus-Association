import React from "react";

export default function ExamLoading() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 animate-fadeIn">
            <div className="flex flex-col items-center">
                <svg className="animate-spin h-16 w-16 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2 tracking-wide animate-pulse">Preparing Your Exam...</h1>
                <p className="text-lg text-gray-600 mb-4">Loading questions and setting up your challenge!</p>
                <div className="flex gap-2 mt-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
            </div>
        </div>
    );
}
