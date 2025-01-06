import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { toyService } from '../../services/toys.service'
import { store } from '../store'

const toys = [
  {
    name: 'Teddy Bear',
    price: '25',
    labels: ['On wheels'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/12211/pexels-photo-12211.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Race Car',
    price: '40',
    labels: ['Battery Powered', 'Outdoor'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/272056/pexels-photo-272056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Building Blocks',
    price: '30',
    labels: ['Puzzle'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/264917/pexels-photo-264917.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Doll House',
    price: '50',
    labels: ['Doll'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/1522180/pexels-photo-1522180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    name: 'Puzzle',
    price: '20',
    labels: ['Puzzle'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/776092/pexels-photo-776092.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Toy Train',
    price: '45',
    labels: ['Battery Powered', 'On wheels'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/133639/pexels-photo-133639.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Action Figure',
    price: '35',
    labels: ['Outdoor'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/189506/pexels-photo-189506.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Sandbox',
    price: '60',
    labels: ['Outdoor', 'Box game'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/160773/sandbox-children-child-sand-160773.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Toy Kitchen',
    price: '70',
    labels: ['Box game'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/1264919/pexels-photo-1264919.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Remote-Controlled Drone',
    price: '100',
    labels: ['Battery Powered', 'Outdoor'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/139167/pexels-photo-139167.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    name: 'Rubik’s Cube',
    price: '15',
    labels: ['Puzzle'],
    msgs: [],
    imgUrl:
      'https://images.pexels.com/photos/714917/pexels-photo-714917.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
]

import {
  ADD_TOY,
  EDIT_TOY,
  REMOVE_TOY,
  SET_FILTER,
  //   SET_IS_LOADING,
  SET_TOYS,
} from './toys.reducer'

export async function addRandomToy() {
  const randomToy = toys[Math.floor(Math.random() * toys.length)]
  await saveToy(randomToy)
}

export async function loadToys(filterBy) {
  try {
    const toys = await toyService.query(filterBy)
    await store.dispatch({ type: SET_TOYS, toys })
    showSuccessMsg('toys fetched')
  } catch (err) {
    showErrorMsg('Having issues with loading toys:')
    throw err
  }
}

export async function removeToy(toyId) {
  try {
    await toyService.remove(toyId)
    store.dispatch({ type: REMOVE_TOY, toyId })
  } catch (err) {
    console.log('Having issues removing toy:', err)
    throw err
  }
}

// export async function removeRobotOptimistic(robotId) {
//   try {
//     store.dispatch({ type: REMOVE_TOY, robotId })
//     await toyService.remove(robotId)
//   } catch (err) {
//     console.log('Having issues removing robot:', err)
//     store.dispatch({ type: UNDO_CHANGES })
//     throw err
//   }
// }

export async function saveToy(toyToSave) {
  try {
    const type = toyToSave.id ? EDIT_TOY : ADD_TOY
    const toy = await toyService.save(toyToSave)
    store.dispatch({ type, toy })
  } catch (err) {
    console.log('Having issues saving toy:', err)
    throw err
  }
}

export function setFilterBy(filterBy = {}) {
  store.dispatch({ type: SET_FILTER, filterBy })
  console.log(filterBy, 'from the filter function')
}
