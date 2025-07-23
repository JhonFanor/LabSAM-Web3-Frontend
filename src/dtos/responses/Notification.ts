import { UserMinimalResponse } from "./User";

export interface NotificationGetAllResponse {
    id: number;
    message: string;
    resource_type: string;
    resource_id: number;
    action: string;
    sender: UserMinimalResponse;
    is_read: boolean;
}

export interface NotificationGetResponse {
    id: number;
    message: string;
    resource_type: string;
    resource_id: number;
    action: string;
    user: UserMinimalResponse;
}
