import Index from './pages/index/index';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/reducer';
import {
  Routes,
  Route,
  BrowserRouter as Router
} from "react-router-dom";
function App() {
  return (
    <Provider store={store}>
      <div className="App">     
          <div className="flex">               
            <Router>
              <Routes>
                <Route path="/" element={ <Index />} />                         
              </Routes>
              <Routes>                                  
              </Routes>
            </Router>
          </div>
      </div>
    </Provider>
  );
}

export default App;