import React from 'react'
import Tabs from '../UI/Tabs';
import Sets from './Sets';
import Level from './Level';

export default function Masters() {
    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-blue-600 to-[#110F12]
      bg-opacity-70
      backdrop-blur-xl
      shadow-[0px_20px_40px_rgba(0,0,0,0.45)] rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Student Management</h1>
                            <p className="hidden md:block text-white text-sm md:text-lg">Manage and view all students</p>
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

                        {/* logo */}
                        {/* RIGHT - User Info */}
                        <div className="hidden lg:flex items-center gap-4 px-5 py-3 rounded-xl ">
                            {/* Welcome Text */}
                            <div className="text-right">
                                <p className="text-sm text-blue-200">Welcome Back,</p>
                                <p className="text-lg font-semibold text-white">
                                    User Name
                                </p>
                            </div>
                            {/* User Icon */}
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-bold shadow-md">
                                AT
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Student Button - Responsive */}
                {/* <div className="flex justify-center md:justify-end mt-6">
                    <Button icon={Users} variant="primary" onClick={() => window.location.href = "/add-student"}>Add Student</Button>
                </div> */}
            </div>




            {/* tabs */}
            <div className="p-6">
                <Tabs
                    tabs={[
                        { label: 'Sets', content: <Sets /> },
                        { label: 'Level', content: <Level /> }
                    ]}
                />
            </div>

        </>
    )
}
