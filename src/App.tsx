
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/reducer';
import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <div className="App">     
          <div className="flex">   
            <span>test</span>            
            <Router>
                <Routes>
                  <Route path="/" element={ <Dashboard />} />                                                                                               
                </Routes>              
            </Router>
          </div>
      </div>
    </Provider>
  );
}

export default App;