import {
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from 'redux'
import { userReducer } from './user/user.reducer'

const rootReducer = combineReducers({
  userModule: userReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store
