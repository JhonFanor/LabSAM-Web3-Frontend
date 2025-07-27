import React, { useState } from "react";
import "./RejectWithCommentModal.css";
import { ButtonClose } from "../Button";

interface RejectWithCommentModalProps {
    message: string;
    onConfirm: (comment: string) => void;
    onCancel: () => void;
    onClose: () => void;
}

export const RejectWithCommentModal: React.FC<RejectWithCommentModalProps> = ({ message, onConfirm, onCancel, onClose }) => {
    const [comment, setComment] = useState("");

    return (
        <div className="reject-with-comment-modal">
            <div className="reject-with-comment-modal-content" onClick={(e) => e.stopPropagation()}>
                <ButtonClose onClick={onClose}/>
                <p>{message}</p>
                <textarea
                    placeholder="Escribe el motivo del rechazo..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="modal-textarea"
                />
                <div className="reject-with-comment-modal-buttons">
                    <button
                        onClick={() => onConfirm(comment)}
                        disabled={comment.trim().length === 0}
                    >
                        Confirmar
                    </button>
                    <button onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};
