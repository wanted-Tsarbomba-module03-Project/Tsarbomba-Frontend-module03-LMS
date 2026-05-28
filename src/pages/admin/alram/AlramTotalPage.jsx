import { useEffect, useState } from "react";
import List from "../../../../src/components/common/List";
import { getOperationAlerts } from "../../../services/adminService";
import "./AlramTotalPage.css";

function AlramTotalPage() {
    // targetType
    const [type, setType] = useState("PROBLEM");

    // status filter
    const [status, setStatus] = useState("");

    // alerts
    const [alerts, setAlerts] = useState([]);

    const statusMap = {
        OPEN: "미처리",
        RESOLVED: "처리 완료",
        IGNORED: "무시됨",
    };

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

    const handleTypeChange = (newType) => {
        setType(newType);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const result = await getOperationAlerts(type, status);
                setAlerts(result.data.content);
            } catch (err) {
                console.error("알람 목록 조회 실패:", err);
            }
        };

        fetchAlerts();
    }, [type, status]);

    return (
        <div className="alarm-container">
            {/* 헤더 */ }
            <div className="alarm-header">
                <h2>알람 관리</h2>

                {/* 상태 필터 */ }
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

            {/* 타입 버튼 */ }
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

            <List data={ alerts } columns={ columns } />
        </div>
    );
}

export default AlramTotalPage;