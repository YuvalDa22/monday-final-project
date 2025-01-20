import ReactDOM from 'react-dom/client'
import RootCmp from './RootCmp.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { HashRouter as Router } from 'react-router-dom'
import { ProviderChakra } from './cmps/ui/provider-chakra.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<ProviderChakra>
			<Router>
				<RootCmp />
			</Router>
		</ProviderChakra>
	</Provider>
)
