import React, { useState } from "react";
import { ConfirmModal } from "../Modal";
import { RejectWithCommentModal } from "../RejectionComment/RejectWithCommentModal";
import "./ApprovalButton.css"

interface ApprovalButtonProps {
    approved: boolean;
    onApprove: () => void;
    onReject: (comment: string) => void;
    message: string;
}

export const ApprovalButton: React.FC<ApprovalButtonProps> = ({ approved, onApprove, onReject, message }) => {
    const [showModal, setShowModal] = useState(false);

    const handleApprove = () => {
        onApprove();
        setShowModal(false);
    };

    const handleReject = (comment: string) => {
        onReject(comment);
        setShowModal(false);
    };

    const handleCancel = () => setShowModal(false);

    return (
        <>
            <button onClick={() => setShowModal(true)} className={`approval-button ${approved ? "approve" : "reject"}`} >
                {approved ? "✅ Aprobar" : "❌ Desaprobar"}
            </button>

            {showModal &&(
                approved ? (
                    <ConfirmModal message={message} onConfirm={handleApprove}  onCancel={handleCancel} onClose={handleCancel} />
                ) : (
                    <RejectWithCommentModal message={message} onConfirm={handleReject} onCancel={handleCancel} onClose={handleCancel} />
                )
            )}
        </>
    );
};
