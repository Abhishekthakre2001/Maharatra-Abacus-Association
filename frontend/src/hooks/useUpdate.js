import { useState } from "react";

export const useUpdate = (apiFunc, onSuccess) => {
    const [loading, setLoading] = useState(false);

    const update = async (id, payload) => {
        setLoading(true);
        try {
            await apiFunc(id, payload);
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return { update, loading };
};