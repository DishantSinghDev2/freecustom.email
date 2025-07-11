// components/DITMailPopup.tsx

'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoClose } from 'react-icons/io5';
import { NotifyModal } from './NotifyModal'; // Import the new modal

export function DITMailPopup() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false); // State for the new modal

  useEffect(() => {
    const popupDismissed = localStorage.getItem('ditmailPopupDismissed');
    if (!popupDismissed) {
      const timer = setTimeout(() => {
        setIsPopupVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissPopup = () => {
    setIsPopupVisible(false);
    localStorage.setItem('ditmailPopupDismissed', 'true');
  };

  const handleOpenNotifyModal = () => {
    setIsNotifyModalOpen(true);
    // We can also dismiss the small popup once they've engaged with the notify button
    handleDismissPopup();
  };

  if (!isPopupVisible && !isNotifyModalOpen) {
    return null;
  }

  return (
    <>
      {/* The original floating popup */}
      {isPopupVisible && (
        <div className="fixed bottom-5 right-5 z-40 p-5 max-w-xs sm:max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-out animate-slide-in-up">
          <button
            onClick={handleDismissPopup}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Dismiss"
          >
            <IoClose size={24} />
          </button>

          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              The Next Level is Coming...
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Introducing <span className="font-semibold text-blue-600 dark:text-blue-400">DITMail</span> — professional email on your own domain. Get ready for our official launch!
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleOpenNotifyModal} // This now opens the new modal
                className="w-full sm:w-auto flex-grow px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
              >
                Notify Me When It Launches!
              </button>
              
              <Link title='Learn more about DITMail' href="/blog/introducing-ditmail" className="w-full sm:w-auto px-4 py-2 text-sm text-center font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Read More
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* The new modal for entering email */}
      {isNotifyModalOpen && <NotifyModal onClose={() => setIsNotifyModalOpen(false)} />}
    </>
  );
}