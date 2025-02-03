import React from 'react';
import { FaHome, FaUser, FaNewspaper, FaCalendarAlt, FaSearch, FaBriefcase, FaFileAlt, FaBuilding, FaGraduationCap, FaBalanceScale, FaBook, FaSignOutAlt, FaCircle } from 'react-icons/fa';

export const logoutItem = {
  route: '/logout',
  label: 'Cerrar la sesión',
  icon: FaSignOutAlt,
};

export const logoItem = {
  route: '/',
  label: 'Bedimcode',
  icon: FaCircle,
};


export interface MenuItem {
  route: string;
  label: string;
  icon?: React.ElementType;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    route: '/',
    label: 'Inicio',
    icon: FaHome,
  },
  {
    route: '/profile',
    label: 'Perfil',
    icon: FaUser,
    children: [
      { route: '/profile/passwords', label: 'Passwords' },
      { route: '/profile/mail', label: 'Mail' },
      { route: '/profile/accounts', label: 'Accounts' },
    ],
  },
  {
    route: '/news',
    label: 'Noticias',
    icon: FaNewspaper,
  },
  {
    route: '/events',
    label: 'Eventos',
    icon: FaCalendarAlt,
  },
  {
    route: '/investigations',
    label: 'Investigaciones',
    icon: FaSearch,
  },
  {
    route: '/job-board',
    label: 'Bolsa de empleos',
    icon: FaBriefcase,
  },
  {
    route: '/resume-bank',
    label: 'Banco de hojas de vida',
    icon: FaFileAlt,
  },
  {
    route: '/companies',
    label: 'Empresas',
    icon: FaBuilding,
  },
  {
    route: '/educational-offers',
    label: 'Ofertas educativas',
    icon: FaGraduationCap,
  },
  {
    route: '/legislations',
    label: 'Legislaciones',
    icon: FaBalanceScale,
  },
  {
    route: '/documentations',
    label: 'Documentaciones',
    icon: FaBook,
  },
];
