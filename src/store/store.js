import {
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from "redux";
import { userReducer } from "./user/user.reducer";
import { boardReducer } from "./board/board.reducer";

const rootReducer = combineReducers({
  userModule: userReducer,
  boardModule: boardReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers());

window.gStore = store;
