import { storageService } from '../async-storage.service.js'
import { utilService } from '../util.service.js'
import { store } from '../../store/store.js'


export const boardService = {
  updateBoard,
  query,
  save,
  remove,
  getById,
}

const STORAGE_KEY = 'boards'
_createBoards()

async function updateBoard(board, groupId, taskId, { key, value }) {
  if (!board) return
  const gIdx = board?.groups.findIndex((groupItem) => groupItem.id === groupId)
  const tIdx = board?.groups[gIdx]?.tasks.findIndex((t) => t.id === taskId)

  if (gIdx !== -1 && tIdx !== -1) {
    board.groups[gIdx].tasks[tIdx][key] = value
  } else if (gIdx !== -1) {
    board.groups[gIdx][key] = value
  } else {
    board[key] = value
  }
  try {
    await save(board)
    return board
  } catch (err) {
    console.error('Failed to save the board:', err)
    throw err
  }
}

async function query(filterBy = {}) {
  try {
    let boards = await storageService.query(STORAGE_KEY)
    return boards
  } catch (error) {
    console.log('error:', error)
    throw error
  }
}

async function getById(id) {
  return await storageService.get(STORAGE_KEY, id)
}

async function remove(id) {
  return await storageService.remove(STORAGE_KEY, id)
}

async function save(boardToSave) {
  if (boardToSave._id) {
    return await storageService.put(STORAGE_KEY, boardToSave)
  } else {
    return await storageService.post(STORAGE_KEY, boardToSave)
  }
}


