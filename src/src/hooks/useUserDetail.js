import { useEffect, useState } from "react";
import { getUserDetail } from "../services/adminService";

export const useUserDetail = (id) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await getUserDetail(id);
        setUser(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { user, setUser, loading };
};
