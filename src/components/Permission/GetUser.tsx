import React, { useEffect, useState } from "react";
import { UserGetResponse } from "../../dtos/responses";
import { getUserById } from "../../api/UserApi";
import { getPermissionsByRoleExcludingDenied } from "../../api/PermissionRoleApi";
import { getPermissionsByUser, assignPermissionToUser, revokePermissionFromUser } from "../../api/PermissionUserApi";
import { ButtonClose } from "../Button";
import { PermissionResponse } from "../../dtos/responses/Permission";
import {
  getDeniedPermissionsByUser,
  assignDeniedPermission,
  revokeDeniedPermission,
  AssignOrRevokePermissionRequest,
} from "../../api/DeniedPermissionApi";
import { getAssignablePermissionsToUser } from "../../api/PermissionApi";
import { PermissionUserRequest } from "../../dtos/requests/PermissionUser";


interface GetUserProps {
  onClose: () => void;
  user_id: number;
}

export const GetUser: React.FC<GetUserProps> = ({ onClose, user_id }) => {
  const [user, setUser] = useState<UserGetResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [rolePermissions, setRolePermissions] = useState<PermissionResponse[]>([]);
  const [directPermissions, setDirectPermissions] = useState<PermissionResponse[]>([]);
  const [deniedPermissions, setDeniedPermissions] = useState<PermissionResponse[]>([]);
  const [assignablePermissions, setAssignablePermissions] = useState<PermissionResponse[]>([]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await getUserById(user_id);
      setUser(userData);

      if (userData.role_id) {
        const [rolePerms, directPerms, deniedPerms, assignables] = await Promise.all([
          getPermissionsByRoleExcludingDenied(userData.role_id, user_id),
          getPermissionsByUser(user_id),
          getDeniedPermissionsByUser(user_id),
          getAssignablePermissionsToUser({ user_id: userData.id, role_id: userData.role_id }),
        ]);

        setRolePermissions(rolePerms || []);
        setDirectPermissions(directPerms || []);
        setDeniedPermissions(deniedPerms || []);
        setAssignablePermissions(assignables || []);
      }
    } catch (err) {
      console.error("Error al obtener los datos del usuario:", err);
      setError("No se pudo cargar la información del usuario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user_id]);

  const getUserName = () =>
    user?.business_user?.name ||
    user?.university_user?.name ||
    user?.regular_user?.name ||
    "Sin nombre";

  const getUserType = () => {
    if (user?.business_user) return "Empresarial";
    if (user?.university_user) return "Universitario";
    if (user?.regular_user) return "Regular";
    return "Desconocido";
  };

  const handleDenyPermission = async (permissionId: number) => {
    if (!user) return;
    try {
      const req: AssignOrRevokePermissionRequest = {
        user_id: user.id,
        permission_id: permissionId,
      };
      await assignDeniedPermission(req);
      await fetchUserData();
    } catch (err) {
      alert("Error al denegar el permiso.");
    }
  };

  const handleRemoveDeniedPermission = async (permissionId: number) => {
    if (!user) return;
    try {
      const req: AssignOrRevokePermissionRequest = {
        user_id: user.id,
        permission_id: permissionId,
      };
      await revokeDeniedPermission(req);
      await fetchUserData();
    } catch (err) {
      alert("Error al remover el permiso denegado.");
    }
  };

  const handleAssignPermission = async (permissionId: number) => {
    if (!user) return;
    try {
      const req: PermissionUserRequest = {
        user_id: user.id,
        permission_id: permissionId,
      };
      await assignPermissionToUser(req);
      await fetchUserData();
    } catch (err) {
      alert("Error al asignar el permiso.");
    }
  };

  const handleRevokePermission = async (permissionId: number) => {
    if (!user) return;
    try {
      await revokePermissionFromUser(permissionId, user.id);
      await fetchUserData();
    } catch (err) {
      alert("Error al revocar el permiso.");
    }
  };

  const renderPermissionList = (
    title: string,
    permissions: PermissionResponse[],
    isRolePermission?: boolean,
    isDeniedPermission?: boolean,
    isDirect?: boolean
  ) => (
    <div style={{ marginBottom: "1rem" }}>
      <h4>{title}</h4>
      {permissions && permissions.length > 0 ? (
        <ul>
          {permissions.map((perm) => (
            <li key={perm.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>{perm.name}</span>
              {isRolePermission && (
                <button onClick={() => handleDenyPermission(perm.id)}>Quitar</button>
              )}
              {isDeniedPermission && (
                <button onClick={() => handleRemoveDeniedPermission(perm.id)}>Restaurar</button>
              )}
              {isDirect && (
                <button onClick={() => handleRevokePermission(perm.id)}>Revocar</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay permisos.</p>
      )}
    </div>
  );

  const renderAssignablePermissions = () => (
    <div style={{ marginBottom: "1rem" }}>
      <h4>Permisos que se pueden asignar</h4>
      {assignablePermissions && assignablePermissions.length > 0 ? (
        <ul>
          {assignablePermissions.map((perm) => (
            <li key={perm.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>{perm.name}</span>
              <button onClick={() => handleAssignPermission(perm.id)}>Asignar</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay permisos disponibles para asignar.</p>
      )}
    </div>
  );

  return (
    <div>
      <ButtonClose onClick={onClose} />
      <h3>Detalle del Usuario</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : user ? (
        <>
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
              }}
            />
          )}

          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nombre:</strong> {getUserName()}</p>
          <p><strong>Tipo:</strong> {getUserType()}</p>

          <hr />
          {renderPermissionList("Permisos por Rol", rolePermissions, true)}
          {renderPermissionList("Permisos Denegados del Rol", deniedPermissions, false, true)}
          {renderPermissionList("Permisos Asignados Directamente", directPermissions, false, false, true)}
          {renderAssignablePermissions()}
        </>
      ) : (
        <p>No se encontró información del usuario.</p>
      )}
    </div>
  );
};
