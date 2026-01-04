import { useEffect, useState } from "react";

export const useFetchData = (apiFunc) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        apiFunc()
            .then(res => setData(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    return { data, loading, reload: load };
};