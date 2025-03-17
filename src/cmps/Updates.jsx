import { useEffect, useState } from 'react'
import { userService } from '../services/user'
import { utilService } from '../services/util.service'
import { Box, Typography } from '@mui/material'

export function Updates({ updates }) {
	const [comments, setComments] = useState([])
	const [loading, setLoading] = useState(true) // Add loading state

	useEffect(() => {
		fetchCommenters()
	}, [updates])

	async function fetchCommenters() {
		if (!updates) {
			setLoading(false) // Stop loading if no updates
			return
		}
		setLoading(true) // Start loading
		const fetchedComments = []
		for (const update of updates) {
			const commenter = await userService.getById(update.userId)
			console.log("🚀 ~ fetchCommenters ~ commenter:", commenter)
			const createdAt = utilService.formatDate(update.sentAt)
			fetchedComments.push({ ...update, commenter, createdAt })
		}
		setComments(fetchedComments)
		setLoading(false) // Stop loading after fetching
	}

	if (loading) return <div>Loading...</div> // Show loading indicator
	if (!comments.length)
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: '8px',
					marginBottom: '24px',
				}}>
				<Box
					sx={{
						width: '182px',
						height: '182px',
						marginTop: '50px',
						backgroundImage:
							'url("https://res.cloudinary.com/ofirgady/image/upload/v1742132681/x6wvtx7vvc4xrhiqr4fr.svg")',
						backgroundSize: 'cover',
					}}
				/>
				<Typography variant='h6' fontWeight='bold'>
					No updates yet
				</Typography>
				<Typography
					variant='h7'
					color='#303030'
					sx={{ fontSize: 16, textAlign: 'center', whiteSpace: 'pre-line' }}>
					{`Share progress, mention a teammate,\n or upload a file to get things moving`}
				</Typography>
			</Box>
		)
	return (
		<div className='chat-body'>
			<div className='chat-inner-body'>
				{/* Comment List */}
				<ul className='comments-list'>
					{comments.map((comment) => (
						<li key={comment.sentAt} className='comment'>
							<div className='comment-info'>
								<img src={comment.commenter.imgUrl} alt={comment.commenter.fullName} />
								<p className='fullname'>{comment.commenter.fullName}</p>
								<p className='time'>{comment.createdAt}</p>
							</div>
							<div className='comment-text'>
								{Array.isArray(comment.text) ? (
									comment.text.map((item, idx) => <React.Fragment key={idx}>{item}</React.Fragment>)
								) : (
									<span dangerouslySetInnerHTML={{ __html: comment.text }} />
								)}
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
