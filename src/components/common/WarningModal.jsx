import React from 'react';
import './modal.css';
import modalWarningIcon from '../../assets/img/modalWarningIcon.svg';

const WarningButtonModal = ({
    isOpen,
    onClose,
    onConfirm,
    modalTitle,
    modalContent,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={ onClose }>
            <div
                className="modal-container"
                onClick={ (e) => e.stopPropagation() }
            >

                {/* 아이콘 */ }
                <div className="modal-icon-wrap">
                    <img
                        src={ modalWarningIcon }
                        alt="warning icon"
                        className="modal-icon"
                    />
                </div>

                {/* 텍스트 */ }
                <div className="modal-text-wrap">
                    <h2 className="modal-title">{ modalTitle }</h2>

                    { modalContent && (
                        <p className="modal-content">{ modalContent }</p>
                    ) }
                </div>

                {/* 버튼 */ }
                <div className="modal-button-wrap">
                    <button className="warningBtnY" onClick={ onConfirm }>
                        확인
                    </button>

                    <button className="warningBtnN" onClick={ onClose }>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarningButtonModal;