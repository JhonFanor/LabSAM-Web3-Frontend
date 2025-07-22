import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { publicationItems } from "../../constants/PublicationItems";
import { useAuth } from "../../providers/Auth";
import "./Publication.css"

export const Publication: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    
    const filteredItems = publicationItems.filter((item) => {
        if (item.name === "bankOfResumes" && user?.role !== "regular") return false;
        return true;
    });

    useEffect(() => {
        for (const item of filteredItems) {
            if (searchParams.has(`${item.name}Page`)) {
                setActiveSection(item.name);
                return;
            }
        }
    }, [searchParams]);

     const handleClick = (itemName: string) => {
        setActiveSection(itemName);

        const newParams = new URLSearchParams();
        newParams.set(`${itemName}Page`, "1");
        setSearchParams(newParams);
    };

    const selectedItem = filteredItems.find((item) => item.name === activeSection);

    return (
        <div className="publication">
            <div className="publication__container">
                {filteredItems.map((item) =>
                    <div
                        key={item.name}
                        className={`publication-tab ${activeSection === item.name ? "active" : ""}`}
                        onClick={() => handleClick(item.name)}
                    >
                        <div className="publication-tab__title">{item.label}</div>
                    </div>
                )}
            </div>
            {activeSection && selectedItem ? (
                <div className="publication-tabs__content">
                    <selectedItem.component />
                </div>
            )  : null}

        </div>
    );
}