function _createBoards() {
  let boards = utilService.loadFromStorage(STORAGE_KEY)
  if (!boards || !boards.length) {
    const boards = [
      {
        _id: 'b101',
        title: 'First Board',
        isStarred: false,
        createdBy: {
          _id: 'u101',
          fullname: 'Abi Abambi',
          imgUrl: 'http://some-img',
        },
        style: {},
        labels: [
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
          { id: 'l206', title: 'Optional', color: '#9d99ff' },

          // Member Labels (l301 - l399)
          { id: 'l301', title: 'Frontend Team', color: '#579bfc' },
          { id: 'l302', title: 'Backend Team', color: '#bbd676' },
          { id: 'l303', title: 'QA Team', color: '#f5dd29' },
          { id: 'l304', title: 'Product Team', color: '#fdab3d' },
          { id: 'l305', title: 'Design Team', color: '#ff642e' },

          // Task Type Labels (l401 - l499)
          { id: 'l401', title: 'Bug', color: '#a25ddc' },
          { id: 'l402', title: 'Feature', color: '#7f5347' },
          { id: 'l403', title: 'Chore', color: '#d3d3d3' },
          { id: 'l404', title: 'Epic', color: '#ffadad' },
          { id: 'l405', title: 'Improvement', color: '#29cc8e' },

          // Custom Labels (l501 - l599)
          { id: 'l501', title: 'Customer Request', color: '#ff9d76' },
          { id: 'l502', title: 'Blocked', color: '#4eccc6' },
          { id: 'l503', title: 'Research', color: '#b3bac5' },
          { id: 'l504', title: 'Planning', color: '#2a71d0' },
          { id: 'l505', title: 'Delayed', color: '#ff0000' },
        ],
        members: [
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
        ],
        groups: [
          {
            id: 'g101',
            title: 'Group 1',
            archivedAt: 1589983468418,
            collapsed: false,
            tasks: [
              {
                id: 'c101',
                title: 'Add Samples',
                status: 'l103',
                priority: 'l205',
                memberIds: ['u101', 'u103', 'u102', 'u104'],
              },
              {
                id: 'c102',
                title: 'Some Task',
                status: 'l102',
                priority: 'l205',
                memberIds: ['u102', 'u104'],
              },
              {
                id: 'c103',
                title: 'Replace logo',
                status: 'l102',
                priority: 'l204',
                memberIds: [],
              },
            ],
            style: { color: 'red' },
          },
          {
            id: 'g102',
            title: 'Group 2',
            collapsed: false,
            tasks: [
              {
                id: 'c104',
                title: 'Do that',
                status: 'l104',
                priority: 'l203',
                memberIds: ['u103'], // tal yuval ofir gal
              },

              {
                id: 'c105',
                title: 'Help me',
                status: 'l105', // monday
                priority: 'l205',
                memberIds: [],
              },
            ],
            style: { color: 'purple' },
          },
        ],
        activities: [
          // {
          //   // picture for reference https://i.imgur.com/AMMkPT2.png
          //   id: 'a101',
          //   createdAt: Date.now(),
          //   byMember: {
          //     _id: 'u101',
          //     fullname: 'Abi Abambi',
          //     imgUrl: 'http://some-img',
          //   },
          //   boardid: 'b101',
          //   groupid: 'g101', // if this is null, then it's a board activity
          //   taskid: 'c101', // If this is null, then it's a group activity
          //   action_name: 'Created', // Or 'Updated' Or 'Moved' Or 'Deleted' etc etc... perhaps 'Updated' could be broken down into more specific names like 'Name changed' or 'Color Changed'
          //   free_txt: 'Group created', // Or 'Group deleted' or 'Group moved to another board' etc etc
          //   prevValue: null, // This remembers the last value of the task/group/board before the change
          // },
        ],

        cmpsOrder: ['status', 'priority', 'memberIds', 'dueDate'],
        cmpTitles: ['Status', 'Priority', 'Members', 'Due Date'],
        groupSummary: [null, null, null],
      },
      {
        _id: 'b102',
        title: 'Second Board',
        isStarred: false,
        createdBy: {
          _id: 'u101',
          fullname: 'Abi Abambi',
          imgUrl: 'http://some-img',
        },
        style: {},
        labels: [
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
          { id: 'l206', title: 'Optional', color: '#9d99ff' },

          // Member Labels (l301 - l399)
          { id: 'l301', title: 'Frontend Team', color: '#579bfc' },
          { id: 'l302', title: 'Backend Team', color: '#bbd676' },
          { id: 'l303', title: 'QA Team', color: '#f5dd29' },
          { id: 'l304', title: 'Product Team', color: '#fdab3d' },
          { id: 'l305', title: 'Design Team', color: '#ff642e' },

          // Task Type Labels (l401 - l499)
          { id: 'l401', title: 'Bug', color: '#a25ddc' },
          { id: 'l402', title: 'Feature', color: '#7f5347' },
          { id: 'l403', title: 'Chore', color: '#d3d3d3' },
          { id: 'l404', title: 'Epic', color: '#ffadad' },
          { id: 'l405', title: 'Improvement', color: '#29cc8e' },

          // Custom Labels (l501 - l599)
          { id: 'l501', title: 'Customer Request', color: '#ff9d76' },
          { id: 'l502', title: 'Blocked', color: '#4eccc6' },
          { id: 'l503', title: 'Research', color: '#b3bac5' },
          { id: 'l504', title: 'Planning', color: '#2a71d0' },
          { id: 'l505', title: 'Delayed', color: '#ff0000' },
        ],
        members: [
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
        ],
        groups: [
          {
            id: 'g101',
            title: 'Group 1',
            archivedAt: 1589983468418,
            collapsed: false,
            tasks: [
              {
                id: 'c101',
                title: 'Task 1',
                status: 'l101',
                priority: 'l201',
                memberIds: [],
              },
              {
                id: 'c102',
                title: 'Task 2',
                status: 'l101',
                priority: 'l201',
                memberIds: [],
              },
            ],
            style: { color: 'green' },
          },
          {
            id: 'g102',
            title: 'Group 2',
            collapsed: false,
            tasks: [
              {
                id: 'c103',
                title: 'Task 3',
                status: 'l101',
                priority: 'l201',
                memberIds: [],
              },

              {
                id: 'c104',
                title: 'Task 4',
                status: 'l101',
                priority: 'l201',
                memberIds: [],
              },
            ],
            style: { color: 'gray' },
          },
        ],
        activities: [
          // {
          //   // picture for reference https://i.imgur.com/AMMkPT2.png
          //   id: 'a101',
          //   createdAt: Date.now(),
          //   byMember: {
          //     _id: 'u101',
          //     fullname: 'Abi Abambi',
          //     imgUrl: 'http://some-img',
          //   },
          //   boardid: 'b101',
          //   groupid: 'g101', // if this is null, then it's a board activity
          //   taskid: 'c101', // If this is null, then it's a group activity
          //   action_name: 'Created', // Or 'Updated' Or 'Moved' Or 'Deleted' etc etc... perhaps 'Updated' could be broken down into more specific names like 'Name changed' or 'Color Changed'
          //   free_txt: 'Group created', // Or 'Group deleted' or 'Group moved to another board' etc etc
          //   prevValue: null, // This remembers the last value of the task/group/board before the change
          // },
        ],

        cmpsOrder: ['status', 'priority', 'memberIds', 'dueDate'],
        cmpTitles: ['Status', 'Priority', 'Members', 'Due Date'],
        groupSummary: [null, null, null],
      },
    ]

    utilService.saveToStorage(STORAGE_KEY, boards)
  }
}
