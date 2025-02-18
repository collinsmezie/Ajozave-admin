
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserIcon } from "@heroicons/react/24/solid";
import { FiCheck, FiX, FiUserPlus, FiCircle, FiPhone, FiChevronDown, FiChevronUp, FiCheckCircle, FiUserCheck, FiSliders } from 'react-icons/fi';
import ClipLoader from 'react-spinners/ClipLoader';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSessionDetails, setModalVisibility } from '../redux/session/contributorSessionDetailsSlice';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Modal from "../components/Modal";
import { fetchUserName } from '../utility/helper';

const ContributorSessionDetails = () => {
  const { sessionId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const contributionPercentage = 50;

  const { session, sessions, members, loading, error, showModal } = useSelector((state) => state.contributorSessionDetails);

  const [showAllMembers, setShowAllMembers] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const [modalContent, setModalContent] = useState(false);


  const handleNavigation = () => {

    //This function will later handle the logic for adding the interested member to Interested members array

    // navigate(`/collector-sessions/${sessionId}/members`);

  };

  const handleLoginRedirect = () => {
    dispatch(setModalVisibility(false));
    localStorage.removeItem('jwtToken');
    navigate('/authentication');
  };

  const generateNumber = () => {
    const newNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return newNumber;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // check if the session is already in the store
        if (session && session._id === sessionId) {
          return;
        }
        const resultAction = await dispatch(fetchSessionDetails(sessionId));

        console.log("RESULT ACTIONZZ", resultAction)

        // Check if the action was rejected and handle 401 specifically
        if (fetchSessionDetails.rejected.match(resultAction)) {
          if (resultAction.payload === 'Session expired, please log in.') {
            // Redirect to login page
            handleLoginRedirect();
            alert('Your session has expired. Please log in again.'); // Optional: Show a notification
          } else {
            // Handle other errors
            console.error('Failed to fetch session details:', resultAction.payload);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchData();
  }, [dispatch, sessionId]);


  useEffect(() => {
    const fetchInterestedMembers = async () => {
      try {

        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`https://ajozave-api.onrender.com/api/sessions/${sessionId}/interestedMembers`, {
          // const response = await fetch('http://localhost:4000/api/users', {

          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setModalContent({
            title: 'Session Expired',
            message: 'Please log in again to continue.',
            onConfirm: handleLoginRedirect,
            confirmText: 'Login',
            disableCancel: true,
          });
          // setAlertShowModal(true);
          return;
        }

        if (!response.ok) {
          const errorMessage = await response.json().catch(() => ({}));
          throw new Error(errorMessage.error || "An unexpected error occurred");
        }

        const data = await response.json();
        console.log("DATA", data);
        setInterestedMembers(data.interestedMembers);
        // setAlertShowModal(false);
      } catch (err) {
        setModalContent({
          title: 'Errorss',
          message: err.message || "An unexpected error occurred",
          onConfirm: fetchInterestedMembers,
          confirmText: 'Retry',
          disableCancel: true,
        });
        // setAlertShowModal(true);
      } finally {
        // setModalContent((prev) => ({ ...prev, isOpen: false }));
        setModalContent(false);
      }
    };

    fetchInterestedMembers();
  }, []);



  const handleDeleteMember = async (memberId) => {
    try {
      setDeletingMember(memberId);
      const resultAction = await dispatch(deleteMember({ sessionId, memberId }));

      if (deleteMember.fulfilled.match(resultAction)) {
        console.log("Member successfully deleted:", resultAction.payload);
        // set interested members to the new list of members
        setInterestedMembers(resultAction.payload.response);
        setFocusedMember(null);
      } else {
        console.error("Delete failed:", resultAction.payload || "Unknown error");
        alert(resultAction.payload || "Failed to delete member.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong.");
    } finally {
      setDeletingMember(null);
    }
  };


  const toggleShowMembers = () => {
    setShowAllMembers((prev) => !prev);
  };

  const handleSelect = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };


  const handleConfirmSelection = async () => {
    setSubmitLoading(true);
    try {
      const resultAction = await dispatch(addMembers({ sessionId, selectedMembers }));

      if (addMembers.fulfilled.match(resultAction)) {
        console.log("Members successfully added:", resultAction.payload);
        setInterestedMembers([]);
        setModalOpen(false);

        navigate(`/collector-sessions/${sessionId}`);
      } else {
        setModalContent({
          title: 'Error',
          message: resultAction.payload || 'Failed to add members.',
          onCancel: () => setModalContent((prev) => ({ ...prev, isOpen: false })),
        });
        // setAlertShowModal(true);
      }
    } catch (err) {
      setModalContent({
        title: 'Error',
        message: 'Failed to add members. Please try again later.',
        onCancel: () => setModalContent((prev) => ({ ...prev, isOpen: false })),
      });
      // setAlertShowModal(true);
    } finally {
      setSubmitLoading(false);
    }
  };


  if (showModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-lg font-semibold text-gray-700">Session Expired</h3>
          <p className="text-gray-600 mt-2">Please log in again to continue.</p>
          <button
            onClick={handleLoginRedirect}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader color="#8b5cf6" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Modal
        isOpen={true}
        title="Error"
        message={error}
        onConfirm={() => dispatch(fetchSessionDetails(sessionId))}
        confirmText="Retry"
        onCancel={() => navigate(-1)}
      />
    );
  }

  const displayedMembers = showAllMembers ? members : members.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* Header */}

      <header className="sticky top-0 w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl z-50 mb-4">

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
      </header>


      <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <p className="text-gray-700 text-sm">Your Total Contribution</p>
            <p className="font-bold text-lg">₦0.00</p>
            <p className="text-xs text-customViolet">0 Members Contributed</p>
          </div>
        </div>

        {/* Circular Progress Widget */}
        <div className="w-16 h-16 relative">
          <CircularProgressbar
            value={contributionPercentage}
            text={`${contributionPercentage}%`}
            strokeWidth={10}
            styles={buildStyles({
              textColor: "#755FFF",
              textSize: "28px",
              fontWeight: "bold",
              pathColor:
                contributionPercentage === 0
                  ? "#D7CCFF"
                  : `rgba(117, 95, 255, ${(contributionPercentage / 100) * 1.2})`,
              trailColor: "#F3F1FF",
              strokeLinecap: "round",
            })}
          />
        </div>
      </div>

      {/* Session Details */}
      <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-700 leading-tight">{session.sessionName}</h2>
            {/* Optional Savings Description */}
            {/* {session.description && (
              <p className="text-sm text-gray-500 mt-1">{session.description}</p>
            )} */}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${session.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}
          >
            {session.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col items-start">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Total Members</p>
            <p className="text-md font-bold text-gray-800">{session.numberOfMembers}</p>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Contribution</p>
            <p className="text-md font-bold text-gray-800">₦{session.contributionAmount.toLocaleString()}</p>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Duration</p>
            <p className="text-md font-bold text-gray-800">{session.duration}</p>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Start Date</p>
            <p className="text-md font-bold text-gray-800">{new Date(session.startDate).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-xs uppercase text-gray-500 tracking-wider">End Date</p>
            <p className="text-md font-bold text-gray-800">{new Date(session.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-lg p-4 mb-10">
        <h1 className="text-lg font-semibold text-gray-700 mb-6 ml-2">Accepted Members ({members.length})</h1>

        {displayedMembers.length === 0 ? (
          <>
          <p className="text-gray-500 text-center">No members joined yet</p>
          <p className="text-gray-500 text-center">Be first to join</p>
          </>
        ) : (
          displayedMembers.map((obj) => (
            <div
              key={obj.member._id}
              className="relative flex items-center bg-white rounded-xl p-4 mb-3 shadow-sm hover:shadow-sm transition-shadow"
            >
              {/* Avatar Section */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-customViolet mr-4">
                <img
                  src={`https://api.dicebear.com/5.x/avataaars/svg?seed=${obj.member.username}`}
                  alt={`${obj.member.username}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Member Details Section */}
              <div className="flex-grow">
                <p className="text-sm font-semibold text-gray-900">{obj.member.username}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <span>+234-{generateNumber()}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* View All / View Less Button */}
        {members.length > 3 && (
          <button
            onClick={toggleShowMembers}
            className="w-full flex items-center justify-center text-customViolet font-semibold mt-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            {showAllMembers ? (
              <>
                <FiChevronUp className="mr-2" />
                Show Less
              </>
            ) : (
              <>
                <FiChevronDown className="mr-2" />
                Show More
              </>
            )}
          </button>
        )}
      </div>


      {/* Action Button */}
      <div className="text-center">
        <button
          type="submit"
          className="w-full max-w-md mb-6 px-2 py-2 bg-customViolet text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-200 flex items-center justify-center space-x-2"
          // onClick={handleNavigation}
          onClick={() => setModalOpen(true)}
        >
          <FiUserPlus size={20} />
          <span>Request To Join</span>
        </button>
      </div>

      {/* modal Content */}
      <Modal
        isOpen={!!modalContent} // Ensure it's a boolean
        title={modalContent?.title || ""}
        message={modalContent?.message || ""}
        onCancel={() => setModalContent(null)}
        onConfirm={modalContent?.onConfirm}
        confirmText={modalContent?.confirmText}
        disableCancel={modalContent?.disableCancel}
      />

    </div>
  );
};

export default ContributorSessionDetails;

