import { FaClipboardCheck, FaHome, FaUserShield } from "react-icons/fa";
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
];
