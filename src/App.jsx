// import React from 'react';
// import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
// import HomePage from './pages/Home';
// import AuthPage from './pages/Authentication';
// import Dashboard from './pages/Dashboard';
// import CollectorDashboard from './pages/CollectorDashboard';
// import ContributorsDashboard from './pages/ContributorDashboard';
// import CreateSessionPage from './pages/CreateSession';
// import EditSessionPage from './pages/EditSession';
// import SessionsPage from './pages/Sessions';
// import SessionDetailsPage from './pages/SessionDetails';
// import MemberSelectionPage from './pages/MemberSelection';
// import CollectorNav from './components/CollectorNav';
// import ContributorNav from './components/ContributorNav';
// import ComingSoon from './pages/comingSoon';
// import '@fortawesome/fontawesome-free/css/all.min.css';

// function App() {
//   const location = useLocation();
//   const isAuthPage = location.pathname === '/authentication';

//   return (
//     <div className="bg-white min-h-screen flex items-center justify-center">
//       <div className="w-full max-w-sm min-h-screen bg-white rounded-lg shadow-lg">
//         <Routes>
//           <Route path="/authentication" element={<AuthPage />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/collector-dashboard" element={<CollectorDashboard />} />
//           <Route path="/contributor-dashboard" element={<ContributorsDashboard />} />
//           <Route path="/" element={<Navigate replace to="/authentication" />} />
//           <Route path="/create-session" element={<CreateSessionPage />} />
//           <Route path="/edit-session/:sessionId" element={<EditSessionPage />} />
//           <Route path="/sessions/:sessionId" element={<SessionDetailsPage />} />
//           <Route path="/sessions" element={<SessionsPage />} />
//           <Route path="/sessions/:sessionId/members" element={<MemberSelectionPage />} />
//           <Route path="/members" element={<MemberSelectionPage />} />
//           <Route path="/coming-soon" element={<ComingSoon />} />
//         </Routes>
//         {!isAuthPage && <CollectorNav />}
//       </div>
//     </div>
//   );
// }

// export default App;








import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/Home';
import AuthPage from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import ContributorsDashboard from './pages/ContributorDashboard';
import CreateSessionPage from './pages/CreateSession';
import EditSessionPage from './pages/EditSession';
import SessionsPage from './pages/Sessions';
import SessionDetailsPage from './pages/SessionDetails';
import MemberSelectionPage from './pages/MemberSelection';
import CollectorNav from './components/CollectorNav';
import ContributorNav from './components/ContributorNav';
import ComingSoon from './pages/comingSoon';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ContributorSessions from './pages/ContributorSessions';
import ContributorSessionDetails from './pages/ContributorSessionDetails';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/authentication';
  const isCollectorPage = location.pathname.startsWith('/collector');
  const isContributorPage = location.pathname.startsWith('/contributor');

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm min-h-screen bg-white rounded-lg shadow-lg">
        <Routes>
          <Route path="/authentication" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/collector-dashboard" element={<CollectorDashboard />} />
          <Route path="/contributor-dashboard" element={<ContributorsDashboard />} />
          <Route path="/" element={<Navigate replace to="/authentication" />} />
          <Route path="/collector-create-session" element={<CreateSessionPage />} />
          <Route path="/collector-edit-session/:sessionId" element={<EditSessionPage />} />
          <Route path="/collector-sessions/:sessionId" element={<SessionDetailsPage />} />
          <Route path="/collector-sessions" element={<SessionsPage />} />
          <Route path="/collector-sessions/:sessionId/members" element={<MemberSelectionPage />} />
          <Route path="/collector-members" element={<MemberSelectionPage />} />
          <Route path="/collector-coming-soon" element={<ComingSoon />} />
          <Route path="/contributor-coming-soon" element={<ComingSoon />} />
          <Route path="/contributor-sessions" element={<ContributorSessions />} />
          <Route path="/contributor-sessions/:sessionId" element={<ContributorSessionDetails />} />

        </Routes>

        {/* Conditionally render the correct navigation */}
        {!isAuthPage && (
          <>
            {isCollectorPage ? <CollectorNav /> : isContributorPage ? <ContributorNav /> : null}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
