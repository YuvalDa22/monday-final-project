import { useEffect, useState, useRef } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import GridViewIcon from '@mui/icons-material/GridView'
import Button from '@mui/material/Button'
import { debounce, getSvg, utilService } from '../../services/util.service'
import { TabContext, TabPanel } from '@mui/lab'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ListIcon from '@mui/icons-material/List'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { ActivityLog } from './cmps/ActivityLog'
import { getBoardById, getGroupById, getTaskById, updateBoard } from '../../store/board/board.actions'
import { boardService } from '../../services/board'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { socketService } from '../../services/socket.service'
import { LoadingSpinner } from '../LoadingSpinner'

const SvgIcon = ({ iconName, options }) => {
	return (
		<i
			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
			style={{
				display: 'flex',
				opacity: 0.75,
				height: 17,
				width: 17,
				alignItems: 'center',
			}}></i>
	)
}

//TODO - ADD CRUD FOR UPDATES
//TODO - ADD CRUD FOR REPLIES

export function TaskDetails_NavBar({ taskId, board, user, groupId }) {
	const [value, setValue] = useState('1')
	const [updates, setUpdates] = useState(null)
	const [tabs, setTabs] = useState([
		{ value: '1', label: 'Updates' },
		{ value: '2', label: 'Files' },
		{ value: '3', label: 'Activity Log' },
	])
	// For the comments in 'Update' tab
	const [newComment, setNewComment] = useState('')
	const [editNewComment, setEditNewComment] = useState(false)
	const quillRef = useRef(null)
	const [newReplies, setNewReplies] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		onSetUpdates()
	}, [taskId])

	async function onSetUpdates() {
		const task = getTaskById(taskId)
		try {
			const currentUpdates = task?.updates
			// Sync updates with board data
			if (currentUpdates) {
				setUpdates(currentUpdates)
			}
		} catch (error) {
			showErrorMsg('Failed to set updates')
			console.error('Error in onSetUpdates:', error)
		}
	}

	useEffect(() => {
		if (taskId) {
			socketService.emit('join-task', taskId)
		}

		socketService.on('update-added', (newUpdates) => {
			setUpdates(newUpdates)
		})

		socketService.on('reply-added', (newUpdates) => {
			setUpdates(newUpdates)
		})

		return () => {
			socketService.emit('leave-task', taskId)
			socketService.off('update-added')
			socketService.off('reply-added')
		}
	}, [taskId])

	const handleAddUpdate = async () => {
		setNewComment('')
		setEditNewComment(false)
		try {
			const update = await boardService.createNewUpdate(newComment, user)
			const updatedUpdates = [update, ...updates]
			setUpdates(updatedUpdates)
			await updateBoard(
				groupId,
				taskId,
				{ key: 'updates', value: updatedUpdates },
				{ action: 'taskUpdateAdded' }
			)
			socketService.emit('add-update', { taskId, updates: updatedUpdates })
			showSuccessMsg('Update added successfully')
		} catch (error) {
			console.log('Failed to add update:', error)
			showErrorMsg('Failed to add update')
		}
	}

	// useEffect(() => {
	// 	onLoadBoard()
	// }, [updates])

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (quillRef.current && !quillRef.current.contains(event.target)) setEditNewComment(false)
		}
		if (editNewComment) document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [editNewComment])

	// async function onLoadBoard() {
	// 	try {
	// 		await getBoardById(board._id)
	// 	} catch (error) {
	// 		showErrorMsg('Cannot load boards')
	// 		console.error(error)
	// 	}
	// }

	// useEffect(() => {
	// 	if (updates) {
	// 		updateBoardData()
	// 	}
	// }, [updates])

	// async function updateBoardData() {
	// 	try {
	// 		await updateBoard(
	// 			groupId,
	// 			taskId,
	// 			{ key: 'updates', value: updates },
	// 			{ action: 'taskUpdateModified' }
	// 		)
	// 		showSuccessMsg('Board updated successfully')
	// 	} catch (error) {
	// 		showErrorMsg('Failed to update board')
	// 		console.error('Error in updateBoardData:', error)
	// 	}
	// }

	useEffect(() => {
		// Updated click-out for replies using DOM query similar to comment click-out
		const handleClickOutsideReply = (event) => {
			setNewReplies((prevReplies) =>
				prevReplies.map((reply) => {
					if (reply.isEditing) {
						const replyElement = document.querySelector(`[data-reply-id="${reply.id}"]`)
						if (replyElement && !replyElement.contains(event.target)) {
							return { ...reply, isEditing: false }
						}
					}
					return reply
				})
			)
		}
		if (newReplies.some((reply) => reply.isEditing)) {
			document.addEventListener('mousedown', handleClickOutsideReply)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutsideReply)
		}
	}, [newReplies])

	useEffect(() => {
		// Update the `ref` for replies after rendering
		newReplies.forEach((reply) => {
			if (reply.isEditing && !reply.ref) {
				reply.ref = document.querySelector(`[data-reply-id="${reply.id}"]`)
			}
		})
	}, [newReplies])

	function handleNewReplyToEdit(commentId) {
		if (!newReplies.find((reply) => reply.id === commentId)) {
			setNewReplies((prevReplies) => [
				...prevReplies,
				{ id: commentId, text: '', isEditing: true, ref: null },
			])
		} else {
			setNewReplies((prevReplies) =>
				prevReplies.map((reply) => (reply.id === commentId ? { ...reply, isEditing: true } : reply))
			)
		}
	}

	// Handle tab change
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	function findNewReplyByComment(comment) {
		return newReplies.find((newReply) => newReply.id === comment.id) // Match by comment.id
	}

	function handleReplyChange(event, commentId) {
		const replyText = event
		setNewReplies((prevReplies) =>
			prevReplies.map((reply) => (reply.id === commentId ? { ...reply, text: replyText } : reply))
		)
	}

	function resetReplyState(commentId) {
		setNewReplies((prevReplies) =>
			prevReplies.map((reply) =>
				reply.id === commentId ? { ...reply, text: '', isEditing: false } : reply
			)
		)
	}

	function handleReplySubmit(event, commentId) {
		event.preventDefault()
		const replyText = newReplies.find((reply) => reply.id === commentId)?.text || ''
		if (replyText.length === 0) return
		const updatedUpdates = updates.map((comment) =>
			comment.id === commentId
				? {
						...comment,
						replies: [
							...comment.replies,
							{
								id: utilService.makeId(),
								text: replyText,
								replier: { id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
								createdAt: Date.now(),
							},
						],
				  }
				: comment
		)
		setUpdates(updatedUpdates)
		updateBoard(
			groupId,
			taskId,
			{ key: 'updates', value: updatedUpdates },
			{ action: 'taskReplyAdded' }
		)
		resetReplyState(commentId)

		socketService.emit('add-reply', { taskId, updates: updatedUpdates })
	}

	function handleNewReplyToEdit(commentId) {
		if (!newReplies.find((reply) => reply.id === commentId)) {
			setNewReplies((prevReplies) => [...prevReplies, { id: commentId, text: '', isEditing: true }])
		} else {
			setNewReplies((prevReplies) =>
				prevReplies.map((reply) => (reply.id === commentId ? { ...reply, isEditing: true } : reply))
			)
		}
	}

	return (
		<TabContext value={value}>
			<Tabs
				value={value}
				onChange={handleChange}
				aria-label='tabs'
				variant='scrollable'
				sx={{
					borderBottom: '1px solid rgb(174, 174, 174)',
				}}>
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						value={tab.value}
						sx={{
							opacity: 0.8,
							textTransform: 'none',
							padding: '0 12px',
							'&:hover': {
								backgroundColor: '#eaeefb',
								borderRadius: '5px',
							},
						}}
						label={
							<Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
								{/* the icon for the first tab */}
								{tab.value === '1' && <SvgIcon iconName={'sidebar_home'} />}
								{tab.label}
								{/* show menu if tab selected */}
								{value === tab.value}
							</Box>
						}
					/>
				))}
			</Tabs>

			<TabPanel value='1' className='updates-tab'>
				{/* ReactQuill Editor */}
				{editNewComment ? (
					<div className='create-comment' ref={quillRef}>
						<ReactQuill
							className='create-comment-editor'
							value={newComment}
							onChange={debounce(setNewComment, 200)}
							theme='snow'
							modules={{
								toolbar: [
									[{ header: [1, 2, 3, false] }], // Headers
									['bold'],
									['italic'],
									['underline'],
									['strike'],
									[{ color: [] }],
									[{ list: 'ordered' }],
									[{ list: 'bullet' }],
									['link'],
									[{ align: [] }],
									[{ direction: 'rtl' }],
								],
							}}
							formats={[
								'header',
								'bold',
								'italic',
								'underline',
								'strike',
								'color',
								'list',
								'bullet',
								'link',
								'align',
								'direction',
							]}
						/>
						<Button
							variant='contained'
							color='primary'
							className='create-comment-btn'
							sx={{ textTransform: 'none', marginTop: '10px', padding: '5px 10px' }}
							onClick={() => (newComment.length ? handleAddUpdate() : {})}>
							Update
						</Button>
					</div>
				) : (
					<div className='create-comment-blur' onClick={() => setEditNewComment(true)}>
						<p className='placeholder'>Write an update</p>
					</div>
				)}

				{/* Render Updates */}

				{loading || !updates ? (
					<LoadingSpinner />
				) : updates.length ? (
					<div className='chat-body'>
						<div className='chat-inner-body'>
							<ul className='comments-list'>
								{updates?.map((update) => (
									<li key={update.id || update.createdAt} className='comment'>
										<div className='comment-info'>
											<img
												src={update.commenter?.imgUrl || 'https://via.placeholder.com/40'}
												alt={update.commenter?.fullname || 'Unknown User'}
											/>
											<p className='fullname'>{update.commenter?.fullname || 'Unknown User'}</p>
											<p className='time'>{utilService.calcTimePassed(update)}</p>
										</div>
										<p className='comment-text'>
											<span dangerouslySetInnerHTML={{ __html: update.text }} />
										</p>
										<div className='replies-section'>
											<ul className='replies-list'>
												{update.replies.map((reply) => (
													<li key={reply.id || reply.createdAt} className='reply'>
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
											<div className='create-reply-container'>
												<img src={user.imgUrl} alt={user.fullname} />
												{findNewReplyByComment(update)?.isEditing ? (
													<form
														className='create-reply'
														onSubmit={(event) => handleReplySubmit(event, update.id)}
														data-reply-id={update.id}>
														<ReactQuill
															className='textarea-quill'
															value={findNewReplyByComment(update)?.text}
															onChange={debounce(
																(event) => handleReplyChange(event, update.id),
																200
															)}
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
														<p className='placeholder'>Write a reply</p>
													</div>
												)}
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				) : (
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
				)}
			</TabPanel>

			<TabPanel value='2'>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							marginBottom: '24px',
						}}>
						<Button
							variant='outlined'
							startIcon={<AddIcon />}
							sx={{
								color: 'black',
								textTransform: 'none',
								fontSize: '14px',
								borderColor: 'rgb(193, 193, 193)',
							}}>
							Add file
						</Button>
						<TextField
							variant='outlined'
							size='small'
							placeholder='Search for files'
							sx={{
								width: '220px',
							}}
						/>
						<Box>
							<IconButton>
								<GridViewIcon />
							</IconButton>
							<IconButton>
								<ListIcon />
							</IconButton>
							<IconButton>
								<FileDownloadOutlinedIcon />
							</IconButton>
						</Box>
					</Box>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '16px',
							marginBottom: '24px',
						}}>
						<Box
							sx={{
								width: '300px',
								height: '200px',
								marginTop: 15,
								backgroundImage:
									'url("https://cdn.monday.com/images/files-gallery/empty-state-v2.svg")',
								backgroundSize: 'cover',
							}}
						/>
						<Typography variant='h7' fontWeight='bold'>
							Drag & drop or add files here
						</Typography>
						<Typography variant='h7' color='gray' sx={{ fontSize: 13 }}>
							Upload, comment and review all files in this item to easily collaborate in context
						</Typography>
					</Box>
					<Button
						variant='contained'
						sx={{
							textTransform: 'none',
							fontSize: '15px',
							padding: '6px 16px',
						}}>
						+ Add file
					</Button>
				</Box>
			</TabPanel>
			<TabPanel value='3'>
				<ActivityLog taskId={taskId} user={user} />
			</TabPanel>
		</TabContext>
	)
}
