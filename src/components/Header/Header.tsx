import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import "./Header.css";
import { useAuth } from "../../providers/Auth";
import { UserMinimalResponse } from "../../dtos/responses";
import { deleteNotification, getAllNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../api/NotificationApi";
import { NotificationGetAllResponse } from "../../dtos/responses/Notification";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    toggleMenu: () => void;
    menuVisible: boolean;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, menuVisible, onLoginClick, onRegisterClick, unreadCount = 0 }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [notifications, setNotifications] = useState<NotificationGetAllResponse[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
                setShowOptions(false); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (showNotifications && notifications.length === 0) {
            setLoadingNotifications(true);
            getAllNotifications(1, 10)
                .then((data) => {
                    setNotifications(data.data);
                })
                .catch((error) => {
                    console.error("Error cargando notificaciones", error);
                })
                .finally(() => setLoadingNotifications(false));
        }
    }, [showNotifications]);

    const getSenderName = (sender: UserMinimalResponse) => {
        return (
            sender?.regular_user?.name ||
            sender?.university_user?.name ||
            sender?.business_user?.name ||
            "Sistema"
        );
    };

    const handleNotificationClick = async (notification: NotificationGetAllResponse) => {
        if (!notification.is_read) {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, is_read: true } : n
                )
            );

            try {
                await markNotificationAsRead(notification.id);
            } catch (error) {
                console.error("Error marcando notificación como leída:", error);
            }
        }

        const { action, resource_type, resource_id } = notification;
        const basePath = ["created", "updated"].includes(action)
            ? "/admin"
            : "/user";

        const path = `${basePath}/${resource_type}/${resource_id}`;
        navigate(path);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error eliminando la notificación:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            );
            setShowOptions(false);
        } catch (error) {
            console.error("Error al marcar todas como leídas", error);
        }
    };

    return (
        <header className="header">
            <div className="header__container">
                {user && (
                    <img src={user.avatar || "/src/assets/img/avatar.png"} alt="Profile" className="header__img" />
                )}

                <a href="#" className="header__logo">
                    LambamWeb3
                </a>

                <div className="right-aligned">
                    {isAuthenticated && (
                        <div className="header__notification" ref={notificationRef} onClick={() => setShowNotifications((prev) => !prev)}>
                            <FaBell className="header__icon" />
                            {unreadCount > 0 && (
                                <span className="header__badge">{unreadCount}</span>
                            )}
                            {showNotifications && (
                                <div className="notification-panel">
                                    <div className="notification-arrow" />
                                        <div className="notification-title-container">
                                            <p className="notification-title">Notificaciones</p>
                                            <div className="notification-options">
                                                <button className={showOptions ? "active" : ""} onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowOptions((prev) => !prev);
                                                }}>⋯</button>
                                                {showOptions && (
                                                    <div className="notification-options-menu">
                                                        <button onClick={markAllAsRead}>Marcar todas como leídas</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="notification-content">
                                            {loadingNotifications ? (
                                                <p>Cargando...</p>
                                            ) : notifications.length === 0 ? (
                                                <p>No hay nuevas notificaciones</p>
                                            ) : (
                                                <>
                                                    {notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`notification-item ${!notification.is_read ? "unread" : ""}`}
                                                            onClick={() => handleNotificationClick(notification)}
                                                        >
                                                            <img src={notification.sender.avatar || "/src/assets/img/avatar.png"} alt="Profile" />
                                                            <div className="notification-item-texts">
                                                                <strong>{getSenderName(notification.sender)}</strong>
                                                                <p>{notification.message}</p>
                                                            </div>
                                                            <span
                                                                className="notification-delete"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(notification.id);
                                                                }}
                                                            >
                                                                ×
                                                            </span>
                                                        </div>
                                                    ))}

                                                    <div
                                                        className="notification-history-container"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowNotifications(false);
                                                            navigate("/notifications");
                                                        }}
                                                    >
                                                        <p>Ver notificaciones anteriores</p>
                                                    </div>

                                                </>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!isAuthenticated && !isLoading && (
                        <>
                            <button onClick={onLoginClick} className="header__login__button">
                                Iniciar sesión
                            </button>
                            <button onClick={onRegisterClick} className="header__login__button">
                                Registrarse
                            </button>
                        </>
                    )}
                </div>

                <div className="header__toggle" onClick={toggleMenu}>
                    {menuVisible ? <FaTimes className="header__icon" /> : <FaBars className="header__icon" />}
                </div>
            </div>
        </header>
    );
};