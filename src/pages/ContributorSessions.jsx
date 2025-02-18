import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Link, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from '../components/Modal';
import { fetchSessions } from '../redux/session/contributorSessionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SavingsSessionCard from '../components/SavingsSessionCard';

const ContributorSessions = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null); // Modal content to handle different scenarios
  const { sessions, loading, error } = useSelector((state) => state.contributorSessions);

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


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen select-none">
        <ClipLoader color="#8b5cf6" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 animate-slide-in">

      <header className="sticky top-0 w-full flex items-center justify-between p-4 bg-white shadow-sm">
        {/* Modern Back Arrow Icon */}
        <button
          className="text-customPurple hover:opacity-80 transition-opacity"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6" /> {/* Properly sized for all devices */}
        </button>

        {/* Centered Title */}
        <h1 className="text-2xl font-semibold text-customPurpleDark flex-grow text-center">
          Savings Groups
        </h1>
      </header>


      {/* Conditional Guide Text */}
      {sessions.length > 0 && (
        <div className="px-4 mt-2">
          <p className="text-sm text-gray-500 text-center">
            <span className="font-medium text-customPurple">Info:</span> Open groups available for you
          </p>
        </div>
      )}

      <div className="flex-grow p-4 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-6">
              {/* {error === 'No sessions found for this admin' ? "You haven't created any sessions yet." : error} */}
              No Groups to join yet.
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            // <Link to={`/contributor-groups/${session._id}`} className="space-y-4 mb-4" key={session._id}>
            <Link to={`/contributor-sessions/${session._id}`} key={session._id}>
            <div className="space-y-4 mb-4" >
              <SavingsSessionCard session={session} />
          </div>
          </Link>
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

export default ContributorSessions;