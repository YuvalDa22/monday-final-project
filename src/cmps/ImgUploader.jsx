import { useState } from 'react'
import { uploadService } from '../services/upload.service'
import { Box, Button, Typography, CircularProgress } from '@mui/material'

export function ImgUploader({ onUploaded = null }) {
	const [imgData, setImgData] = useState({
		imgUrl: null,
		height: 500,
		width: 500,
	})

	const [isUploading, setIsUploading] = useState(false)

	async function uploadImg(ev) {
		setIsUploading(true)
		const { secure_url, height, width } = await uploadService.uploadImg(ev)
		setImgData({ imgUrl: secure_url, width, height })
		setIsUploading(false)
		onUploaded?.(secure_url)
	}

	function getUploadLabel() {
		if (imgData.imgUrl) return 'Upload Another?'
		return isUploading ? 'Uploading...' : 'Upload Image'
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 4,
				border: '1px solid #ccc',
				borderRadius: 2,
				padding: 2,
				maxWidth: 400,
				margin: 'auto',
			}}>
			{imgData.imgUrl && (
				<Box
					component='img'
					src={imgData.imgUrl}
					alt='Uploaded'
					sx={{ maxWidth: 200, maxHeight: 200, borderRadius: 2 }}
				/>
			)}
			<Typography variant='p' component='div'>
				{getUploadLabel()}
			</Typography>
			<Button
				variant='outlined'
				component='label'
				disabled={isUploading}
				sx={{ textTransform: 'none' }}>
				{isUploading ? <CircularProgress size={20} /> : 'Choose File'}
				<input type='file' onChange={uploadImg} accept='image/*' hidden />
			</Button>
		</Box>
	)
}
