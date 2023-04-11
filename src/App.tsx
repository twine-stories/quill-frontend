import {useEffect, useState, createContext} from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Beta from './pages/Beta.tsx';
import Feedback from './pages/Feedback.tsx';
import Home from './pages/Home.tsx';
import Create from './pages/create/Create.tsx';
import Profile from './pages/Profile.tsx';
import EditProfile from './pages/EditProfile.tsx';
import GenericProfile from './pages/GenericProfile.tsx';
import Story from './pages/Story.tsx';
import Art from './pages/Art.tsx';
import Gallery from "./pages/Gallery.tsx";
import Collection from './pages/Collection.tsx';
import CreateStory from "./pages/create/CreateStory.tsx";
import {ALGO_MyAlgoConnect as MyAlgoConnect, loadStdlib} from '@reach-sh/stdlib';
import {v4 as uuidv4} from 'uuid';
import {getCookie, setCookie, deleteCookie} from './utils/cookies.ts';
import {User} from './utils/types.ts';
import {cookieSet, userGet, userUpdate, userAdd, cookieGet} from './utils/api.ts';
import {CssVarsProvider} from "@mui/joy";
import GlobalStyle from "./utils/globalStyles.ts";
import {PeraWalletConnect} from "@perawallet/connect";
import {ConnectType} from './utils/enums.ts';
import { theme } from './utils/globalStyles.ts';
import CreateChapter from "./pages/create/CreateChapter.tsx";
import Chapter from "./pages/Chapter.tsx";

const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback({
    providerEnv: 'TestNet', MyAlgoConnect
}));

export const UserContext = createContext(null as any);
const peraWallet = new PeraWalletConnect();

// probably move to secrets manager but this doesn't really need to be that secure
const accessCode: string = 'twinebeta!!';

function App() {
    const [user, setUser] = useState<User>();
    const [address, setAddress] = useState<string>();
    const [openLogin, setOpenLogin] = useState<boolean>(false);
    const [getUserToggle, setGetUserToggle] = useState<boolean>(false);
    const [initUserLoad, setInitUserLoad] = useState<boolean>(false);
    const [connType, setConnType] = useState<ConnectType>();
    const [beta, setBeta] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);

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

    const enterBeta = (code: string) => {
        if (code === accessCode) {
            setCookie('beta_session', 'active');
            setBeta(false);
        }
    }

    useEffect(() => {
        const cookie = getCookie('beta_session');
        if (cookie === 'active') {
            setBeta(false);
        }

        setLoading(false);
    }, []);

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

    if (loading) {
        return (<div className='App'></div>);
    }
    return (
        <div className="App">
            <CssVarsProvider defaultMode="dark" theme={theme}>
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
                    'updateUser': updateUser,
                    'enterBeta': enterBeta
                }}>
                    {beta ?
                        <Routes>
                            <Route path="/*" element={<Beta />}></Route>
                        </Routes>
                        :
                        <Routes>
                            <Route path="/feedback" element={<Feedback/>}></Route>
                            <Route path="/art" element={<Art/>}></Route>
                            <Route path="/create" element={<Create/>}></Route>
                            <Route path="/create/story" element={<CreateStory/>}></Route>
                            <Route path="/create/episode/*" element={<CreateChapter/>}></Route>
                            <Route path="/profile" element={<Profile/>}></Route>
                            <Route path="/edit-profile" element={<EditProfile/>}></Route>
                            <Route path="/profile/:username" element={<GenericProfile/>}></Route>
                            <Route path="/story/*" element={<Story/>}></Route>
                            <Route path="/episode/*" element={<Chapter/>}></Route>
                            <Route path="/collection/*" element={<Collection />}></Route>
                            <Route path="/gallery/story/draft" element={<Gallery art={false} draft={true}/>}></Route>
                            <Route path="/gallery/story/published" element={<Gallery art={false} draft={false}/>}></Route>
                            <Route path="/" element={<Home />}></Route>
                        </Routes>
                    }
                </UserContext.Provider>
            </CssVarsProvider>
        </div>
    );
}

export default App;
