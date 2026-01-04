import { useState } from "react";

export const useDelete = (apiFunc, onSuccess) => {
    const [loading, setLoading] = useState(false);

    const remove = async (id) => {
        setLoading(true);
        try {
            await apiFunc(id);
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading };
};