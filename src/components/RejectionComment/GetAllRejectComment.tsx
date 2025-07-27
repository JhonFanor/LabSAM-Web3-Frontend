import React, { useEffect, useState } from "react";
import {
	getAllRejectionCommentsByResource,
	updateRejectionComment,
	deleteAllRejectionCommentsIndividually,
} from "../../api/RejectionCommentApi";
import { RejectionCommentResponse } from "../../dtos/responses/RejectionComment";
import "./GetAllRejectComment.css";

interface GetAllRejectCommentProps {
	resourceType: string;
	resourceId: number;
	isApproved: boolean | null;
}

export const GetAllRejectComment: React.FC<GetAllRejectCommentProps> = ({
	resourceType,
	resourceId,
	isApproved,
}) => {
	const [comments, setComments] = useState<RejectionCommentResponse[]>([]);
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const [editText, setEditText] = useState("");

	const loadComments = async () => {
		try {
			const data = await getAllRejectionCommentsByResource(resourceType, resourceId);
			setComments(data || []);
		} catch (error) {
			console.error("Error al cargar comentarios:", error);
			setComments([]);
		}
	};

	useEffect(() => {
		if (isApproved === true) {
			if (comments && comments.length > 0) {
				deleteAllRejectionCommentsIndividually(comments)
					.then(() => setComments([]))
					.catch((error) => console.error("Error al eliminar comentarios:", error));
			}
		} else {
			loadComments();
		}
	}, [isApproved]);

	const handleUpdate = async (id: number) => {
		try {
			await updateRejectionComment(id, { comment: editText });
			setEditingCommentId(null);
			setEditText("");
			await loadComments();
		} catch (error) {
			console.error("Error al actualizar comentario:", error);
		}
	};

	if (isApproved === true || !comments || comments.length === 0) return null;

	return (
		<div className="rejection-comments-section">
			<h4 className="comments-title">Comentarios de rechazo</h4>
			<div className="comments-list">
				{comments.map((comment) => (
					<div key={comment.id} className="comment-item">
						{editingCommentId === comment.id ? (
							<>
								<textarea
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									className="comment-edit-textarea"
								/>
								<div className="comment-actions">
									<button className="btn-save" onClick={() => handleUpdate(comment.id)}>
										Guardar
									</button>
									<button className="btn-cancel" onClick={() => setEditingCommentId(null)}>
										Cancelar
									</button>
								</div>
							</>
						) : (
							<>
								<div className="comment-header">
									<span className="comment-author">Sistema</span>
									<button
										className="btn-edit"
										onClick={() => {
											setEditingCommentId(comment.id);
											setEditText(comment.comment);
										}}
									>
										✏️ Editar
									</button>
								</div>
								<p className="comment-text">{comment.comment}</p>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
