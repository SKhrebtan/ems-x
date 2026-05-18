'use client'
import { useEffect, useState, type ChangeEvent } from 'react'
import { useController, type Control } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import type { EventFormValues } from './event-form.types'

interface NumericInputProps {
	control: Control<EventFormValues>
	name: 'latitude' | 'longitude'
	label: string
	helperText?: string
	errorMessage?: string
}

const numberToText = (v: unknown,): string => {
	if (typeof v === 'number' && Number.isFinite(v,)) return String(v,)
	return ''
}

export const NumericInput = ({
	control,
	name,
	label,
	helperText,
	errorMessage,
}: NumericInputProps,) => {
	const { field, } = useController({ control, name, },)
	const [text, setText,] = useState<string>(() => numberToText(field.value,),)

	useEffect(() => {
		const fv = field.value
		if (typeof fv === 'number' && Number.isFinite(fv,)) {
			const parsed = Number(text.replace(',', '.',),)
			if (!Number.isFinite(parsed,) || Math.abs(parsed - fv,) > 1e-9) {
				setText(String(fv,),)
			}
		}
		else if (fv == null && text !== '') {
			setText('',)
		}
	}, [field.value, text,],)

	const handleChange = (e: ChangeEvent<HTMLInputElement>,) => {
		const raw = e.target.value
		setText(raw,)
		const normalized = raw.replace(',', '.',).trim()
		if (normalized === '' || normalized === '-' || normalized === '.') {
			field.onChange(undefined,)
			return
		}
		const num = Number(normalized,)
		field.onChange(Number.isFinite(num,) ? num : undefined,)
	}

	return (
		<TextField
			label={label}
			value={text}
			onChange={handleChange}
			error={Boolean(errorMessage,)}
			helperText={errorMessage ?? helperText}
		/>
	)
}
