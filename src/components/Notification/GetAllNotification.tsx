import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination, GetAllError } from "../../components";
import "./GetAllNotification.css";
import { UserMinimalResponse } from "../../dtos/responses";
import { NotificationGetAllResponse } from "../../dtos/responses/Notification";
import { useNotifications } from "../../providers/Notification";

export const GetAllNotifications: React.FC = () => {
    const {
        notifications,
        reloadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotificationById,
        loading,
    } = useNotifications();

    const [showOptions, setShowOptions] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await reloadNotifications(page, limit);
                setTotalPages(data?.total_page || 1);
                setError(
                data && data.data.length > 0
                    ? null
                    : "No hay notificaciones disponibles."
                );
            } catch (err) {
                setError("No se pudieron cargar las notificaciones." + err);
            }
        };

        fetchNotifications();
    }, [page, reloadNotifications]);

    const getSenderName = (sender: UserMinimalResponse) => {
        return (
            sender?.regular_user?.name ||
            sender?.university_user?.name ||
            sender?.business_user?.name ||
            "Sistema"
        );
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
        navigate(`/notifications?page=${newPage}`);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNotificationById(id);
        } catch (error) {
            console.error("Error eliminando la notificación:", error);
        }
    };

    const handleNotificationClick = async (notification: NotificationGetAllResponse) => {
        if (!notification.is_read) {
            try {
                await markAsRead(notification.id);
            } catch (error) {
                console.error("Error marcando notificación como leída:", error);
            }
        }

        const { action, resource_type, resource_id } = notification;
        const basePath = ["created", "updated"].includes(action) ? "/admin" : "/user";
        const path = `${basePath}/${resource_type}/${resource_id}`;
        navigate(path);
    };

    return (
        <section className="get-all-notification">
            <GetAllError message={error} />

            <div className="get-all-notification__title-container">
                <p className="get-all-notification__title">Notificaciones</p>
                <div className="get-all-notification__options">
                <button
                    className={`get-all-notification__options-button ${
                        showOptions ? "active" : ""
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions((prev) => !prev);
                    }}
                >
                    ⋯
                </button>
                {showOptions && (
                    <div className="get-all-notification__options-menu">
                        <button onClick={markAllAsRead}>Marcar todas como leídas</button>
                    </div>
                )}
                </div>
            </div>

            {loading ? (
                <p>Cargando notificaciones...</p>
            ) : (
                <div className="get-all-notification__list">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`get-all-notification__item ${
                            !notification.is_read ? "unread" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                    <img
                        src={notification.sender.avatar || "/src/assets/img/avatar.png"}
                        alt="Avatar"
                        className="get-all-notification__avatar"
                    />
                    <div className="get-all-notification__content">
                        <strong>{getSenderName(notification.sender)}</strong>
                        <p>{notification.message}</p>
                    </div>
                    {!notification.is_read && (
                        <span className="get-all-notification__dot" />
                    )}
                    <span
                        className="get-all-notification__delete"
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                        }}
                    >
                        ×
                    </span>
                    </div>
                ))}
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};
