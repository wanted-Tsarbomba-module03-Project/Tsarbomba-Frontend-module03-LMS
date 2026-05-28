import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "../../../../src/components/common/List";

function UserTotalPage() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);

  const columns = [
    {
      key: "index",
      label: "No.",
    },
    {
      key: "nickname",
      label: "닉네임",
    },
    {
      key: "email",
      label: "이메일",
    },
    {
      key: "createdAt",
      label: "가입일",
      render: (item) =>
        item.createdAt?.split("T")[0] || "-",
    },
    {
      key: "isLocked",
      label: "상태",
      render: (item) =>
        item.isLocked ? "비활성" : "활성",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/users`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        setUsers(data?.data?.content || []);
      } catch (error) {
        console.error("회원 목록 조회 실패:", error);
      }
    };

    fetchUsers();
  }, [BASE_URL]);

  const handleRowClick = (item) => {
    navigate(`/admin/user/${item.userId}`);
  };

  return (
    <div>
      <h2 style={ { marginBottom: "20px" } }>
        회원 관리
      </h2>

      <List
        data={ users }
        columns={ columns }
        onRowClick={ handleRowClick }
      />
    </div>
  );
}

export default UserTotalPage;