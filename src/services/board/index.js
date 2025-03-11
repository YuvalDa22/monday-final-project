const { DEV, VITE_LOCAL } = import.meta.env

import { utilService } from '../util.service'
import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

const groupColors = new Map([
  ['red', '#bb3354'],
  ['green', '#037f4c'],
  ['lightGreen', '#00c875'],
  ['lime', '#9cd326'],
  ['yellow', '#cab641'],
  ['gold', '#ffcb00'],
  ['purple', '#784bd1'],
  ['violet', '#9d50dd'],
  ['blue', '#007eb5'],
  ['lightBlue', '#579bfc'],
  ['skyBlue', '#66ccff'],
  ['pink', '#df2f4a'],
  ['hotPink', '#ff007f'],
  ['lightPink', '#ff5ac4'],
  ['orange', '#ff642e'],
  ['amber', '#fdab3d'],
  ['brown', '#7f5347'],
  ['gray', '#c4c4c4'],
  ['darkGray', '#757575'],
])

const labels = [
  // Status Labels (l101 - l199)
  { id: 'l101', title: '', color: '#c4c4c4' },
  { id: 'l102', title: 'Done', color: '#00c875' },
  { id: 'l103', title: 'Working on it', color: '#fdab3d' },
  { id: 'l104', title: 'Stuck', color: '#df2f4a' },
  { id: 'l105', title: 'Waiting for Review', color: '#ffcb00' },

  // Priority Labels (l201 - l299)
  { id: 'l201', title: '', color: '#c4c4c4' },
  { id: 'l202', title: 'Critical ⚠️', color: '#333333' },
  { id: 'l203', title: 'High', color: '#401694' },
  { id: 'l204', title: 'Medium', color: '#5559df' },
  { id: 'l205', title: 'Low', color: '#579bfc' },
  { id: 'l206', title: 'Optional', color: '#9d99ff' }
]

const members = [
  {
    _id: 'u101',
    fullname: 'Tal Tarablus',
    imgUrl: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
  },
  {
    _id: 'u102',
    fullname: 'Yuval Dadon',
    imgUrl: 'https://gravatar.com/images/homepage/avatar-04.png',
  },
  {
    _id: 'u103',
    fullname: 'Ofir Gady',
    imgUrl: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
  },
  {
    _id: 'u104',
    fullname: 'Gal Israeli',
    imgUrl: 'https://gravatar.com/images/homepage/avatar-02.png',
  },
]

function getEmptyBoard() {
  return {
    title: 'New Board',
    isStarred: false,
    archivedAt: 0,
    createdBy: {
      _id: '',
      fullname: '',
      imgUrl: '',
    },
    style: {},
    labels: labels,
    members: members,
    groupSummary: [null, null, null],
    groups: [{...getEmptyGroup()}],
    archivedItems: [], //Groups or Tasks
    activities: [],
    cmpsOrder: ["status", "priority", "memberIds", "dueDate"],
    cmpTitles: ["Status", "Priority", "Members", "Due Date"],
    groupSummary: [],
  }
}
  
function getEmptyGroup() {
  return {
    id: 'g'+ utilService.makeId(),
    title: 'New Group',
    archivedAt: 0,
    tasks: [{...getEmptyTask()}],
    archivedItems: [],
    style: { color: _setNewGroupColor() },
    collapsed: false,
  }
}

  function getEmptyTask() {
    return {
      id: 't'+ utilService.makeId(),
      title: 'New Task',
      archivedAt: 0,
      status: 'l101',
      priority: 'l201',
      description: '',
      comments: [],
      checklists: [],
      memberIds: [],
      labelIds: [],
      dueDate: 0,
      byMember: {},
      style: {},
    }
  }

  function _setNewGroupColor() {
    const colors = Array.from(groupColors.values())
    const randomIndex = Math.floor(Math.random() * colors.length)
    const randomColor = colors[randomIndex]
    return randomColor
  }

  function getDefaultFilter() {
    return {
      txt: '',
      groups: [],
      tasks: [],
      members: [],
      statusLabels: [],
      priorityLabels: []
    }
  }


const service = VITE_LOCAL === 'true' ? local : remote
export const boardService = { getEmptyBoard, getEmptyGroup, getEmptyTask, getDefaultFilter, groupColors, ...service }





