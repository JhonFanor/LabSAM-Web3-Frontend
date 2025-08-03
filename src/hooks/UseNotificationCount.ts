import { useEffect, useState } from "react";
import { countNotificationsNotRead } from "../api/NotificationApi";
import { CountResponse } from "../dtos/responses/Count";
import { useAuth } from "../providers/Auth";

export function useNotificationCount(): number | undefined {
    const { isAuthenticated } = useAuth();
    const [count, setCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!isAuthenticated) {
            setCount(0); 
            return;
        }

        const fetchCount = async () => {
        try {
            const response: CountResponse = await countNotificationsNotRead();
            setCount(response.count);
        } catch (error) {
            console.error("Error al obtener el conteo de notificaciones no leídas", error);
        }
        };

        fetchCount();

        const interval = setInterval(fetchCount, 60000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return isAuthenticated ? count : 0;
}

