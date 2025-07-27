import { FaClipboardCheck, FaHome, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { MenuItem } from "./MenuItems";

export const adminMenuItems: MenuItem[] = [
    {
        route: '/',
        label: 'Inicio',
        icon: FaHome,
    },
    {
        route: '/admin/dashboard',
        label: 'Inicio del Administrador',
        icon: FaUserShield,
    },
    {
        route: '/admin/pending-approvals',
        label: 'Aprobaciones pendientes',
        icon: FaClipboardCheck,
    },
    {
        route: '/admin/permissions',
        label: 'Permisos',
        icon: FaShieldAlt,
    },
];
