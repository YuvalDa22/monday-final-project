import { AppHeader } from '../cmps/layout/AppHeader'
import { useNavigate } from 'react-router-dom'
export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className='home-page'>
      <AppHeader />

      <div className='hero-layout'>
        <div className='hero'>
          <h1>A platform for company tasks managment</h1>
        </div>
        <div>
          <button className='hero-btn' onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </div>
      <div className='hero-img-container'>
        <img
          className='hero-img'
          src='https://res.cloudinary.com/dv5xfztht/image/upload/v1742657854/Screenshot_2025-03-22_at_17.37.04_ff5vcd.png'
          alt='Hero'
        />
      </div>
    </div>
  )
}
