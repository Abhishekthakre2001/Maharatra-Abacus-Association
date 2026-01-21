import React, { useState, useEffect } from 'react'
import { useFetchData } from '../hooks/useFetchData';
import DataTable from "../UI/DataTable";
import ResultApi from '../api/result';
import AppBar from '../UI/AppBar';
import { useParams } from "react-router-dom";

export default function ResultDetails() {

    const { id } = useParams();


    const { data: result, loading, reload } = useFetchData(() => {
        if (!id) return Promise.resolve([]);
        return ResultApi.getresult(id);
    });




    const columns = [
        {
            key: "total_question",
            label: "Total Questions",
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: "total_answer",
            label: "Total Answer",
            sortable: true
        },
        {
            key: "total_correct",
            label: "Correct Answer",
            sortable: true,
            render: (value) => <span className="text-sm">{value}</span>
        },
        {
            key: "total_unsolve",
            label: "Total Unsolve Que.",
            sortable: true
        },
        {
            key: "date",
            label: "Exam Date",
            sortable: true,
            isDate: true,
            render: (value) =>
                value ? new Date(value).toLocaleDateString("en-GB") : ""
        },
        // {
        //     key: "time",
        //     label: "Exam Time",
        //     sortable: true,
        //     isDate: true,

        //     render: (value) =>
        //         value ? new Date(value).toLocaleDateString("en-GB") : ""
        // },

        {
            key: "totaltime",
            label: "Total Exam Time",
            sortable: true,
            render: (value) => (
                <span className="font-medium" >{value}</span>
            )
        },

        {
            key: "time_taken",
            label: "Total Time taken",
            sortable: true,
            render: (value) => (
                <span className="font-medium" >{value}</span>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <AppBar
                title="Performance Results"
                subtitle="Insights into student achievements"
            />

            {/* Student Table */}
            <div className="p-0 my-8">
                <DataTable
                    columns={columns}
                    data={result}
                    title="Exam Result"
                    // onView={handleView}
                    searchable
                    pagination
                    showActions={false}
                    loading={loading}
                />
            </div>

        </div>
    )
}
