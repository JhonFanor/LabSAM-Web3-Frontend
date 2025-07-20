import React, { useState } from "react";
import { ConfirmModal } from "../../components";
import "./ApprovalButton.css";

interface ApprovalButtonProps {
  approved: boolean;
  onClick: (approved: boolean) => void;
  message: string;
}

export const ApprovalButton: React.FC<ApprovalButtonProps> = ({ approved, onClick, message }) => {
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = () => {
        onClick(approved);
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`approval-button ${approved ? "approve" : "reject"}`}
            >
                {approved ? "✅ Aprobar" : "❌ Desaprobar"}
            </button>

            {showModal && (
                <ConfirmModal message={message} onConfirm={handleConfirm} onCancel={handleCancel} onClose={handleCancel}  />
            )}
            </>
    );
};
