import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination, GetAllError } from "../../components";
import "./GetAllNotification.css";
import { UserMinimalResponse } from "../../dtos/responses";
import {
  deleteNotification,
  getAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../api/NotificationApi";
import { NotificationGetAllResponse } from "../../dtos/responses/Notification";
import "./GetAllNotification.css"

export const GetAllNotifications: React.FC = () => {
    const [notificationList, setNotificationList] = useState<NotificationGetAllResponse[]>([]);
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
                const data = await getAllNotifications(page, limit);
                setNotificationList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay notificaciones disponibles.");
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar las notificaciones.");
            }
        };

        fetchNotifications();
    }, [page]);

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
            await deleteNotification(id);
            setNotificationList((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error eliminando la notificación:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
        await markAllNotificationsAsRead();
        setNotificationList((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setShowOptions(false);
        } catch (error) {
        console.error("Error al marcar todas como leídas", error);
        }
    };

    const handleNotificationClick = async (notification: NotificationGetAllResponse) => {
        if (!notification.is_read) {
            setNotificationList((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
            );
            try {
                await markNotificationAsRead(notification.id);
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
                    className={`get-all-notification__options-button ${showOptions ? "active" : ""}`}
                    onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions((prev) => !prev);
                    }}
                >
                    ⋯
                </button>
                {showOptions && (
                    <div className="get-all-notification__options-menu">
                        <button onClick={markAllAsRead}>Marcar todas como leídos</button>
                    </div>
                )}
            </div>
        </div>

        <div className="get-all-notification__list">
            {notificationList.map((notification) => (
                <div
                    key={notification.id}
                    className={`get-all-notification__item ${!notification.is_read ? "unread" : ""}`}
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
                    {!notification.is_read && <span className="get-all-notification__dot" />}
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

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
    );
};
