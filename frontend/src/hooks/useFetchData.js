import { useEffect, useState } from "react";

export const useFetchData = (apiFunc) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        apiFunc()
            .then(res => {
                // Normalize response to always be an array for consumers like DataTable
                let payload = res && res.data !== undefined ? res.data : res;
                // Handle nested { data: [...] } patterns
                if (payload && payload.data !== undefined) payload = payload.data;
                if (!Array.isArray(payload)) {
                    payload = payload != null ? [payload] : [];
                }
                setData(payload);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    return { data, loading, reload: load };
};