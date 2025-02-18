import React, { useState } from 'react';
// import  group icon to represent groups

import { HomeIcon, CreditCardIcon, WalletIcon, UserCircleIcon, UserGroupIcon, FolderMinusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const ContributorNav = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home'); // Initial name for active item

  const handleNavigation = (path, name) => {
    setActiveNav(name);  // Set the clicked item's name as active
    navigate(path);
  };

  const navItems = [
    { name: 'Wallet', icon: <WalletIcon className="h-6 w-6" />, path: '/contributor-dashboard' },
    { name: 'Groups', icon: <UserGroupIcon className="h-6 w-6" />, path: '/contributor-sessions' },
    { name: 'Cards', icon: <CreditCardIcon className="h-6 w-6" />, path: '/contributor-coming-soon' },
    { name: 'Misc.', icon: <FolderMinusIcon className="h-6 w-6" />, path: '/contributor-coming-soon' },
    { name: 'Menu', icon: <UserCircleIcon className="h-6 w-6" />, path: '/contributor-coming-soon' },
  ];

  return (
    <div className="sticky bottom-0 bg-white flex justify-around items-center py-2 w-full z-10 rounded-t-2xl border border-t-gray-200">
      {navItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => handleNavigation(item.path, item.name)}
        >
          <div
            className={`flex items-center justify-center p-0.5 transition-all duration-200 ${
              activeNav === item.name ? 'text-customPurple' : 'text-gray-400'
            }`}
          >
            {React.cloneElement(item.icon, {
              className: "h-6 w-6",
            })}
          </div>
          <span
            className={`mt-1 text-xs transition-colors ${
              activeNav === item.name ? 'text-customPurple font-medium' : 'text-gray-500'
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ContributorNav;
