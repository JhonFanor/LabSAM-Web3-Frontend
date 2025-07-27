import React, { useEffect, useState } from "react";
import { UserGetAllResponse } from "../../dtos/responses";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination, GetAllError } from "../../components";
import { getAllUsers } from "../../api/UserApi";
import { GetUser } from "./GetUser";

export const GetAllUser: React.FC = () => {
    const [userList, setUserList] = useState<UserGetAllResponse[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showGetAllUser, setShowGetAllUser] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const closeModals = () => {
        setShowGetAllUser(false);
        setSelectedUserId(null);
    };

    const limit = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers(page, limit);
                setUserList(data.data);
                setTotalPages(data.total_page);
                setError(data.data.length ? null : "No hay usuarios disponibles.");
            } catch (err) {
                setError("No se pudieron cargar los usuarios");
                console.error(err);
            }
        };
        fetchUsers();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
        navigate(`/admin/permissions?page=${newPage}`);
    };

    return (
        <section className="get-all-user">
            <GetAllError message={error} />
            <h2>Lista de Usuarios</h2>

            {userList.length > 0 && (
                <table className="get-all-user__table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Nombre</th>
                            <th>Tipo de Usuario</th>
                            <th>Permisos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => {
                            let name = "";
                            let tipoUsuario = "";

                            if (user.business_user) {
                                name = user.business_user.name;
                                tipoUsuario = "Empresa";
                            } else if (user.university_user) {
                                name = user.university_user.name;
                                tipoUsuario = "Universidad";
                            } else if (user.regular_user) {
                                name = user.regular_user.name;
                                tipoUsuario = "Regular";
                            } else {
                                name = "Sin nombre";
                                tipoUsuario = "Desconocido";
                            }

                            return (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{name}</td>
                                    <td>{tipoUsuario}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setShowGetAllUser(true);
                                            }}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

            {showGetAllUser && selectedUserId !== null && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModals();
                        }
                    }}
                >
                    <GetUser user_id={selectedUserId} onClose={closeModals} />
                </div>
            )}
        </section>
    );
};

