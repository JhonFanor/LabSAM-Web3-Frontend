import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { approvalItems } from "../../constants/ApprovalItems";
import "./ApprovalTabs.css";

export const ApprovalTabs: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const result: Record<string, number> = {};

      for (const item of approvalItems) {
        try {
          const data = await item.fetchFn();
          if ("count" in data && typeof data.count === "number" && data.count > 0) {
            result[item.name] = data.count;
          }
        } catch (error) {
          console.error(`Error cargando ${item.label}`, error);
        }
      }

      setCounts(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    for (const item of approvalItems) {
      if (searchParams.has(`${item.name}Page`)) {
        setActiveSection(item.name);
        return;
      }
    }
  }, [searchParams]);

  const handleTabClick = (itemName: string) => {
    setActiveSection(itemName);

    const newParams = new URLSearchParams();
    newParams.set(`${itemName}Page`, "1");
    setSearchParams(newParams);
  };

  const selectedItem = approvalItems.find((item) => item.name === activeSection);

  if (loading) {
    return (
      <div className="approval-tabs__loading">
        <div className="approval-tabs__loader">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="approval-tabs__wrapper">
      <div className="approval-tabs__container">
        {approvalItems.map((item) =>
          counts[item.name] ? (
            <div
              key={item.name}
              className={`approval-tab ${activeSection === item.name ? "active" : ""}`}
              onClick={() => handleTabClick(item.name)}
            >
              <div className="approval-tab__title">{item.label}</div>
              <div className="approval-tab__badge">{counts[item.name]}</div>
            </div>
          ) : null
        )}
      </div>

      {activeSection && selectedItem && (
        <div className="approval-tabs__content">
          <selectedItem.component />
        </div>
      )}
    </div>
  );
};
