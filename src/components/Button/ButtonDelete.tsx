import React, { useState } from "react";
import "./ButtonDelete.css";
import { ConfirmModal } from "../Modal/ConfirmModal"; 

interface DeleteButtonProps {
    onDelete: () => Promise<void>;
    message: string;
    children?: React.ReactNode;
}

export const ButtonDelete: React.FC<DeleteButtonProps> = ({ onDelete, message, children = "Eliminar", }) => {
    const [showModal, setShowModal] = useState(false);

    const handleConfirm = async () => {
        setShowModal(false);
        try {
            await onDelete();
        } catch (error: any) {
            alert(error.message || "Error al eliminar.");
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <button className="button-delete" onClick={() => setShowModal(true)}>
                {children}
            </button>

            {showModal && (
                <ConfirmModal message={message} onConfirm={handleConfirm} onCancel={handleCancel} onClose={handleCancel} />
            )}
        </>
    );
};
