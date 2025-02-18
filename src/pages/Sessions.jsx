// import React, { useEffect, useState } from 'react';
// import { useSwipeable } from 'react-swipeable';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiPlusCircle, FiTrash2, FiX, FiEdit3 } from 'react-icons/fi';
// import ClipLoader from 'react-spinners/ClipLoader';
// import Modal from '../components/Modal';

// const SessionsPage = () => {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState(null); // Modal content to handle different scenarios
//   const [longPressedSessionId, setLongPressedSessionId] = useState(null);
//   const [longPressTimer, setLongPressTimer] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         // Show loading spinner in modal
//         setModalContent({
//           title: "Retrying Please Wait...",
//           message: <ClipLoader color="#8b5cf6" size={30} />,
//           onConfirm: null, // Disable action during the loading phase
//           confirmText: null,
//         });
//         const token = localStorage.getItem('jwtToken');
//         const response = await fetch('https://ajozave-api.onrender.com/api/sessions', {
//           // const response = await fetch('http://localhost:4000/api/sessions', {

//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 401) {
//           setModalContent({
//             title: "Session Expired",
//             message: "Please log in again to continue.",
//             onConfirm: handleLoginRedirect,
//             confirmText: "Log In",
//           });
//           setShowModal(true);
//           return;
//         }

//         if (!response.ok) {
//           const errorMessage = await response.json().catch(() => ({}));
//           throw new Error(errorMessage.error || "An unexpected error occurred");
//         }

//         const data = await response.json();
//         setSessions(data.sessions);
//         setShowModal(false)
//       } catch (err) {
//         if (err.message === "No sessions found for this admin") {
//           return
//         }
//         setModalContent({
//           title: "Error",
//           message: err.message || "An unexpected error occurred",
//           onConfirm: fetchSessions, // Retry fetching sessions
//           confirmText: "Retry",
//         });
//         setShowModal(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, []);

//   const handleLoginRedirect = () => {
//     localStorage.removeItem('jwtToken');
//     navigate('/authentication');
//   };

//   const handleDeleteSession = async (sessionId) => {
//     try {
//       // Show loading spinner in modal
//       setModalContent({
//         title: "Deleting Session...",
//         message: <ClipLoader color="#8b5cf6" size={30} />,
//         onConfirm: null, // Disable action during the loading phase
//         confirmText: null,
//       });

//       const token = localStorage.getItem('jwtToken');
//       const response = await fetch(`https://ajozave-api.onrender.com/api/sessions/${sessionId}`, {
//         // const response = await fetch('http://localhost:4000/api/sessions/${sessionId}', {

//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         setModalContent({
//           title: "Session Expired",
//           message: "Please log in again to continue.",
//           onConfirm: handleLoginRedirect,
//           confirmText: "Log In",
//         });
//         setShowModal(true);
//         return;
//       }

//       if (!response.ok) {
//         const errorMessage = await response.json().catch(() => ({}));
//         throw new Error(errorMessage.error || "An unexpected error occurred");
//       }

//       // Update sessions after successful deletion
//       setSessions(sessions.filter((session) => session._id !== sessionId));

//       // Show success message
//       setModalContent({
//         title: "Session Deleted",
//         message: "The session has been successfully deleted.",
//         onConfirm: () => setShowModal(false),
//         confirmText: "OK",
//       });
//     } catch (err) {
//       setModalContent({
//         title: "Error",
//         message: err.message || "An unexpected error occurred",
//         onConfirm: fetchSessions, // Retry fetching sessions
//         confirmText: "Retry",
//       });
//       setShowModal(true);
//     } finally {
//       setLongPressedSessionId(null);
//     }
//   };

//   let startX = 0;
//   let startY = 0;

//   const handleTouchStart = (sessionId, event) => {
//     // Capture the start position of the touch
//     const touch = event.touches ? event.touches[0] : event;
//     startX = touch.clientX;
//     startY = touch.clientY;

//     // Start the long-press timer
//     const timer = setTimeout(() => {
//       setLongPressedSessionId(sessionId);
//     }, 800); // Long-press threshold in milliseconds
//     setLongPressTimer(timer);
//   };

//   const handleTouchMove = (event) => {
//     // Capture the current position of the touch
//     const touch = event.touches ? event.touches[0] : event;
//     const deltaX = Math.abs(touch.clientX - startX);
//     const deltaY = Math.abs(touch.clientY - startY);

//     // If movement exceeds the threshold, it's considered a scroll
//     if (deltaX > 10 || deltaY > 10) {
//       if (longPressTimer) {
//         clearTimeout(longPressTimer);
//         setLongPressTimer(null);
//       }
//     }
//   };

