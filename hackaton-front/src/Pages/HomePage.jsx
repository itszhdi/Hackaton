import React from 'react'
import Header from '../Components/Header/Header'
import Recent from '../Components/RecentAims/Recent'
import WelcomeHero from '../Components/Welcome/Welcome'

export default function HomePage() {
  return (
    <div>
      <WelcomeHero />
      <Header />
      <Recent />
    </div>
  )
}
