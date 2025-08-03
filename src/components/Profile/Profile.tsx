import React from "react";
import "./Profile.css";
import { useAuth } from "../../providers/Auth";
import { RegularProfile } from "./RegularProfile";
import { UniversityProfile } from "./UniversityProfile";
import { BusinessProfile } from "./BusinessProfile";

export const UserProfile: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <>
            {user.role === "regular" && (
                <RegularProfile />
            )}
            {user.role === "university" && (
                <UniversityProfile />
            )}
            {user.role === "business" && (
                <BusinessProfile />
            )}
        </>
    );
};
