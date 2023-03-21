import {useEffect, useState, createContext} from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from './pages/Home.tsx';
import Create from './pages/Create.tsx';
import Profile from './pages/Profile.tsx';
import EditProfile from './pages/EditProfile.tsx';
import GenericProfile from './pages/GenericProfile.tsx';
import Story from './pages/Story.tsx';
import Episode from './pages/Episode.tsx';
import Art from './pages/Art.tsx';
import Collection from './pages/Collection.tsx';
import {ALGO_MyAlgoConnect as MyAlgoConnect, loadStdlib} from '@reach-sh/stdlib';
import {v4 as uuidv4} from 'uuid';
import {getCookie, setCookie, deleteCookie} from './utils/cookies.ts';
import {User, Work} from './utils/types.ts';
import {cookieSet, userGet, userUpdate, userAdd, cookieGet} from './utils/api.ts';
import {CssVarsProvider} from "@mui/joy";
import GlobalStyle from "./utils/globalStyles.ts";
import {PeraWalletConnect} from "@perawallet/connect";
import {ConnectType} from './utils/enums.ts';

const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback({
    providerEnv: 'TestNet', MyAlgoConnect
}));

export const UserContext = createContext(null as any);
const peraWallet = new PeraWalletConnect();

function App() {
    const [user, setUser] = useState<User>();
    const [address, setAddress] = useState<string>();
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [getUserToggle, setGetUserToggle] = useState<boolean>(false);
    const [initUserLoad, setInitUserLoad] = useState<boolean>(false);
    const [connType, setConnType] = useState<ConnectType>();

    const logOut = (): void => {
        if (user.connectType === ConnectType.PERA) {
            peraWallet.disconnect();
        }
        deleteCookie('session');
        // change this redirect
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

    const onComplete = (addr: string): void => {
        setUserCookie(addr, uuidv4());
        setAddress(addr);
    };

    const mockConnectToMyAlgo = (): void => {
        onComplete('KYUH2SNU6FWFGBK6PNWI4EUIABOYFIQIQH2WOP3FW7DGA623ESTGXYQPJA');
    }

    const connectToMyAlgo = async (): Promise<void> => {
        try {
            const accounts = await reach.getDefaultAccount();
            setConnType(ConnectType.MY_ALGO);
            onComplete(accounts['networkAccount']['addr']);
        } catch (err) {
            console.error(err);
        }
    }

    const connectToPera = async (): Promise<void> => {
        try {
            const newAccounts = await peraWallet.connect();
            peraWallet.connector?.on('disconnect', logOut);
            setConnType(ConnectType.PERA);
            onComplete(newAccounts[0]);
        } catch (err) {
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
            userCookie: cookie,
            connectType: connType
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
            userGet(address, (newUser: User) => {
                if (newUser) {
                    if (newUser.connectType !== connType) {
                        newUser.connectType = connType;
                        setCookie('session', newUser.userCookie);
                        updateUser(newUser)
                    } else {
                        setUser(newUser);
                    }
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
            <CssVarsProvider defaultMode="dark">
                <GlobalStyle />
                <UserContext.Provider value={{
                    'userLoaded': initUserLoad,
                    'address': address,
                    'user': user,
                    'connectToPera': connectToPera,
                    'connectToMyAlgo': connectToMyAlgo,
                    'mockConnectToMyAlgo': mockConnectToMyAlgo,
                    'logOut': logOut,
                    'openLogin': openLogin,
                    'closeLogin': cancelLogin,
                    'addUser': addUser,
                    'updateUser': updateUser
                }}>
                    <Routes>
                        <Route path="/art" element={<Art/>}></Route>
                        <Route path="/create" element={<Create/>}></Route>
                        <Route path="/profile" element={<Profile/>}></Route>
                        <Route path="/edit-profile" element={<EditProfile/>}></Route>
                        <Route path="/profile/:username" element={<GenericProfile/>}></Route>
                        <Route path="/story/*" element={<Story/>}></Route>
                        <Route path="/episode/*" element={<Episode/>}></Route>
                        <Route path="/collection/*" element={<Collection />}></Route>
                        {/*<Route path="/" element={<Episode/>}></Route>*/}
                        <Route path="/" element={<Home />}></Route>
                    </Routes>
                </UserContext.Provider>
            </CssVarsProvider>
        </div>
    );
}

export default App;
