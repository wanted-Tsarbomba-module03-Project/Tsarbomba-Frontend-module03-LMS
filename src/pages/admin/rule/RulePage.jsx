import React, { useEffect, useState } from "react";
import "./RulePage.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const RulePage = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);

    // 규칙 조회
    const fetchRules = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/v1/admin/automation-rules`,
                {
                    method: "GET",
                    credentials: "include",
                }

            );

            const result = await response.json();

            if (result.status === 200) {
                setRules(result.data);
            }
        } catch (error) {
            console.error("규칙 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    // input 값 변경
    const handleChange = (id, field, value) => {
        setRules((prev) =>
            prev.map((rule) =>
                rule.operationRuleId === id
                    ? {
                        ...rule,
                        [field]: value === "" ? "" : Number(value),
                    }
                    : rule
            )
        );
    };

    // 활성 / 비활성 변경
    const handleToggleEnabled = async (ruleId, currentEnabled) => {
        try {
            const response = await fetch(
                `${BASE_URL}/api/v1/admin/automation-rules/${ruleId}/enabled`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        enabled: !currentEnabled,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("활성화 상태 변경 실패");
            }

            setRules((prev) =>
                prev.map((rule) =>
                    rule.operationRuleId === ruleId
                        ? {
                            ...rule,
                            enabled: !currentEnabled,
                        }
                        : rule
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    // 수정하기
    const handleSubmit = async () => {
        try {
            const payload = {
                rules: rules.map((rule) => ({
                    operationRuleId: rule.operationRuleId,
                    thresholdValue: Number(rule.thresholdValue),
                    minSampleCount:
                        rule.minSampleCount !== null
                            ? Number(rule.minSampleCount)
                            : null,
                })),
            };

            const response = await fetch(
                `${BASE_URL}/api/v1/admin/automation-rules`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("규칙 수정 실패");
            }

            alert("규칙이 수정되었습니다.");
            fetchRules();
        } catch (error) {
            console.error(error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="rule-container">로딩 중...</div>;
    }

    return (
        <div className="rule-container">
            { rules.map((rule) => (
                <div
                    className="rule-block"
                    key={ rule.operationRuleId }
                >
                    {/* 제목 */ }
                    <div className="rule-header">
                        <div className="rule-label">
                            { rule.targetType === "COURSE" && "강좌" }
                            { rule.targetType === "PROBLEM" && "문제" }
                            { rule.targetType === "USER" && "회원" }
                        </div>

                        {/* 활성 / 비활성 버튼 */ }
                        <button
                            className={ `toggle-btn ${rule.enabled ? "enabled" : "disabled"
                                }` }
                            onClick={ () =>
                                handleToggleEnabled(
                                    rule.operationRuleId,
                                    rule.enabled
                                )
                            }
                        >
                            { rule.enabled ? "활성" : "비활성" }
                        </button>
                    </div>

                    <div className="rule-input-box">
                        {/* COURSE */ }
                        { rule.ruleCode === "COURSE_LOW_ENROLLMENT" && (
                            <div className="rule-item">
                                <div className="rule-text">
                                    수강생의 수가
                                </div>

                                <input
                                    className="rule-input"
                                    type="number"
                                    value={ rule.thresholdValue ?? "" }
                                    min={ rule.thresholdMin }
                                    max={ rule.thresholdMax }
                                    onChange={ (e) =>
                                        handleChange(
                                            rule.operationRuleId,
                                            "thresholdValue",
                                            e.target.value
                                        )
                                    }
                                />

                                <div className="rule-text">
                                    명 이하인 강좌
                                </div>
                            </div>
                        ) }

                        {/* PROBLEM */ }
                        { rule.ruleCode === "PROBLEM_HIGH_WRONG_RATE" && (
                            <>
                                <div className="rule-item">
                                    <input
                                        className="rule-input"
                                        type="number"
                                        value={ rule.minSampleCount ?? "" }
                                        onChange={ (e) =>
                                            handleChange(
                                                rule.operationRuleId,
                                                "minSampleCount",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="rule-text">
                                        회 제출 이상인 문제 중,
                                    </div>
                                </div>

                                <div className="rule-item">
                                    <div className="rule-text">
                                        오답률이
                                    </div>

                                    <input
                                        className="rule-input"
                                        type="number"
                                        value={ rule.thresholdValue ?? "" }
                                        min={ rule.thresholdMin }
                                        max={ rule.thresholdMax }
                                        onChange={ (e) =>
                                            handleChange(
                                                rule.operationRuleId,
                                                "thresholdValue",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <div className="rule-text">
                                        % 이상인 문제
                                    </div>
                                </div>
                            </>
                        ) }

                        {/* USER */ }
                        { rule.ruleCode === "USER_INACTIVE_NO_COURSE" && (
                            <div className="rule-item">
                                <div className="rule-text">
                                    미로그인 기간이
                                </div>

                                <input
                                    className="rule-input"
                                    type="number"
                                    value={ rule.thresholdValue ?? "" }
                                    min={ rule.thresholdMin }
                                    max={ rule.thresholdMax }
                                    onChange={ (e) =>
                                        handleChange(
                                            rule.operationRuleId,
                                            "thresholdValue",
                                            e.target.value
                                        )
                                    }
                                />

                                <div className="rule-text">
                                    일 이상인 회원
                                </div>
                            </div>
                        ) }
                    </div>
                </div>
            )) }

            {/* 수정 버튼 */ }
            <div className="rule-submit-wrapper">
                <button
                    className="rule-submit-btn"
                    onClick={ handleSubmit }
                >
                    수정하기
                </button>
            </div>
        </div>
    );
};

export default RulePage;