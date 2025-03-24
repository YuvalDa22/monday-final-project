import { useNavigate } from 'react-router'

import { Link } from 'react-router-dom'

export function AppHeader() {
  const navigate = useNavigate()
  return (
    <div className='header-flex'>
      <div>
        <img
          onClick={() => navigate('/')}
          src='https://res.cloudinary.com/ofirgady/image/upload/v1742651944/nkafdc4fmxgpx3ysvx3r.png'
          alt='logo'
        />
        <h2>Tomorrow</h2>
      </div>
      <div>
        <button onClick={() => navigate('/login')}>Log in</button>
        {/* <button>Start Demo</button> */}
      </div>
    </div>
  )
}