//   const handleTouchEnd = (sessionId) => {
//     // Clear the long-press timer
//     if (longPressTimer) {
//       clearTimeout(longPressTimer);
//       setLongPressTimer(null);

//       // If no long press was detected, trigger the click action
//       if (longPressedSessionId === null) {
//         navigate(`/collector-sessions/${sessionId}`);
//       }
//     }
//   };


//   const handleCancelLongPress = () => {
//     setLongPressedSessionId(null); // Reset the selected session ID
//   };

//   const handleShowDeleteModal = (sessionId, sessionStatus) => {
//     if (!sessionId) {
//       console.error("Invalid session ID:", sessionId);
//       return;
//     }

//     if (sessionStatus === 'active') {
//       setModalContent({
//         title: "Cannot Delete Active Session",
//         message: "This session is currently active and cannot be deleted.",
//         onConfirm: () => { setShowModal(false); handleCancelLongPress(); }, // Close modal without action
//         confirmText: "OK",
//       });
//     } else if (sessionStatus === 'inactive') {
//       setModalContent({
//         title: "Confirm Delete",
//         message: "Are you sure you want to delete this inactive session? This action cannot be undone.",
//         onConfirm: () => handleDeleteSession(sessionId), // Correctly deferred execution
//         confirmText: "Proceed",
//       });
//     } else {
//       console.error("Invalid session status:", sessionStatus);
//       return;
//     }

//     setShowModal(true);
//   };

//   const swipeHandlers = useSwipeable({
//     onSwipedLeft: () => { },
//     onSwipedRight: () => { },
//     trackMouse: true,
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <ClipLoader color="#8b5cf6" size={40} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-purple-50 animate-slide-in">
//       <header className="flex items-center justify-between p-4 bg-white shadow-sm">
//         <h1 className="text-2xl font-semibold text-purple-700">My Sessions</h1>
//         <Link
//           to="/collector-create-session"
//           className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105"
//           title="Create a Session"
//         >
//           <FiPlusCircle size={31} />
//         </Link>
//       </header>

//       {/* Conditional Guide Text */}
//       {sessions.length > 0 && (
//         <div className="px-4 mt-2">
//           <p className="text-sm text-gray-500 text-center">
//             <span className="font-medium text-purple-600">Tip:</span> Long press (or tap and hold) on a session card to edit or delete it.
//           </p>
//         </div>
//       )}

//       <div className="flex-grow p-4 overflow-y-auto" {...swipeHandlers}>
//         {sessions.length === 0 ? (
//           <div className="text-center mt-10">
//             <p className="text-gray-500 mb-6">
//               {/* {error === 'No sessions found for this admin' ? "You haven't created any sessions yet." : error} */}
//               You haven't created any sessions yet.
//             </p>
//             <button
//               onClick={() => navigate('/collector-create-session')}
//               className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105"
//             >
//               Create a Session
//             </button>
//           </div>
//         ) : (
//           sessions.map((session) => (
//             <div
//               key={session._id}
//               onContextMenu={(e) => e.preventDefault()} // Prevent context menu
//               onMouseDown={(e) => handleTouchStart(session._id, e)}
//               onMouseUp={() => handleTouchEnd(session._id)}
//               onTouchStart={(e) => handleTouchStart(session._id, e)}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={() => handleTouchEnd(session._id)}
//               className={`relative bg-white rounded-xl p-4 mb-4 shadow-sm transform transition-all duration-200 ease-in-out ${longPressedSessionId === session._id ? 'scale-95' : 'hover:scale-105 focus:scale-105'
//                 } select-none`}
//             >
//               {longPressedSessionId === session._id && (
//                 <div className="absolute inset-0 flex items-center justify-center space-x-4 bg-opacity-50 bg-gray-700 rounded-xl">
//                   {/* Edit Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent any unwanted parent action
//                       navigate(`/edit-session/${session._id}`);
//                     }}
//                     className="flex items-center justify-center bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition shadow-lg z-10"
//                   >
//                     <FiEdit3 size={20} />
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent the card's `onTouchEnd` or `onMouseUp` from firing
//                       handleShowDeleteModal(session._id, session.status);
//                     }}
//                     className="flex items-center justify-center bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition shadow-lg z-10"
//                   >
//                     <FiTrash2 size={20} />
//                   </button>

//                   {/* Cancel Button */}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleCancelLongPress();
//                     }}
//                     className="flex items-center justify-center bg-gray-300 text-gray-700 rounded-full p-3 hover:bg-gray-400 transition shadow-lg z-10"
//                   >
//                     <FiX size={20} />
//                   </button>
//                 </div>
//               )}

