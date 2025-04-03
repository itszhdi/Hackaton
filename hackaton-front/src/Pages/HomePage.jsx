import React, { useEffect, useState } from 'react';
import Header from '../Components/Header/Header';
import Recent from '../Components/RecentAims/Recent';
import WelcomeHero from '../Components/Welcome/Welcome';

export default function HomePage({ setShowLogin, isAuthenticated }) {

  return (
    <div>
      {isAuthenticated ? (
        <>
          <WelcomeHero setShowLogin={setShowLogin} isAuthenticated={isAuthenticated} />
          <Header />
          <Recent />
        </>
      ) : (
        <WelcomeHero setShowLogin={setShowLogin} isAuthenticated={isAuthenticated} />
      )}
    </div>
  );
}