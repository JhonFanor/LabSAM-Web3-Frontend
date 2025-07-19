import React from "react";
import { ApprovalTabs } from "../../components/ApprovalTabs";

const PendingApprovalsPage: React.FC = () => {
    return (
        <>
            <h1>Aprobaciones pendientes</h1>
            <ApprovalTabs />
        </>
    );
};

export default PendingApprovalsPage;
