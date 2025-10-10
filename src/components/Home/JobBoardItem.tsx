import React from "react";
import { Link } from "react-router-dom";
import { JobBoardGetAllResponse } from "../../dtos/responses";
import "./JobBoardItem.css";

type Props = {
    job: JobBoardGetAllResponse;
};

export const JobBoardItem: React.FC<Props> = ({ job }) => (
    <Link to={`/job-board/${job.id}`} className="job-board-item__list-item">
        <h1>Oferta de trabajo</h1>
        <div className="job-board-item__image-container">
            <img src={job.logo? job.logo: "/src/assets/img/Logo.jpeg"} alt={job.title} className="job-board-item__list-item-image" />
        </div>
        <div className="job-board-item__content">
            <h3 className="job-board-item__list-item-title">{job.title}</h3>
            <p className="job-board-item__list-item-company">
                Empresa: {job.company}
            </p>

            <div className="job-board-item__list-item-description" dangerouslySetInnerHTML={{__html:job.description.length > 250 ? job.description.substring(0, 250) + "..." : job.description,}} />

            <p className="job-board-item__list-item-user">
                Subido por:<img src={job.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/>
                {job.user.regular_user?.name ||
                    job.user.university_user?.name ||
                    job.user.business_user?.name ||
                    "Anónimo"}
            </p>
        </div>
    </Link>
);
