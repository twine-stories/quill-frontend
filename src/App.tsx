import { useEffect, useState, createContext } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.tsx';
import Written from './pages/Written';
import Illustrated from './pages/Illustrated';
import Create from './pages/Create.tsx';
import Profile from './pages/Profile.tsx';
import { ALGO_MyAlgoConnect as MyAlgoConnect, loadStdlib } from '@reach-sh/stdlib';
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie, deleteCookie } from './utils/cookies.ts';

const axios = require('axios').default;

const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback({
    providerEnv: 'TestNet', MyAlgoConnect
}));

export const UserContext = createContext(null as any);

function App() {
    const [user, setUser] = useState<object>();
    const [address, setAddress] = useState<string>();
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [getUserToggle, setGetUserToggle] = useState<boolean>(false);
    const [initUserLoad, setInitUserLoad] = useState<boolean>(false);

    const logOut = (): void => {
        deleteCookie('session');
        window.location.replace('/');
    }

    const updateUser = (newUser: object) => {
        axios.post('/api/user/update', newUser)
            .then(response => {
                if (response.status === 200) {
                    setUser(newUser);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const setUserCookie = (walletAddress: string, cookie: string) => {
        const params = {
            userCookie: cookie,
            walletAddress: walletAddress
        };
        axios.post('/api/user/setUserCookie', params)
            .then(response => {
                if (response.status === 200) {
                    setCookie('session', cookie);
                    setGetUserToggle(!getUserToggle);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const onComplete = (account: object): void => {
        const addr: string = account['networkAccount']['addr'];
        setUserCookie(addr, uuidv4());
        setAddress(addr);
    };

    const connectToMyAlgo = async (): Promise<void> => {
        try {
            const accounts = await reach.getDefaultAccount();
            onComplete(accounts);
        }
        catch (err) {
            console.error(err);
        }
    }

    const getAndSetUser = (addr: string): void => {
        axios.get('/api/user/' + addr)
            .then(response => {
                if (response.data) {
                    setUser(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const addUser = (walletAddress: string, firstName: string, lastName: string): void => {
        const cookie = uuidv4();
        const newUser = {
            walletAddress: walletAddress,
            email: null,
            firstName: firstName,
            lastName: lastName,
            profileImg: 'temp',
            userCookie: cookie
        }
        axios.post('/api/user/add', newUser)
            .then(response => {
                if (response.status === 200) {
                    getAndSetUser(walletAddress);
                    setCookie('session', cookie);
                    setGetUserToggle(!getUserToggle);
                }
            })
            .catch(error => {
                // handle error
                console.error(error);
            });
        setOpenLogin(false);
    }

    const cancelLogin = (): void => {
        setOpenLogin(false);
        setAddress("");
    }

    useEffect(() => {
        const cookie = getCookie('session');
        if (cookie === "") {
            setInitUserLoad(true);
            return;
        }
        axios.get('/api/user/cookie/' + cookie)
            .then(response => {
                if (response.data) {
                    setUser(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, [getUserToggle]);

    useEffect(() => {
        if (address) {
            axios.get('/api/user/' + address)
                .then(response => {
                    if (response.data) {
                        setUser(response.data);
                    } else {
                        setOpenLogin(true);
                    }
                })
                .catch(error => {
                    // handle error
                    console.error(error);
                });
        }
    }, [address]);

    useEffect(() => {
        if (user) {
            setInitUserLoad(true);
        }
    }, [user]);

    return (
        <div className="App">
            <UserContext.Provider value={{'userLoaded': initUserLoad,'address': address, 'user': user, 'connectToMyAlgo': connectToMyAlgo, 'logOut': logOut, 'openLogin': openLogin, 'closeLogin': cancelLogin, 'addUser': addUser, 'updateUser': updateUser}}>
                <Routes>
                    <Route path="/written" element={<Written />}></Route>
                    <Route path="/illustrated" element={<Illustrated />}></Route>
                    <Route path="/create" element={<Create />}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/" element={<Home />}></Route>
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;
