import React, { useState } from 'react'
import StudentAppBar from '../../Components/Student/StudentAppBar';
import Button from '../../UI/Button';
import { CheckCircle2, AlertTriangle, Clock, FileText, Ban, Play, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExamRule() {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const rules = [
    {
      icon: Clock,
      title: "Time Management",
      description: "Once the exam starts, the timer will begin. You must complete the exam within the allocated time. No extensions will be provided."
    },
    {
      icon: FileText,
      title: "No External Resources",
      description: "Use of calculators, notes, books, or any external resources is strictly prohibited during the exam."
    },
    {
      icon: AlertTriangle,
      title: "No Tab Switching",
      description: "Switching tabs or windows during the exam will be monitored. Multiple violations may result in automatic submission."
    },
    {
      icon: Ban,
      title: "No Communication",
      description: "Communication with other students or any form of collaboration during the exam is strictly forbidden."
    },
    {
      icon: CheckCircle2,
      title: "Review Before Submit",
      description: "You can review and change your answers before final submission. Once submitted, you cannot modify your responses."
    }
  ];

  const handleStartExam = () => {
    if (isAgreed) {
      console.log("Starting exam...");
      // Navigate to exam page
    }
  };

  const handleCancel = () => {
    console.log("Exam cancelled");
    // Navigate back to dashboard
  };

  return (
    <>
      <div className='max-w-full h-screen overflow-hidden flex flex-col'>
        <div className="m-2 mb-0 flex-shrink-0">
          <StudentAppBar
            title="Exam Rules & Regulations"
            subtitle="Please read the following rules carefully before starting your exam"
          />
        </div>

        {/* Rules Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 m-2 flex-1 overflow-y-auto">
          <div className="mb-3">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Important Instructions</h2>
            <p className="text-gray-600 text-xs">Please carefully read and understand all the rules before proceeding.</p>
          </div>

          {/* Single Card with All Rules */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 p-3">
            <div className="space-y-6">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="flex gap-2 pb-2 border-b border-blue-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <rule.icon className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
                      {index + 1}. {rule.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-snug">
                      {rule.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div className="mt-3 p-2 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-gray-700 text-xs font-medium">
                I have read and understood all the exam rules and regulations. I agree to follow all the guidelines mentioned above and understand that any violation may result in disqualification.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mt-3">
            <Button
              variant="secondary"
              size="md"
              icon={X}
              onClick={() => navigate('/student-dashboard')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Play}
              onClick={() => navigate('/exam-page')}
              disabled={!isAgreed}

            >
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
