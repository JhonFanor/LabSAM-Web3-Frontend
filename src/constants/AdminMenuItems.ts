import { FaClipboardCheck, FaHome, FaShieldAlt } from "react-icons/fa";
import { MenuItem } from "./MenuItems";

export const adminMenuItems: MenuItem[] = [
    {
        route: '/',
        label: 'Inicio',
        icon: FaHome,
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
