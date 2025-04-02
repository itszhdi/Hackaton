import React from 'react'
import Header from '../Components/Header/Header'
import Recent from '../Components/RecentActions/Recent'
import BudgetHeader from '../Components/BudgetHeader/BudgetHeader'

export default function HomePage() {
  return (
    <div>
      <Header />
      <BudgetHeader />
      <Recent />
    </div>
  )
}
