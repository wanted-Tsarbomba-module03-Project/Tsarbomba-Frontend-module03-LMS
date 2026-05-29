import React, { useState } from "react";
import "./AlramDetailPage.css";

const statusMap = {
    OPEN: "미처리",
    RESOLVED: "처리 완료",
    IGNORED: "무시됨",
};

// 🔥 mock data (DB 대신)
const mockData = {
    alert: {
        status: "OPEN",
        adminMemo: "alert-adminMemo 초기값",
    },
    rule: {
        ruleName: "CPU Usage High",
        description: "CPU 사용량이 기준치를 초과하면 알림",
    },
    target: {
        title: "Server A",
        problemSetTitle: "Infra Monitoring Set",
    },
    metric: {
        observedValue: 92,
        thresholdValue: 80,
        unit: "%",
    },
    assignee: {
        name: "Admin User",
        email: "admin@test.com",
    },
};

function OperationAlertDetail({ data, operationAlertId }) {
    const { alert, rule, target, metric, assignee } = data;

    // 🔥 DB 대신 mock 값 기반
    const [adminMemo, setAdminMemo] = useState(alert.adminMemo);
    const [status, setStatus] = useState(alert.status);

    const handleMemoSave = () => {
        if (adminMemo.length > 500) {
            window.alert("500자 제한입니다.");
            return;
        }

        // DB 호출 제거 → 그냥 로그
        console.log("MEMO SAVE:", adminMemo);
        window.alert("저장 완료 (mock)");
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);

        // DB 호출 제거
        console.log("STATUS CHANGE:", newStatus);
    };

    const handleDelete = () => {
        console.log("DELETE ALERT:", operationAlertId);
        window.alert("삭제 완료 (mock)");
    };

    return (
        <div className="alram-wrapper">

            {/* TOP */ }
            <div className="alram-topBar">
                <div className="alram-status">
                    상태: { statusMap[status] }
                </div>

                <div className="alram-topActions">
                    <button
                        className="alram-btn alram-btn-white-blue"
                        onClick={ () => handleStatusChange("RESOLVED") }
                    >
                        처리 완료
                    </button>

                    <button
                        className="alram-btn alram-btn-white-blue"
                        onClick={ () => handleStatusChange("IGNORED") }
                    >
                        무시
                    </button>

                    <button
                        className="alram-btn alram-btn-white-red"
                        onClick={ handleDelete }
                    >
                        삭제하기
                    </button>
                </div>
            </div>

            {/* CONTENT */ }
            <div className="alram-card">
                <div className="alram-title">Alert 정보</div>

                <div className="alram-grid">
                    <Info label="Rule" value={ rule.ruleName } />
                    <Info label="설명" value={ rule.description } />
                    <Info label="대상" value={ target.title } />
                    <Info label="문제집" value={ target.problemSetTitle } />
                    <Info
                        label="감지값"
                        value={ `${metric.observedValue}${metric.unit}` }
                    />
                    <Info
                        label="기준값"
                        value={ `${metric.thresholdValue}${metric.unit}` }
                    />
                    <Info label="상태" value={ statusMap[status] } />
                </div>
            </div>

            {/* ASSIGNEE */ }
            <div className="alram-card">
                <div className="alram-title">Assignee</div>
                <div className="alram-text">
                    { assignee?.name } ({ assignee?.email })
                </div>
            </div>

            {/* MEMO */ }
            <div className="alram-card">
                <div className="alram-memoHeader">
                    <div className="alram-title">Admin Memo</div>

                    <button
                        className="alram-btn alram-btn-blue"
                        onClick={ handleMemoSave }
                    >
                        저장
                    </button>
                </div>

                <textarea
                    className="alram-textarea"
                    value={ adminMemo }
                    onChange={ (e) => setAdminMemo(e.target.value) }
                    maxLength={ 500 }
                />

                <div className="alram-count">
                    { adminMemo.length }/500
                </div>
            </div>
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="alram-infoRow">
            <div className="alram-infoLabel">{ label }</div>
            <div className="alram-infoValue">{ value ?? "-" }</div>
        </div>
    );
}

// 🔥 mock wrapper
function AlramDetailPage() {
    return (
        <OperationAlertDetail
            data={ mockData }
            operationAlertId="mock-id-123"
        />
    );
}

export default AlramDetailPage;