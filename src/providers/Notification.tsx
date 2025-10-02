import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { NotificationGetAllResponse } from "../dtos/responses/Notification";
import {
    getAllNotifications,
    markNotificationAsRead as apiMarkNotificationAsRead,
    markAllNotificationsAsRead as apiMarkAllNotificationsAsRead,
    deleteNotification as apiDeleteNotification,
} from "../api/NotificationApi";
import { useAuth } from "./Auth";

interface NotificationContextType {
    notifications: NotificationGetAllResponse[];
    unreadCount: number;
    loading: boolean;
    setNotifications: React.Dispatch<React.SetStateAction<NotificationGetAllResponse[]>>;
    reloadNotifications: (page?: number, limit?: number) => Promise<{ data: NotificationGetAllResponse[]; total_page: number } | null>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotificationById: (id: number) => Promise<void>;
    pushNotification: (n: NotificationGetAllResponse) => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationGetAllResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const computeUnread = (list: NotificationGetAllResponse[]) => {
        return list.filter((n) => !n.is_read).length;
    };

    const reloadNotifications = useCallback(async (page = 1, limit = 10) => {
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            return null;
        }
        setLoading(true);
        try {
            const data = await getAllNotifications(page, limit);
            setNotifications(data.data);
            setUnreadCount(computeUnread(data.data));
            return data;
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
            setNotifications([]);
            setUnreadCount(0);
            return null;
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            reloadNotifications().catch(console.error);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [isAuthenticated, reloadNotifications]);

    const markAsRead = useCallback(async (id: number) => {
        let decremented = false;
        setNotifications((prev) =>
            prev.map((n) => {
                if (n.id === id) {
                    if (!n.is_read) decremented = true;
                    return { ...n, is_read: true };
                }
                return n;
            })
        );
        if (decremented) setUnreadCount((u) => Math.max(0, u - 1));
        try {
            await apiMarkNotificationAsRead(id);
        } catch (error) {
            console.error("Error marcando notificación como leída:", error);
            await reloadNotifications().catch(console.error);
        }
    }, [reloadNotifications]);

    const markAllAsRead = useCallback(async () => {
        const prev = notifications;
        setNotifications((prevList) => prevList.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        try {
            await apiMarkAllNotificationsAsRead();
        } catch (error) {
            console.error("Error marcando todas como leídas:", error);
            setNotifications(prev);
            setUnreadCount(computeUnread(prev));
        }
    }, [notifications]);

    const deleteNotificationById = useCallback(async (id: number) => {
        const existing = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (existing && !existing.is_read) setUnreadCount((u) => Math.max(0, u - 1));
        try {
            await apiDeleteNotification(id);
        } catch (error) {
            console.error("Error eliminando notificación:", error);
            await reloadNotifications().catch(console.error);
        }
    }, [notifications, reloadNotifications]);

    const pushNotification = useCallback((notification: NotificationGetAllResponse) => {
        setNotifications((prev) => [notification, ...prev]);
        if (!notification.is_read) setUnreadCount((u) => u + 1);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        loading,
        setNotifications,
        reloadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotificationById,
        pushNotification,
        clearNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications debe usarse dentro de NotificationProvider");
    return context;
};
