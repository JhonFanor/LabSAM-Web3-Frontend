import React from "react";
import { Link } from "react-router-dom";
import { BankOfResumeGetAllResponse } from "../../dtos/responses";
import "./BankOfResumeItem.css";

type Props = {
    resume: BankOfResumeGetAllResponse;
};

export const BankOfResumeItem: React.FC<Props> = ({ resume }) => (
    <Link to={`/bank-of-resume/${resume.id}`} className="bank-of-resume-item__list-item">
        <img src={resume.photo} alt={resume.user.regular_user?.name} className="bank-of-resume-item__list-item-photo"/>
        <p className="bank-of-resume-item__list-item-title">{resume.title}</p>
        <p className="bank-of-resume-item__list-item-user"><img src={resume.user.avatar || "/src/assets/img/avatar.png"} alt="icono" className="avatar_img"/> {resume.user.regular_user?.name || "Anónimo"}</p>
    </Link>
);
