import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "../api";

// Runs an async loader on mount (and when deps change) and exposes
// { data, loading, error, reload, setData }.
const useFetch = (loader, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latest = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(loader, deps);

  const reload = useCallback(async () => {
    // Ignore responses from requests that a newer one has superseded.
    const call = ++latest.current;
    setLoading(true);
    setError("");
    try {
      const result = await load();
      if (call === latest.current) setData(result);
    } catch (err) {
      if (call === latest.current) setError(errorMessage(err));
    } finally {
      if (call === latest.current) setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
};

export default useFetch;
