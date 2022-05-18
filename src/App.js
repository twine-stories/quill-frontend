import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Written from './pages/Written';
import Illustrated from './pages/Illustrated';
import Create from './pages/Create';
import Profile from './pages/Profile';

function App() {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => console.log(data));
    return (
        <div className="App">
            <Routes>
                <Route path="/written" element={<Written />}></Route>
                <Route path="/illustrated" element={<Illustrated />}></Route>
                <Route path="/create" element={<Create />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/" element={<Home />}></Route>
            </Routes>
        </div>
    );
}

export default App;
