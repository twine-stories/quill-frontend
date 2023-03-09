import { useEffect, useState, createContext } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.tsx';
import Create from './pages/Create.tsx';
import Profile from './pages/Profile.tsx';
import Story from './pages/Story.tsx';
import Art from './pages/Art.tsx';
import Collection from './pages/Collection.tsx';
import { ALGO_MyAlgoConnect as MyAlgoConnect, loadStdlib } from '@reach-sh/stdlib';
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie, deleteCookie } from './utils/cookies.ts';
import { User } from './utils/types.ts';
import { cookieSet, userGet, userUpdate, userAdd, cookieGet } from './utils/api.ts';

const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback({
    providerEnv: 'TestNet', MyAlgoConnect
}));

export const UserContext = createContext(null as any);

function App() {
    const [user, setUser] = useState<User>();
    const [address, setAddress] = useState<string>();
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [getUserToggle, setGetUserToggle] = useState<boolean>(false);
    const [initUserLoad, setInitUserLoad] = useState<boolean>(false);

    const logOut = (): void => {
        deleteCookie('session');
        window.location.replace('/');
    }

    const updateUser = (newUser: User) => {
        userUpdate(newUser, setUser);
    }

    const setUserCookie = (walletAddress: string, cookie: string) => {
        const params = {
            userCookie: cookie,
            walletAddress: walletAddress
        };
        cookieSet(params, (cookie) => {
            setCookie('session', cookie);
            setGetUserToggle(!getUserToggle);
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
        userGet(addr, setUser);
    }

    const addUser = (walletAddress: string, firstName: string, lastName: string): void => {
        const cookie = uuidv4();
        const newUser: User = {
            walletAddress: walletAddress,
            email: null,
            firstName: firstName,
            lastName: lastName,
            profileImg: 'temp',
            userCookie: cookie
        }
        userAdd(newUser, (user) => {
            getAndSetUser(user.walletAddress);
            setCookie('session', user.userCookie);
            setGetUserToggle(!getUserToggle);
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
        cookieGet(cookie, setUser);
    }, [getUserToggle]);

    useEffect(() => {
        if (address) {
            userGet(address, (user) => {
                if (user) {
                    setUser(user);
                } else {
                    setOpenLogin(true);
                }
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
                    <Route path="/art" element={<Art />}></Route>
                    <Route path="/create" element={<Create />}></Route>
                    <Route path="/profile" element={<Profile />}></Route>
                    <Route path="/story/*" element={<Story />}></Route>
                    <Route path="/collection/*" element={<Collection />}></Route>
                    <Route path="/" element={<Home />}></Route>
                </Routes>
            </UserContext.Provider>
        </div>
    );
}

export default App;
