import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import BottomNavigation from '../BottomNavigation';

const Dashboard = () => {
  // Sample data for the payments
  const totalContributions = 400000;
  const remainingPayments = 100000;
  const percentagePaymentsMade = ((totalContributions - remainingPayments) / totalContributions) * 100;

  return (
    <div className="animate-slide-in flex flex-col min-h-screen bg-purple-50">
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center space-x-2">
            {/* Ajo Session Overview */}
            <div className="flex flex-col">
              <p className="text-gray-700 text-sm">Your Total Contribution</p>
              <p className="font-bold text-lg">₦250,000</p>
              <p className="text-xs text-gray-500">Across 5 sessions</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 text-purple-600 text-xs font-semibold py-1 px-3 rounded-full flex flex-col items-center mb-4">
              <span className="text-sm">Upcoming Pay</span>
              <span className="text-xs font-normal">₦20,800</span>
            </div>
          </div>
        </div>

        {/* Payment History Card */}
        <div className=" bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 mt-4 shadow-md">
          <h2 className="text-white text-lg font-semibold">HISTORY</h2>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <CircularProgressbar
                  value={percentagePaymentsMade}
                  text={`${percentagePaymentsMade.toFixed(0)}%`}
                  strokeWidth={8}
                  styles={{
                    path: {
                      stroke: '#fff',
                      strokeWidth: 8,
                    },
                    trail: {
                      stroke: 'rgba(255, 255, 255, 0.3)',
                      strokeWidth: 8,
                    },
                    text: {
                      fill: '#fff',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </div>
            </div>
            <div className="text-white">
              <p className="text-sm">TOTAL CONTRIBUTIONS</p>
              <p className="font-bold text-lg mb-3">₦{totalContributions.toLocaleString()}</p>
              <p className="text-sm">REMAINING PAYMENTS</p>
              <p className="font-bold text-lg">₦{remainingPayments.toLocaleString()}</p>
            </div>
          </div>
          <div className="text-right mt-4">
            <button className="text-white underline text-sm">View all</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around mt-4 text-gray-700">
          <button className="text-purple-600 border-b-2 border-purple-600 pb-2">Sessions</button>
          <button>Goals</button>
          <button>Members</button>
        </div>

        {/* Graph Section */}
        <div className="bg-white rounded-2xl p-4 mt-4 shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Contribution Progress</h3>
            <p className="text-sm text-gray-500">Weekly</p>
          </div>
          <div className="mt-4">
            <svg className="w-full h-32">
              <polyline
                fill="none"
                stroke="#7E3AF2"
                strokeWidth="3"
                points="10,30 60,20 100,40 150,10 200,30 240,50 290,20"
              />
            </svg>
          </div>
        </div>

        {/* Stats Widgets */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Total Collected */}
          <div className="bg-purple-600 rounded-2xl p-4 text-white shadow-md">
            <p className="text-sm">Total Collected</p>
            <p className="text-2xl font-bold mt-2">₦500,000</p>
            <p className="text-sm mt-1">This Week</p>
          </div>

          {/* Active Sessions */}
          <div className="bg-orange-500 rounded-2xl p-4 text-white shadow-md">
            <p className="text-sm">Active Sessions</p>
            <p className="text-2xl font-bold mt-2">10</p>
            <p className="text-sm mt-1">Running</p>
          </div>

          {/* Average Contribution */}
          <div className="bg-blue-500 rounded-2xl p-4 text-white shadow-md col-span-2">
            <p className="text-sm">Average Weekly Contribution</p>
            <p className="text-2xl font-bold mt-2">₦20,000</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
