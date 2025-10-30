import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

/**
 * A reusable hook to manage URL search parameters
 * (get, set, remove, clear) in React Router apps.
 */
export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get a single parameter
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  // ✅ Get all params as an object
  const getAllParams = useCallback(() => {
    const obj: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      obj[key] = value;
    }
    return obj;
  }, [searchParams]);

  // ✅ Set or update a param
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(key, value);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // ✅ Remove a param
  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // ✅ Clear all params (keep current path)
  const clearParams = useCallback(() => {
    navigate(location.pathname);
  }, [navigate, location.pathname]);

  return { getParam, getAllParams, setParam, removeParam, clearParams };
}
