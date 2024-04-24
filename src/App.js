import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authentication from './components/Authentication';
import ComposeMail from './components/ComposeMail';
import Inbox from './components/Inbox';
import InboxMessage from './components/InboxMessage';
import SentBox from './components/SentBox';
import SentboxMessage from './components/SentboxMessage';

function App() {
  const isAuthentic = useSelector((state) => state.authReducer.isAuthenticate);

  return (
    <div className="App">
      <header>
        <h1>MAIL BOX CLIENT</h1>
      </header>
      <div>
        {isAuthentic && (
          <div>
            <div>Welcome to Mail Box Client !!!!</div>
            <div className="line"></div>
          </div>
        )}
        <Routes>
          <Route path='/' element={!isAuthentic ? <Authentication /> : <ComposeMail />}></Route> 
          <Route path='/Inbox' element={!isAuthentic ? <Authentication /> : <Inbox />}></Route>
          <Route path='/SentBox' element={!isAuthentic ? <Authentication /> : <SentBox />}></Route>
          <Route path='/Inbox/:Identifier' element={!isAuthentic ? <Authentication /> : <InboxMessage />}></Route>
          <Route path='/Sentbox/:Identifier' element={!isAuthentic ? <Authentication /> : <SentboxMessage />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
