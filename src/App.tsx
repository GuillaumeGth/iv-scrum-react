
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/reducer';
import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import Teams from './pages/Teams';
import Index from './pages/index/Index';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <div className="App">     
          <div className="flex">               
            <Router>
                <Routes>
                  <Route path="/" element={ <Index />} />                                         
                  <Route path="/teams" element={ <Teams />} />    
                  <Route path="/dashboard" element={ <Dashboard />} />                         
                </Routes>              
            </Router>
          </div>
      </div>
    </Provider>
  );
}

export default App;