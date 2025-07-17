import React from "react";
import "./ConfirmModal.css";
import { ButtonClose } from "../Button";

interface ConfirmModalProps {
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel, onClose }) => {
	return (
		<div className="confirm-modal-backdrop" onClick={onCancel}>
			<div className="confirm-modal-content" onClick={(e) => e.stopPropagation()} >
				<ButtonClose onClick={onClose}/>
				<p>{message}</p>
				<div className="confirm-modal-actions">
					<button className="confirm-modal-confirm" onClick={onConfirm}>
						Confirmar
					</button>
					<button className="confirm-modal-cancel" onClick={onCancel}>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
};