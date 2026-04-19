import React from 'react'
import { useFetchData } from "../hooks/useFetchData";
import DataTable from "../UI/DataTable"
import { useNavigate } from "react-router-dom";
import AppBar from '../UI/AppBar';
import Tabs from '../UI/Tabs';
import userApi from "../api/userApi";
import ExamResult from '../Pages/Examresult';

export default function Result() {
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : {};

    const { data: students = [], loading, reload } = useFetchData(async () => {
        if (!user?.id) return [];

        const res = await userApi.getresultbyadminid(user.id);
        return res?.data?.data || [];
    });

    const handleView = (student) => {
        navigate(`/studentresults/${student.user_id}`);
    };

    const columns = [
        {
            key: "date",
            label: "Date",
            sortable: true,
            render: (value) =>
                value
                    ? new Date(value).toLocaleDateString("en-GB")
                    : ""
        },
        {
            key: "time",
            label: "Time",
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: "name",
            label: "Student Name",
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },

        {
            key: "address",
            label: "Address",
            sortable: true,
            render: (value) => <span className="text-sm">{value}</span>
        },

        {
            key: "city",
            label: "City",
            sortable: true,
            render: (value) => <span className="text-sm">{value}</span>
        },
        {
            key: "Paperlevel",
            label: "Level",
            sortable: true
        },
           {
            key: "PaperSet",
            label: "Set",
            sortable: true
        },

        {
            key: "total_question",
            label: "Total Questions",
            sortable: true
        },
        {
            key: "total_answer",
            label: "Total Answer",
            sortable: true
        },
        {
            key: "total_correct",
            label: "Total Correct",
            sortable: true
        },
        {
            key: "total_unsolve",
            label: "Total Unsolve",
            sortable: true
        },
         {
            key: "totaltime",
            label: "Total Time",
            sortable: true
        },
        {
            key: "time_taken",
            label: "Time Taken",
            sortable: true
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <AppBar
                title="Performance Results"
                subtitle="Insights into student achievements"
            />

            {/* tabs */}
            <div className="p-6">
                <Tabs
                    tabs={[
                        {
                            label: 'Test Result', content: <>
                                <div className="p-0 my-8">
                                    <DataTable
                                        columns={columns}
                                        data={students}
                                        title="All Students Results"
                                        // onView={handleView}
                                        searchable
                                        pagination
                                        showActions={false}
                                        loading={loading}
                                    />
                                </div>
                            </>
                        },
                        { label: 'Exam Result', content: <ExamResult /> }
                    ]}
                />
            </div>


        </div>
    );
}

// import React from 'react'
// import Tabs from '../UI/Tabs';
// import MockResultTable from './MockResultTable';
// import MainExamResultTable from './MainExamResultTable';
// import AppBar from '../UI/AppBar';

// export default function Result() {
//     return (
//         <>
//             <div className="max-w-7xl mx-auto">
//                  <AppBar
//                 title="Performance Results"
//                 subtitle="Insights into student achievements"
//             />


//                 {/* Add Student Button - Responsive */}
//                 {/* <div className="flex justify-center md:justify-end mt-6">
//                     <Button icon={Users} variant="primary" onClick={() => window.location.href = "/add-student"}>Add Student</Button>
//                 </div> */}
//             </div>


// {/* tabs */}
// <div className="p-6">
//     <Tabs
//         tabs={[
//             { label: 'Mock Result', content: <MockResultTable /> },
//             { label: 'Main Result', content: <MainExamResultTable /> }
//         ]}
//     />
// </div>

//         </>
//     )
// }
