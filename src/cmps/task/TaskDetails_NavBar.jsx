import { useEffect, useState, useRef } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import GridViewIcon from '@mui/icons-material/GridView'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { getSvg } from '../../services/util.service'
import { TabContext, TabPanel } from '@mui/lab'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ListIcon from '@mui/icons-material/List'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { ActivityLog } from './cmps/ActivityLog'
import { getBoardById, getGroupByTaskId, updateBoard } from '../../store/board/board.actions'
import { Updates } from '../Updates'
import { ThreeDotsMenu } from './ThreeDotsMenu'
import { boardService } from '../../services/board'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

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

	useEffect(() => {
		onSetUpdates()
	}, [taskId])

	async function onSetUpdates() {
		try {
			const currentUpdates = board?.groups
				?.find((group) => group.id === groupId)
				?.tasks?.find((task) => task.id === taskId)?.updates
			// Sync updates with board data
			if (currentUpdates) {
				setUpdates(currentUpdates)
			}
		} catch (error) {
			showErrorMsg('Failed to set updates')
			console.error('Error in onSetUpdates:', error)
		}
	}

	const handleAddUpdate = async () => {
		try {
			const update = boardService.getNewUpdate(newComment, user)
			const newUpdates = [...updates, update]
			setUpdates(newUpdates)
			await updateBoard(groupId, taskId, { key: 'updates', value: newUpdates }, { action: 'taskUpdateAdded' })
			showSuccessMsg('Update added successfully')
			setNewComment('')
			setEditNewComment(false)
		} catch (error) {
			showErrorMsg('Failed to add update')
			console.error('Failed to add update:', error)
		}
	}

	useEffect(() => {
		onLoadBoard()
	}, [updates])

	  useEffect(() => {
		const handleClickOutside = (event) => {
		  if (quillRef.current && !quillRef.current.contains(event.target)) {
			setEditNewComment(false);
		  }
		};
	
		if (editNewComment) {
		  document.addEventListener("mousedown", handleClickOutside);
		}
	
		return () => {
		  document.removeEventListener("mousedown", handleClickOutside);
		};
	  }, [editNewComment]);

	async function onLoadBoard() {
		try {
			await getBoardById(board._id)
		} catch (error) {
			showErrorMsg('Cannot load boards')
			console.error(error)
		}
	}

	// Handle tab change
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	// // Handle adding new tabs
	// const handleAddTab = () => {
	// 	setTabs((prev) => {
	// 		const nextValue = prev.length + 1
	// 		const nextLabel = `Item ${prev.length + 1}`
	// 		return [...prev, { value: nextValue, label: nextLabel }]
	// 	})
	// }

	return (
		<TabContext value={value} 				>

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
							onChange={setNewComment}
							theme='snow'
							modules={{
								toolbar: [
									[{ size: ['small', false, 'large', 'huge'] }],
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
								'size',
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
							onClick={() => newComment.length ? handleAddUpdate() : {}}>
							Update
						</Button>
					</div>
				) : (
					<div
						className='create-comment-blur'
						onClick={() => setEditNewComment(true)}>
						<p className='placeholder'>Write an update</p>
					</div>
				)}
				<Updates updates={updates} />
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
				<ActivityLog taskId={taskId} />
			</TabPanel>
		</TabContext>
	)
}
