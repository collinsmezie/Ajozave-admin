// src/components/Header.js
// import React from 'react';

// const Header = () => {
//   return (
//     // <div class="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 w-full z-50">

//     <div className="flex justify-between items-center p-4 bg-white sticky top-0 left-0 right-0">
//       <div className="text-2xl font-bold text-red-600">Ajo<span className="text-gray-400">Zave</span></div>
//       <div className="flex space-x-4">
//         <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
//           <i className="fas fa-search text-gray-600 text-xl"></i>
//         </div>
//         <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
//           <i className="fas fa-bell text-gray-600 text-xl"></i>
//         </div>
//         <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
//           <i className="fas fa-user-circle text-gray-600 text-xl"></i>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;



{/* <header className="sticky top-0 w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl z-50 mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={`https://api.dicebear.com/5.x/avataaars/svg?seed=Username`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-purple-300"
          />
          <div>
            <p className="text-black text-sm font-medium">Hi, {fetchUserName()}</p>
            <p className="text-gray-600 text-xs">Let's save together!</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 bg-white transition duration-300">
            <FiSliders className="text-purple-500 w-5 h-5" />
          </button>
        </div>
      </header> */}










import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSliders, FiEdit3, FiTrash2, FiX } from "react-icons/fi";

const Header = ({ fetchUserName, session, handleShowDeleteModal, handleCancelLongPress }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  return (
    <header className="sticky top-0 w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl z-50 mb-4 transition-all duration-300">
      {/* User Info */}
      <div className="flex items-center space-x-3">
        <img
          src={`https://api.dicebear.com/5.x/avataaars/svg?seed=Username`}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-purple-300"
        />
        <div>
          <p className="text-black text-sm font-medium">Hi, {fetchUserName()}</p>
          <p className="text-gray-600 text-xs">Let's save together!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 relative">
        {showActions ? (
          <div className="flex items-center space-x-3 transition-all duration-300">
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/collector-edit-session/${session._id}`);
              }}
              className="flex items-center justify-center bg-customPurpleMid text-white rounded-full p-3 hover:bg-blue-600 transition shadow-lg z-10"
            >
              <FiEdit3 size={14} />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShowDeleteModal(session._id, session.status);
              }}
              className="flex items-center justify-center bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition shadow-lg z-10"
            >
              <FiTrash2 size={14} />
            </button>

            {/* Cancel Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(false); // Hide action buttons
              }}
              className="flex items-center justify-center bg-gray-300 text-gray-700 rounded-full p-3 hover:bg-gray-400 transition shadow-lg z-10"
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <button
            className="p-2 bg-white transition duration-300"
            onClick={() => setShowActions(true)} // Show action buttons
          >
            <FiSliders className="text-purple-500 w-5 h-5 transition-transform duration-300 transform hover:rotate-90" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
