import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';

import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';
import * as hootService from './services/hootService';

import { UserContext } from './contexts/UserContext';
import './App.css';

const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();

  const handleAddHoot = async (hootFormData) => {
    // console.log('hootFormData', hootFormData);
    const newHoot = await hootService.create(hootFormData);
    setHoots([...hoots, newHoot]);
    navigate('/hoots');
  };

  const handleDeleteHoot = async (hootId) => {
    // console.log('hootId', hootId);
    const deletedHoot = await hootService.deleteHoot(hootId);
    setHoots(hoots.filter(hoot => hoot._id !== deletedHoot._id));
    navigate('/hoots');
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    // console.log('hootId:', hootId, 'hootFormData:', hootFormData);
    const updatedHoot = await hootService.update(hootId, hootFormData);
    setHoots(hoots.map(hoot => hootId === hoot._id ? updatedHoot : hoot));
    navigate(`/hoots/${hootId}`);
  };

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user
          ? (<>
            <Route path='/hoots' element={<HootList hoots={hoots} />}></Route>
            <Route path='/hoots/new' element={<HootForm handleAddHoot={handleAddHoot} />}></Route>
            <Route path='/hoots/:hootId' element={<HootDetails handleDeleteHoot={handleDeleteHoot} />}></Route>
            <Route path='/hoots/:hootId/edit' element={<HootForm handleUpdateHoot={handleUpdateHoot} />}></Route>
          </>)
          : (<>
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>)
        }
      </Routes>
    </>
  );
};

export default App;
