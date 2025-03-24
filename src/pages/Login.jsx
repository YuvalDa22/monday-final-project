import { useNavigate } from 'react-router'
import { login } from '../store/user/user.actions'
import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { AppHeader } from '../cmps/layout/AppHeader'
import { Link } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { LoadingSpinner } from '../cmps/LoadingSpinner'
import { useSelector } from 'react-redux'

export function Login() {
	const [credentials, setCredentials] = useState({ username: '', password: '' })
	const isLoading = useSelector((state) => state.boardModule.isLoading)
	const navigate = useNavigate()

	function handleChange(event) {
		const { name, value } = event.target
		setCredentials((prevUser) => ({
			...prevUser,
			[name]: value,
		}))
	}

	async function handleLogIn(e = null) {
		if (e) e.preventDefault()

		if (!credentials.username || !credentials.password) {
			showErrorMsg('Please fill in all fields')
			return
		}

		try {
			await login(credentials)
			navigate('/workspace')
			showSuccessMsg('Logged in successfully')
		} catch (err) {
			console.log('Error:', err);
			showErrorMsg(err.response.data.err || err.message || 'Invalid credentials')
		}
	}

	return (
		<div className='login-page'>
			<AppHeader />
			{isLoading ? <LoadingSpinner /> : (
			<div className='container'>
				<h1>Log into your account!</h1>
				<form className='login-form' onSubmit={handleLogIn}>
					<span className='login-form-text'>Your username</span>
					<TextField
					
						label='Username'
						variant='outlined'
						name='username'
						onChange={handleChange}
						fullWidth
					/>
					<div className='form-section'>
					<span className='login-form-text'>Enter your password</span>
						<TextField
							label='Password'
							variant='outlined'
							type='password'
							name='password'
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<Button 
					type='submit' 
					variant='contained' 
					fullWidth
					sx={{ textTransform: 'none', width:'100% !important' , color: '#ffffff',
						 backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#0060b9' } }}
					
					>
						Log in
					</Button>
				</form>
				<div>
					<p className='signup-link'>
						Don't have an account? <Link to={'/signup'}>Sign up</Link>
					</p>
				</div>
			</div>
			)}
		</div>
	)
}
