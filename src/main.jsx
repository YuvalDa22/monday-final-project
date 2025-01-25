import ReactDOM from 'react-dom/client'
import RootCmp from './RootCmp.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { HashRouter as Router } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
			<Router>
				<RootCmp />
			</Router>
	</Provider>
)
