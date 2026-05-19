import React from 'react';
import './modal.css';
import modalCheckIcon from '../../assets/img/modalCheckIcon.svg';

const OneButtonModal = ({
    isOpen,
    onClose,
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
                        src={ modalCheckIcon }
                        alt="check icon"
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
                    <button onClick={ onClose } className='oneBtn'>확인</button>
                </div>
            </div>
        </div>
    );
};

export default OneButtonModal;