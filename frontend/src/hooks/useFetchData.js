// import { useEffect, useState } from "react";

// export const useFetchData = (apiFunc) => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const load = () => {
//         setLoading(true);
//         apiFunc()
//             .then(res => {
//                 // Normalize response to always be an array for consumers like DataTable
//                 let payload = res && res.data !== undefined ? res.data : res;
//                 // Handle nested { data: [...] } patterns
//                 if (payload && payload.data !== undefined) payload = payload.data;
//                 if (!Array.isArray(payload)) {
//                     payload = payload != null ? [payload] : [];
//                 }
//                 setData(payload);
//             })
//             .finally(() => setLoading(false));
//     };

//     useEffect(() => {
//         load();
//     }, []);

//     return { data, loading, reload: load };
// };

import { useEffect, useState, useCallback } from "react";

export const useFetchData = (
  apiFunc,
  dependencies = [],
  options = {}
) => {
  const { preserveResponse = false } = options;

  const [data, setData] = useState(
    preserveResponse ? null : []
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);

    apiFunc()
      .then((res) => {
        const payload = res?.data ?? res;

        // New mode: return complete response
        if (preserveResponse) {
          setData(payload);
          return;
        }

        // Old mode: keep existing functionality
        let normalized = payload;

        if (
          normalized &&
          normalized.data !== undefined &&
          Array.isArray(normalized.data)
        ) {
          normalized = normalized.data;
        }

        if (!Array.isArray(normalized)) {
          normalized =
            normalized != null ? [normalized] : [];
        }

        setData(normalized);
      })
      .finally(() => setLoading(false));
  }, [apiFunc, preserveResponse]);

  useEffect(() => {
    load();
  }, dependencies);

  return {
    data,
    loading,
    reload: load,
  };
};