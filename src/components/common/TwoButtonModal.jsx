import React from 'react';
import './modal.css';
import modalNoticeIcon from '../../assets/img/modalNoticeIcon.svg';

const TwoButtonModal = ({
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
                        src={ modalNoticeIcon }
                        alt="notice icon"
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
                    <button className="twoBtnY" onClick={ onConfirm }>
                        확인
                    </button>

                    <button className="twoBtnN" onClick={ onClose }>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwoButtonModal;