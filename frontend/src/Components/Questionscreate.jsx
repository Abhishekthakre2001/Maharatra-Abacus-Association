import React from 'react';
import CsvQuestionManager from '../Features/CsvQuestionManager';

export default function Questionscreate() {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
      bg-opacity-70
      backdrop-blur-xl
      shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Add Question</h1>
            <p className="hidden md:block text-white text-sm md:text-lg">View student exam results and performance</p>
            <div className='flex gap-4 my-4 md:my-0'>
              {/* User Icon */}
              <div className="md:hidden w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
                {"AT"}
              </div>
              {/* Welcome Text */}
              <div className="text-left md:hidden">
                <p className="text-sm text-blue-200">Welcome Back,</p>
                <p className="text-lg font-semibold text-white">
                  User Name
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <CsvQuestionManager />
    </>
  )
}
