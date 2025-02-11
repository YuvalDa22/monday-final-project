import React, { useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import { getSvg } from '../../../services/util.service'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'

const SvgIcon = ({ iconName, options, className }) => {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      className={`svg-icon ${className || ''}`}
    ></i>
  )
}

export function MemberPicker({ info, onUpdate, board }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Extract selected members for the dropdown
  const selectedMembers = info
    ?.map((memberId) => {
      const member = board?.members?.find((member) => member._id === memberId)
      return member ? { value: member._id, label: member.fullname } : null
    })
    .filter(Boolean)

  const handleChange = (selected) => {
    const selectedIds = selected.map((option) => option.value)
    onUpdate({ id: selectedIds, title: selectedIds })
  }

  const renderAvatars = () => (
    <AvatarGroup
      max={3}
      spacing={10}
      sx={{
        '& .MuiAvatar-root': {
          fontSize: '14px',
          width: 32,
          height: 32,
        },
      }}
    >
      {info?.map((memberId) => {
        const member = board?.members?.find((m) => m._id === memberId)
        if (!member) return null
        return (
          <Avatar
            className='member-avatar'
            key={member._id}
            alt={member.fullname}
            src={member.imgUrl}
            sx={{ width: 32, height: 32 }}
          />
        )
      })}
    </AvatarGroup>
  )

  const groupedOptions = [
    {
      label: 'Team Members',
      options:
        board?.members?.map((member) => ({
          value: member._id,
          label: (
            <div className='member-option'>
              <img className='member-option-img' src={member.imgUrl} alt={member.fullname} />
              {member.fullname}
            </div>
          ),
        })) || [],
    },
  ]

  const customComponents = {
    // Customize Group rendering
    Group: (props) => (
      <div className='custom-group'>
        <div className='group-heading'>{props.children}</div>
      </div>
    ),
    // Customize Menu rendering
    Menu: (props) => <div className='custom-menu'>{props.children}</div>,
    // Customize MenuList for additional wrapping styles
    MenuList: (props) => <div className='custom-menu-list'>{props.children}</div>,
    // Customize individual option rendering
    Option: (props) => (
      <div {...props.innerRef} {...props.innerProps} className='custom-option'>
        {props.data.label}
      </div>
    ),
    MultiValueContainer: (props) => (
      <div className='member-selected-name-container'>{props.children}</div>
    ),
    ClearIndicator: null,
    DropdownIndicator: null,
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div className='member-picker' ref={dropdownRef}>
      <div className='member-avatars' onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {info?.length > 0 ? (
          renderAvatars()
        ) : (
          <img
            src='https://cdn.monday.com/icons/dapulse-person-column.svg'
            className='member-NO-avatar'
            title=''
            alt=''
            aria-hidden='true'
          />
        )}
      </div>

      {isDropdownOpen && (
        <div className='dropdown-container'>
          <Select
            options={groupedOptions}
            isMulti
            value={selectedMembers}
            onChange={handleChange}
            menuIsOpen={true}
            onMenuClose={() => setIsDropdownOpen(false)}
            components={customComponents}
            styles={{
              control: (base) => ({
                ...base,
                border: 'none',
                boxShadow: 'none',
                marginBottom: '1em',
              }),
              menu: (base) => ({
                ...base,
              }),
              menuList: (base) => ({
                ...base,
                padding: '0',
              }),
            }}
          />
        </div>
      )}
    </div>
  )
}
