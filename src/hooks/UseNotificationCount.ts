import { useEffect, useState } from "react";
import { countNotificationsNotRead } from "../api/NotificationApi";
import { CountResponse } from "../dtos/responses/Count";

export function useNotificationCount(): number | undefined {
  const [count, setCount] = useState<number | undefined>(undefined);

  useEffect(() => {
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
  }, []);

  return count;
}
