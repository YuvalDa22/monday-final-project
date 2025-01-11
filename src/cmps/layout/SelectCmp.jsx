import React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material"

export function SelectCmp({label, value, options, onChange, fullWidth = true}){
    return (
        <FormControl fullWidth={fullWidth}>
            <InputLabel>{label}</InputLabel>
            <Select
            value = {value || ''}
            onChange={(event)=>onChange(event.target.value)}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}