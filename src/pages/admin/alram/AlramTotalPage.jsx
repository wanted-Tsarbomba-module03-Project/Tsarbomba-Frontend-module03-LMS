import { useEffect, useState } from "react";
import List from "../../../../src/components/common/List";

function AlramTotalPage() {

    const BASE_URL = import.meta.env.VITE_API_URL;

    // 현재 선택된 targetType
    const [type, setType] = useState("PROBLEM");

    // 알람 목록
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

    // type 변경 시 API 재호출
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
        <div>

            <h2>알람 관리</h2>

            <div style={ { marginBottom: "20px" } }>

                <button onClick={ () => handleTypeChange("PROBLEM") }>
                    PROBLEM
                </button>

                <button onClick={ () => handleTypeChange("USER") }>
                    USER
                </button>

                <button onClick={ () => handleTypeChange("COURSE") }>
                    COURSE
                </button>

            </div>

            <List
                data={ alerts }
                columns={ columns }
            />

        </div>
    );
}

export default AlramTotalPage;