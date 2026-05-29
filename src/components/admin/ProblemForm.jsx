import React from "react";

import {
    DIFFICULTY_MAP,
    PROBLEM_CATEGORY,
} from "../../services/problemService";

function ProblemForm({
    problemInfo,
    problems,
    file,

    onProblemInfoChange,
    onProblemChange,

    onFileChange,
    onRemoveFile,

    onAddProblem,
    onRemoveProblem,
}) {
    const fileInputRef = React.useRef(null);

    const handleRemoveFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        onRemoveFile();
    };

    return (
        <>
            {/* 상단 */ }
            <div className="section-box">
                <div className="row">
                    {/* 문제명 */ }
                    <div className="input-group">
                        <label>문제명 *</label>
                        <input
                            name="title"
                            value={ problemInfo.title }
                            onChange={ onProblemInfoChange }
                        />
                    </div>

                    {/* 난이도 */ }
                    <div className="input-group">
                        <label>난이도 *</label>
                        <select
                            name="difficulty"
                            value={ problemInfo.difficulty }
                            onChange={ onProblemInfoChange }
                        >
                            { Object.entries(DIFFICULTY_MAP).map(([k, v]) => (
                                <option key={ k } value={ k }>
                                    { v }
                                </option>
                            )) }
                        </select>
                    </div>

                    {/* 카테고리 */ }
                    <div className="input-group">
                        <label>카테고리 *</label>
                        <select
                            name="categoryId"
                            value={ problemInfo.categoryId }
                            onChange={ onProblemInfoChange }
                        >
                            { Object.entries(PROBLEM_CATEGORY).map(([id, name]) => (
                                <option key={ id } value={ id }>
                                    { name }
                                </option>
                            )) }
                        </select>
                    </div>
                </div>

                {/* 문제 설명 */ }
                <div className="input-group">
                    <label>문제 설명 *</label>
                    <input
                        name="description"
                        value={ problemInfo.description }
                        onChange={ onProblemInfoChange }
                    />
                </div>

                {/* 파일 (단일) */ }
                <div className="input-group">
                    <label>데이터 파일 *</label>

                    <div className="file-list">
                        <div className="file-row">
                            <label className="file-upload-btn">
                                { file?.name || "파일 선택" }

                                <input
                                    ref={ fileInputRef }
                                    type="file"
                                    accept=".csv,text/csv"
                                    multiple={ false }
                                    hidden
                                    onChange={ (e) => onFileChange(e.target.files?.[0] ?? null) }
                                />
                            </label>

                            <button
                                type="button"
                                className="remove-btn"
                                onClick={ handleRemoveFile }
                                disabled={ !file }
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 소문제 */ }
            { problems.map((problem, index) => (
                <div className="section-box" key={ index }>
                    <div className="problem-header">
                        <h3 className="sub-title">
                            소문제 { index + 1 }
                        </h3>

                        <button
                            type="button"
                            className="remove-btn"
                            disabled={ problems.length === 1 }
                            onClick={ () => onRemoveProblem(index) }
                        >
                            ✕
                        </button>
                    </div>

                    <div className="row">
                        <div className="input-group">
                            <label>문제 제목 *</label>
                            <input
                                type="text"
                                name="questionTitle"
                                value={ problem.questionTitle }
                                onChange={ (e) =>
                                    onProblemChange(index, e)
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label>포인트 *</label>
                            <input
                                type="number"
                                name="point"
                                value={ problem.point }
                                onChange={ (e) =>
                                    onProblemChange(index, e)
                                }
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>문제 내용 *</label>
                        <textarea
                            name="context"
                            value={ problem.context }
                            onChange={ (e) =>
                                onProblemChange(index, e)
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>문제 정답 *</label>
                        <input
                            type="text"
                            name="answer"
                            value={ problem.answer }
                            onChange={ (e) =>
                                onProblemChange(index, e)
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>문제 힌트 *</label>
                        <input
                            type="text"
                            name="hint"
                            value={ problem.hint }
                            onChange={ (e) =>
                                onProblemChange(index, e)
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>문제 풀이 *</label>
                        <textarea
                            name="solution"
                            value={ problem.solution }
                            onChange={ (e) =>
                                onProblemChange(index, e)
                            }
                        />
                    </div>
                </div>
            )) }

            {/* 소문제 추가 */ }
            <div className="center-btn">
                <button className="add-btn" onClick={ onAddProblem }>
                    + 추가
                </button>
            </div>
        </>
    );
}

export default ProblemForm;