//               <div className={`relative ${longPressedSessionId === session._id ? 'opacity-50' : 'opacity-100'}`}>
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-grow">
//                     <h2 className="text-lg font-semibold text-purple-700 leading-tight">{session.sessionName}</h2>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-lg text-sm ${session.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
//                       }`}
//                     style={{ whiteSpace: 'nowrap' }} // Prevent wrapping for the status indicator
//                   >
//                     {session.status === 'active' ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center mt-2">
//                   <div>
//                     <p className="text-sm text-gray-500">Contribution</p>
//                     <p className="text-lg font-bold text-gray-600">₦{session.contributionAmount.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Duration</p>
//                     <p className="text-lg font-bold text-gray-500">{session.duration}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm text-gray-500">Start Date</p>
//                     <p className="text-lg font-bold text-gray-500">
//                       {new Date(session.startDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {showModal && modalContent && (
//         <>
//           <Modal
//             isOpen={showModal}
//             title={modalContent?.title || ''}
//             message={modalContent?.message || ''}
//             onCancel={() => {
//               setShowModal(false);
//               handleCancelLongPress();
//             }}
//             onConfirm={modalContent?.onConfirm || null}
//             confirmText={modalContent?.confirmText}
//             disableCancel={modalContent?.disableCancel || false}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default SessionsPage;
































import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiX, FiEdit3 } from 'react-icons/fi';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from '../components/Modal';
import { fetchSessions, deleteSession } from '../redux/session/sessionsSlice';
import { useDispatch, useSelector } from 'react-redux';
import SessionsTab from '../components/SessionsTab';
import { ArrowLeftIcon } from "@heroicons/react/24/outline"; // Import Heroicons

const SessionsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Modal content to handle different scenarios
  const [longPressedSessionId, setLongPressedSessionId] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const { sessions, loading, error } = useSelector((state) => state.session);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleLoginRedirect = () => {
    localStorage.removeItem('jwtToken');
    navigate('/authentication');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (sessions.length === 0) {
          const resultAction = await dispatch(fetchSessions());

          // Check if the action was rejected and handle 401 specifically
          if (fetchSessions.rejected.match(resultAction)) {
            if (resultAction.payload === 'Session expired, please log in.') {
              // Redirect to login page
              handleLoginRedirect();
              alert('Your session has expired. Please log in again.');
            } else {
              // Handle other errors
              console.error('Failed to fetch sessions:', resultAction.payload);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchData();
  }, [dispatch, sessions]);


  const handleDeleteSession = (sessionId) => {
    // Show loading state in modal
    setModalContent({
      title: "Deleting Session...",
      message: <ClipLoader color="#8b5cf6" size={30} />,
      onConfirm: null, // Disable action during the loading phase
      confirmText: null,
    });

    dispatch(deleteSession(sessionId))
      .unwrap()
      .then(() => {
        // Show success message
        setModalContent({
          title: "Session Deleted",
          message: "The session has been successfully deleted.",
          onConfirm: () => setShowModal(false),
          confirmText: "OK",
        });
      })
      .catch((error) => {
        // Show error message

        // if response is 401, redirect to login
        if (error === 'Session expired, please log in.') {
          setModalContent({
            title: "Session Expired",
            message: "Please log in again to continue.",
            onConfirm: handleLoginRedirect,
            confirmText: "Log In",
          });
          setShowModal(true);
          return;
        }

        setModalContent({
          title: "Error",
          message: error || "An unexpected error occurred",
          onConfirm: () => setShowModal(false),
          confirmText: "OK",
        });
      });
  };

  let startX = 0;
  let startY = 0;

  const handleTouchStart = (sessionId, event) => {
    // Capture the start position of the touch
    const touch = event.touches ? event.touches[0] : event;
    startX = touch.clientX;
    startY = touch.clientY;

    // Start the long-press timer
    const timer = setTimeout(() => {
      setLongPressedSessionId(sessionId);
    }, 800); // Long-press threshold in milliseconds
    setLongPressTimer(timer);
  };

  const handleTouchMove = (event) => {
    // Capture the current position of the touch
    const touch = event.touches ? event.touches[0] : event;
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);

    // If movement exceeds the threshold, it's considered a scroll
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  };

  const handleTouchEnd = (sessionId) => {
    // Clear the long-press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);

      // If no long press was detected, trigger the click action
      if (longPressedSessionId === null) {
        navigate(`/collector-sessions/${sessionId}`);
      }
    }
  };


  const handleCancelLongPress = () => {
    setLongPressedSessionId(null); // Reset the selected session ID
  };

  const handleShowDeleteModal = (sessionId, sessionStatus) => {
    if (!sessionId) {
      console.error("Invalid session ID:", sessionId);
      return;
    }

    if (sessionStatus === 'active') {
      setModalContent({
        title: "Cannot Delete Active Session",
        message: "This session is currently active and cannot be deleted.",
        onConfirm: () => { setShowModal(false); handleCancelLongPress(); }, // Close modal without action
        confirmText: "OK",
      });
    } else if (sessionStatus === 'inactive') {
      setModalContent({
        title: "Confirm Delete",
        message: "Are you sure you want to delete this inactive session? This action cannot be undone.",
        onConfirm: () => handleDeleteSession(sessionId), // Correctly deferred execution
        confirmText: "Proceed",
      });
    } else {
      console.error("Invalid session status:", sessionStatus);
      return;
    }

    setShowModal(true);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => { },
    onSwipedRight: () => { },
    trackMouse: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#8b5cf6" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 animate-slide-in">

      <header className="sticky top-0 w-full flex items-center justify-between p-4 bg-white shadow-sm px-4 py-3 z-50">
        {/* Modern Back Arrow Icon */}
        <button
          className="text-customPurple hover:opacity-80 transition-opacity"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6" /> {/* Properly sized for all devices */}
        </button>

        {/* Centered Title */}
        <h1 className="text-2xl font-semibold text-customPurpleDark flex-grow text-center">
          My Sessions
        </h1>

        {/* Create Session Button */}
        <Link
          to="/collector-create-session"
          className="bg-customPurpleDark text-white rounded-full hover:shadow-xl transform transition duration-300 hover:scale-105"
          title="Create a Session"
        >
          <FiPlus size={25} />

        </Link>
      </header>


      {/* Conditional Guide Text */}
      {sessions.length > 0 && (
        <div className="px-4 mt-2">
          <p className="text-sm text-gray-500 text-center">
            <span className="font-medium text-customPurple">Tip:</span> Long press (or tap and hold) on a session card to edit or delete it.
          </p>
        </div>
      )}

      <div className="flex-grow p-4 overflow-y-auto" {...swipeHandlers}>
        {sessions.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-6">
              {/* {error === 'No sessions found for this admin' ? "You haven't created any sessions yet." : error} */}
              You haven't created any sessions yet.
            </p>
            <button
              onClick={() => navigate('/collector-create-session')}
              className="px-6 py-3 bg-customViolet text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105"
            >
              Create a Session
            </button>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              onContextMenu={(e) => e.preventDefault()} // Prevent context menu
              onMouseDown={(e) => handleTouchStart(session._id, e)}
              onMouseUp={() => handleTouchEnd(session._id)}
              onTouchStart={(e) => handleTouchStart(session._id, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(session._id)}
              className={`relative bg-white rounded-xl p-4 mb-4 shadow-sm transform transition-all duration-200 ease-in-out ${longPressedSessionId === session._id ? 'scale-95' : 'hover:scale-105 focus:scale-105'
                } select-none`}
            >
              {longPressedSessionId === session._id && (
                <div className="absolute inset-0 flex items-center justify-center space-x-4 bg-opacity-50 bg-gray-700 rounded-xl">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent any unwanted parent action
                      navigate(`/collector-edit-session/${session._id}`);
                    }}
                    className="flex items-center justify-center bg-customPurpleMid text-white rounded-full p-3 hover:bg-blue-600 transition shadow-lg z-10"
                  >
                    <FiEdit3 size={20} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card's `onTouchEnd` or `onMouseUp` from firing
                      handleShowDeleteModal(session._id, session.status);
                    }}
                    className="flex items-center justify-center bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition shadow-lg z-10"
                  >
                    <FiTrash2 size={20} />
                  </button>

                  {/* Cancel Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelLongPress();
                    }}
                    className="flex items-center justify-center bg-gray-300 text-gray-700 rounded-full p-3 hover:bg-gray-400 transition shadow-lg z-10"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              )}

              <div className={`relative ${longPressedSessionId === session._id ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-700 leading-tight">{session.sessionName}</h2>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${session.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    style={{ whiteSpace: 'nowrap' }} // Prevent wrapping for the status indicator
                  >
                    {session.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Contribution</p>
                    <p className="text-lg font-bold text-gray-500">₦{session.contributionAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-bold text-gray-500">{session.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="text-lg font-bold text-gray-500">
                      {new Date(session.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && modalContent && (
        <>
          <Modal
            isOpen={showModal}
            title={modalContent?.title || ''}
            message={modalContent?.message || ''}
            onCancel={() => {
              setShowModal(false);
              handleCancelLongPress();
            }}
            onConfirm={modalContent?.onConfirm || null}
            confirmText={modalContent?.confirmText}
            disableCancel={modalContent?.disableCancel || false}
          />
        </>
      )}
    </div>
  );
};

export default SessionsPage;