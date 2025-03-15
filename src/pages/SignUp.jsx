import { useNavigate } from 'react-router'
import { signup } from '../store/user/user.actions'
import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { AppHeader } from '../cmps/layout/AppHeader'
import { Link } from 'react-router-dom'
import { TextField, Button } from '@mui/material'
import { ImgUploader } from '../cmps/ImgUploader'

export function SignUp() {
	const [credentials, setCredentials] = useState({})
	const navigate = useNavigate()

	function handleChange(event) {
		const { name, value } = event.target
		setCredentials((prevUser) => ({
			...prevUser,
			[name]: value,
		}))
	}

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', email: '', imgUrl: '' })
    }

	async function handleSignup(e) {
		e.preventDefault()

		try {
			await signup(credentials)
            clearState()
			showSuccessMsg('Account created successfully')
			navigate('/workspace')
		} catch (err) {
			showErrorMsg('Something went wrong')
			console.error(err)
		}
	}

	function onUploaded(imgUrl) {
		setCredentials((prevUser) => ({ ...prevUser, imgUrl }))
	}

	return (
		<div className='signup-page'>
			<AppHeader />
			<div className='container'>
				<h1>Sign Up Now!</h1>
				<form className='login-form' onSubmit={handleSignup}>
                    <TextField
                        label='Full Name'
                        variant='outlined'
                        name='fullname'
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
						label='Username'
						variant='outlined'
						name='username'
						onChange={handleChange}
						fullWidth
                        required
					/>
					<TextField
						label='Email Address'
						variant='outlined'
						name='email'
                        type='email'
						onChange={handleChange}
						fullWidth
                        required
					/>
					<TextField
						label='Password'
						variant='outlined'
						type='password'
						name='password'
						onChange={handleChange}
						fullWidth
                        required
					/>
                    <TextField
						label='Role'
						variant='outlined'
						type='text'
						name='role'
						onChange={handleChange}
						fullWidth
                
					/>
					<ImgUploader onUploaded={onUploaded} />
					<Button type='submit' variant='contained' color='primary' fullWidth>
						Sign Up
					</Button>
				</form>
				<div>
					<p>
						Already have an account? <Link to={'/login'}>Log In</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
