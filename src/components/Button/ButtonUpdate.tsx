import React, { ReactNode, useState } from "react";

interface ButtonUpdateProps {
		children: (onClose: () => void) => ReactNode;
		label?: string;
}

export const ButtonUpdate: React.FC<ButtonUpdateProps> = ({
	children,
	label = "Actualizar",
}) => {
	const [open, setOpen] = useState(false);

	const handleClose = () => setOpen(false);

	return (
		<>
			<button onClick={() => setOpen(true)} className="button-update">
				{label}
			</button>
			{open && (
				<div
				className="modal-overlay"
				onClick={(e) => {
					if (e.target === e.currentTarget) {
					handleClose();
					}
				}}
				>
				{children(handleClose)}
				</div>
			)}
		</>
	);
};
