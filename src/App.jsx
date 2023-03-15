import { useEffect, useState } from 'react';
import {BrowserRouter as Router,Routes,Route,Outlet} from 'react-router-dom';
import {GlobalContextProvider} from './contexts/globalContext';
import { HomeContextProvider } from './contexts/homeContext';
import { PostContextProvider } from './contexts/postContext';
import { ProfileContextProvider } from './contexts/profileContext';
import AppService from './services/appService';
import LoginPage from './views/loginPage';
import MessagesPage from './views/MessagesPage';
import NotFoundPage from './views/NotFoundPage';

function ProtectedRoute({isLogged}){

  return isLogged?<Outlet />:<LoginPage />;
}

function App(){
  const [loggedUser,setLoggedUser]=useState(null);
  useEffect(()=>{
    setLoggedUser(AppService.isLogged());
  },[]);

  return (
    <GlobalContextProvider>
    <div className="App w-screen min-h-screen bg-lighter dark:bg-darkest">
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/profile/:username' element={<ProfileContextProvider />} />
            <Route path='/post/:postID' element={<PostContextProvider />} />
            <Route path='/' element={<ProtectedRoute isLogged={loggedUser!=null} />}>
              <Route path='/' element={<HomeContextProvider />} />
              <Route path='/profile/:username/settings' element={<ProfileContextProvider settings={true} />} />
              <Route path='/messages' element={<MessagesPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
    </div>
    </GlobalContextProvider>
  );
}

export default App;
