'use client'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

interface DeleteConfirmDialogProps {
	open: boolean
	title: string
	description?: string
	loading?: boolean
	onConfirm: () => void
	onCancel: () => void
}

export const DeleteConfirmDialog = ({
	open,
	title,
	description,
	loading,
	onConfirm,
	onCancel,
}: DeleteConfirmDialogProps,) => {
	return (
		<Dialog open={open} onClose={onCancel} maxWidth='xs' fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{description ?? 'This action cannot be undone.'}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} disabled={loading}>Cancel</Button>
				<Button onClick={onConfirm} color='error' variant='contained' disabled={loading}>
					{loading ? 'Deleting…' : 'Delete'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}
