import { useEffect, useState } from 'react'
import { debounce, utilService } from '../services/util.service'
import { Box, Typography } from '@mui/material'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export function Updates({
	updates,
	user,
	findNewReplyByComment,
	handleReplyChange,
	handleReplySubmit,
	handleNewReplyToEdit,
}) {
	const [loading, setLoading] = useState(true)

	// Handle loading state based on updates
	useEffect(() => {
		setLoading(!updates)
	}, [updates])

	// Render loading state
	if (loading) return <div>Loading...</div>

	// Render empty state
	if (!updates?.length)
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

	// Render updates and replies
	return (
		<div className='chat-body'>
			<div className='chat-inner-body'>
				<ul className='comments-list'>
					{updates.map((update) => (
						<li key={update.id || update.createdAt} className='comment'>
							{/* Comment Info */}
							<div className='comment-info'>
								<img
									src={update.commenter?.imgUrl || 'https://via.placeholder.com/40'}
									alt={update.commenter?.fullname || 'Unknown User'}
								/>
								<p className='fullname'>{update.commenter?.fullname || 'Unknown User'}</p>
								<p className='time'>{utilService.calcTimePassed(update)}</p>
							</div>

							{/* Comment Text */}
							<p className='comment-text'>
								<span dangerouslySetInnerHTML={{ __html: update.text }} />
							</p>

							{/* Replies Section */}
							<div className='replies-section'>
								<ul className='replies-list'>
									{update.replies.map((reply) => (
										<li key={reply.id || reply.createdAt} className='reply'>
											{/* Reply Info */}
											<img
												src={reply.replier?.imgUrl || 'https://via.placeholder.com/30'}
												alt={reply.replier?.fullname || 'Unknown User'}
											/>
											<div className='reply-content-container'>
												<div className='reply-content'>
													<p className='reply-fullname'>
														{reply.replier?.fullname || 'Unknown User'}
													</p>
													<div className='reply-text'>
														<span dangerouslySetInnerHTML={{ __html: reply.text }} />
													</div>
												</div>
												<p className='reply-time'>{utilService.calcTimePassed(reply)}</p>
											</div>
										</li>
									))}
								</ul>

								{/* Create New Reply */}
								<div className='create-reply-container'>
									<img src={user.imgUrl} alt={user.fullname} />
									{findNewReplyByComment(update)?.isEditing ? (
										<form
											className='create-reply'
											onSubmit={(event) => handleReplySubmit(event, update.id)}>
											<ReactQuill
												className='textarea-quill'
												value={findNewReplyByComment(update)?.text}
												onChange={debounce((event) => handleReplyChange(event, update.id), 400)}
												modules={{
													toolbar: [
														[{ header: [1, 2, 3, false] }],
														['bold'],
														['italic'],
														['underline'],
														[{ list: 'ordered' }], 
														[{ list: 'bullet' }],
													],
												}}
											/>
											<button className='reply-button' type='submit'>
												Reply
											</button>
										</form>
									) : (
										<div
											className='create-reply-blur'
											onClick={() => handleNewReplyToEdit(update.id)}>
											<p className='placeholder'>Write a reply and mention others with @</p>
										</div>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
