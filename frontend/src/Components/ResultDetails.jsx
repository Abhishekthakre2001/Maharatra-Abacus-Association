import React, { useMemo } from "react";
import { useFetchData } from "../hooks/useFetchData";
import DataTable from "../UI/DataTable";
import ResultApi from "../api/result";
import AppBar from "../UI/AppBar";
import Tabs from "../UI/Tabs";
import { useParams } from "react-router-dom";

export default function ResultDetails() {

    const { id } = useParams();

    const { data: result = [], loading } = useFetchData(() => {
        if (!id) return Promise.resolve([]);
        return ResultApi.getresult(id);
    });

    /* ---------- MOCK RESULT COLUMNS ---------- */
    const mockColumns = [
        {
            key: "name",
            label: "Name",
            sortable: true,
        },
        {
            key: "total_question",
            label: "Total Questions",
            sortable: true,
        },
        {
            key: "total_answer",
            label: "Total Answer",
            sortable: true,
        },
        {
            key: "total_correct",
            label: "Correct Answer",
            sortable: true,
        },
        {
            key: "total_unsolve",
            label: "Total Unsolve Que.",
            sortable: true,
        },
        {
            key: "date",
            label: "Exam Date",
            sortable: true,
            render: (value) =>
                value ? new Date(value).toLocaleDateString("en-GB") : "",
        },
        {
            key: "totaltime",
            label: "Total Exam Time",
            sortable: true,
        },
        {
            key: "time_taken",
            label: "Total Time Taken",
            sortable: true,
        },
        {
            key: "PaperSet",
            label: "Paper Set",
            sortable: true,
        },
        {
            key: "Paperlevel",
            label: "Paper Level",
            sortable: true,
        }
    ];

    /* ---------- MAIN EXAM COLUMNS ---------- */
    const examColumns = [
        {
            key: "examtitle",
            label: "Exam Title",
            sortable: true,
            render: (value) => <span className="font-medium">{value || "Not Available"}</span>,
        },
        ...mockColumns
    ];

    /* ---------- FILTER DATA ---------- */

    const mockResults = useMemo(() => {
        return result.filter(
            (item) => String(item.resultfor || "").toLowerCase() === "test"
        );
    }, [result]);

    const mainExamResults = useMemo(() => {
        return result.filter(
            (item) => String(item.resultfor || "").toLowerCase() === "exam"
        );
    }, [result]);

    return (
        <div className="max-w-7xl mx-auto">

            <AppBar
                title="Performance Results"
                subtitle="Insights into student achievements"
            />

            <div className="p-0 my-8">

                <Tabs
                    tabs={[
                        {
                            label: `Mock Result (${mockResults.length})`,
                            content: (
                                <DataTable
                                    columns={mockColumns}
                                    data={mockResults}
                                    title="Mock Result"
                                    searchable
                                    pagination
                                    showActions={false}
                                    loading={loading}
                                />
                            ),
                        },
                        {
                            label: `Main Exam Result (${mainExamResults.length})`,
                            content: (
                                <DataTable
                                    columns={examColumns}
                                    data={mainExamResults}
                                    title="Main Exam Result"
                                    searchable
                                    pagination
                                    showActions={false}
                                    loading={loading}
                                />
                            ),
                        },
                    ]}
                />

            </div>
        </div>
    );
}