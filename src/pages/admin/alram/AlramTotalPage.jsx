import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "../../../../src/components/common/List";

function AlramTotalPage() {
    const navigate = useNavigate();

    const [type, setType] = useState("PROBLEM");
    const [status, setStatus] = useState("");
    const [alerts, setAlerts] = useState([]);

    // 상태 한글 변환
    const statusMap = {
        OPEN: "미처리",
        RESOLVED: "처리 완료",
        IGNORED: "무시",
    };

    // 리스트 컬럼
    const columns = [
        {
            key: "index",
            label: "No.",
        },
        {
            key: "recommendedAction",
            label: "알람 내용",
        },
        {
            key: "status",
            label: "처리상태",
            render: (item) => statusMap[item.status] || item.status,
        },
    ];

    // 버튼 클릭 처리
    const handleTypeChange = (newType) => {

        console.log(`${newType} 페이지를 호출합니다.`);

        setType(newType);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleRowClick = (item) => {
        navigate(`/admin/alram/${item.operationAlertId}`);
    };

    useEffect(() => {

        fetch(
            `${BASE_URL}/api/v1/admin/operation-alerts?targetType=${type}&page=0&size=20`
        )
            .then((res) => res.json())
            .then((result) => {
                setAlerts(result.data.content);
            })
            .catch((err) => {
                console.error("알람 목록 조회 실패:", err);
            });

    }, [type]);

    return (
        <div className="alarm-container">
            <div className="alarm-header">
                <h2>알람 관리</h2>

                <select
                    className="status-select"
                    value={ status }
                    onChange={ handleStatusChange }
                >
                    <option value="">전체</option>
                    <option value="OPEN">미처리</option>
                    <option value="RESOLVED">처리 완료</option>
                    <option value="IGNORED">무시됨</option>
                </select>
            </div>

            <div className="type-btn-group">
                <button
                    className={ type === "PROBLEM" ? "btn active" : "btn" }
                    onClick={ () => handleTypeChange("PROBLEM") }
                >
                    문제
                </button>

                <button
                    className={ type === "USER" ? "btn active" : "btn" }
                    onClick={ () => handleTypeChange("USER") }
                >
                    회원
                </button>

                <button
                    className={ type === "COURSE" ? "btn active" : "btn" }
                    onClick={ () => handleTypeChange("COURSE") }
                >
                    강의
                </button>
            </div>

            <List
                data={ alerts }
                columns={ columns }
                onRowClick={ handleRowClick }
            />
        </div>
    );
}

export default AlramTotalPage;