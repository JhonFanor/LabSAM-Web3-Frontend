import React from "react";
import { ApprovalTabs } from "../components/ApprovalTabs";

const PendingApprovalsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Aprobaciones pendientes</h1>
      <ApprovalTabs />
    </div>
  );
};

export default PendingApprovalsPage;
