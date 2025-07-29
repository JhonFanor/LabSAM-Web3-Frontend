import React from "react";
import "./Profile.css";
import { useAuth } from "../../providers/Auth";
import { RegularProfile } from "./RegularProfile";

export const UserProfile: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <>
            {user.role === "regular" && (
                <RegularProfile />
            )}
        </>
    );
};
