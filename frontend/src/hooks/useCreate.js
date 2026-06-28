import { useState } from "react";

export const useCreate = (apiFunc, onSuccess, onError) => {
    const [loading, setLoading] = useState(false);

    const create = async (payload) => {
        setLoading(true);
        try {
            const res = await apiFunc(payload);
            onSuccess(res.data);
        } catch (err) {
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    return { create, loading };
};