import React from "react";
import { Link } from "react-router-dom";
import { JobBoardGetAllResponse } from "../../dtos/responses";
import "./JobBoardItem.css";

type Props = {
    job: JobBoardGetAllResponse;
};

export const JobBoardItem: React.FC<Props> = ({ job }) => (
    <Link to={`/job-board/${job.id}`} className="job-board-item__list-item">
        <p className="job-board-item__list-item-title">{job.title}</p>
        <p className="job-board-item__list-item-company">Empresa: {job.company}</p>
        <p className="job-board-item__list-item-user">
            Subido por: <img src={job.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {job.user.regular_user?.name || job.user.university_user?.name || job.user.business_user?.name || "Anónimo"}
        </p>
    </Link>
);
