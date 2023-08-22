import React, { useEffect, useState, createContext } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import RouteNotFound from './pages/RouteNotFound.tsx'
import Beta from './pages/Beta.tsx'
import FeedbackPage from './pages/footer/FeedbackPage.tsx'
import Home from './pages/Home.tsx'
import Create from './pages/create/Create.tsx'
import Profile from './pages/Profile.tsx'
import EditProfile from './pages/EditProfile.tsx'
import GenericProfile from './pages/GenericProfile.tsx'
import Story from './pages/Story.tsx'
import Art from './pages/Art.tsx'
import Gallery from './pages/Gallery.tsx'
import Collection from './pages/Collection.tsx'
import CreateStory from './pages/create/CreateStory.tsx'
import Footer from './components/Footer.tsx'
import WalletWalkthrough from './pages/help/WalletWalkthrough.tsx'
import FundHelp from './pages/help/FundHelp.tsx'
import SwapHelp from './pages/help/SwapHelp.tsx'
import Terms from './pages/footer/Terms.tsx'
import About from './pages/footer/About.tsx'
import AlgoHelp from './pages/footer/AlgoHelp.tsx'
import {
    ALGO_MyAlgoConnect as MyAlgoConnect,
    loadStdlib,
} from '@reach-sh/stdlib'
import { v4 as uuidv4 } from 'uuid'
import { getCookie, setCookie, deleteCookie } from './utils/cookies.ts'
import { User } from './utils/types.ts'
import {
    cookieSet,
    userGet,
    userAdd,
    genericGet,
    genericPost,
} from './utils/api.ts'
import { CircularProgress, Grid, CssVarsProvider } from '@mui/joy'
import GlobalStyle from './utils/globalStyles.ts'
import { PeraWalletConnect } from '@perawallet/connect'
import { ConnectType } from './utils/enums.ts'
import { theme } from './utils/globalStyles.ts'
import CreateChapter from './pages/create/CreateChapter.tsx'
import Chapter from './pages/Chapter.tsx'
import FirstLogin from './components/FirstLogin.tsx'
import ErrorPopup from './components/ErrorPopup.tsx'
import { env } from './config.ts'
import { AlgorandChainIDs } from '@perawallet/connect/dist/util/peraWalletTypes'
import CreateArtwork from './pages/create/CreateArtwork.tsx'
import CreateCollection from './pages/create/CreateCollection.tsx'

const reach = loadStdlib('ALGO')
let chainId: AlgorandChainIDs
if (env === 'dev') {
    chainId = 416002
    reach.setWalletFallback(
        reach.walletFallback({
            providerEnv: 'TestNet',
            MyAlgoConnect,
        })
    )
} else {
    chainId = 416001
    reach.setWalletFallback(
        reach.walletFallback({
            providerEnv: 'MainNet',
            MyAlgoConnect,
        })
    )
}

export const UserContext = createContext(null as any)
export const peraWallet = new PeraWalletConnect({
    chainId: chainId,
})

// probably move to secrets manager but this doesn't really need to be that secure
const accessCode: string = 'twinebeta!!'

function App() {
    const [user, setUser] = useState<User>()
    const [address, setAddress] = useState<string>()
    const [openLogin, setOpenLogin] = useState<boolean>(false)
    const [getUserToggle, setGetUserToggle] = useState<boolean>(false)
    const [initUserLoad, setInitUserLoad] = useState<boolean>(false)
    const [connType, setConnType] = useState<ConnectType>(ConnectType.PERA)
    const [beta, setBeta] = useState<boolean>(true)
    const [usePera, setUsePera] = useState<boolean>(false)
    const [useMyAlgo, setUseMyAlgo] = useState<boolean>(false)

    const logOut = (): void => {
        if (user && user.connectType === ConnectType.PERA) {
            peraWallet.disconnect()
        }
        deleteCookie('session')
        setUser(null)
    }

    const setUserCookie = (walletAddress: string, cookie: string) => {
        const params = {
            userCookie: cookie,
            walletAddress: walletAddress,
        }
        cookieSet(params, (cookie) => {
            setCookie('session', cookie)
            setGetUserToggle(!getUserToggle)
        })
    }

    const onComplete = (addr: string): void => {
        setUserCookie(addr, uuidv4())
        setAddress(addr)
    }

    const isCorrectType = async (
        addr: string,
        expected: ConnectType
    ): Promise<boolean> => {
        const response: User = await genericGet('/api/user/' + addr)
        if (!response || response.connectType === expected) {
            return true
        }
        return false
    }

    const connectToMyAlgo = async (): Promise<void> => {
        try {
            setConnType(ConnectType.MY_ALGO)
            const accounts = await reach.getDefaultAccount()
            const shouldContinue: boolean = await isCorrectType(
                accounts['networkAccount']['addr'],
                ConnectType.MY_ALGO
            )
            if (shouldContinue) {
                onComplete(accounts['networkAccount']['addr'])
            } else {
                setUsePera(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const connectToPera = async (): Promise<void> => {
        try {
            setConnType(ConnectType.PERA)
            const newAccounts = await peraWallet.connect()
            peraWallet.connector?.on('disconnect', logOut)
            const shouldContinue: boolean = await isCorrectType(
                newAccounts[0],
                ConnectType.PERA
            )
            if (shouldContinue) {
                onComplete(newAccounts[0])
            } else {
                peraWallet.disconnect()
                setUseMyAlgo(true)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getAndSetUser = (addr: string): void => {
        userGet(addr, setUser)
    }

    const addUser = (
        walletAddress: string,
        firstName: string,
        lastName: string,
        username: string
    ): void => {
        const cookie = uuidv4()
        const newUser: User = {
            walletAddress: walletAddress,
            email: null,
            firstName: firstName,
            lastName: lastName,
            profileImg: 'default.jpeg',
            userCookie: cookie,
            connectType: connType,
            userName: username,
        }
        userAdd(newUser, (user) => {
            getAndSetUser(user.walletAddress)
            setCookie('session', user.userCookie)
            setGetUserToggle(!getUserToggle)
        })
        setOpenLogin(false)
    }

    const cancelLogin = (): void => {
        if (connType === ConnectType.PERA) {
            peraWallet.disconnect()
        }
        setOpenLogin(false)
        setAddress('')
    }

    const enterBeta = (code: string) => {
        if (code === accessCode) {
            setCookie('beta_session', 'active')
            setBeta(false)
        }
    }

    useEffect(() => {
        const cookie = getCookie('beta_session')
        if (cookie === 'active') {
            setBeta(false)
        }
    }, [])

    useEffect(() => {
        const cookie = getCookie('session')
        if (cookie === '') {
            peraWallet.reconnectSession().then((accounts) => {
                peraWallet.connector?.on('disconnect', logOut)
                if (accounts.length) {
                    onComplete(accounts[0])
                }
            })
            setInitUserLoad(true)
            return
        } else {
            peraWallet.reconnectSession().then((accounts) => {
                peraWallet.connector?.on('disconnect', logOut)
            })
        }
        genericGet('/api/user/cookie/' + cookie).then(
            (response: User | null) => {
                setUser(response)
            }
        )
    }, [getUserToggle])

    useEffect(() => {
        if (address) {
            userGet(address, (newUser: User) => {
                if (newUser) {
                    if (newUser.connectType !== connType) {
                        newUser.connectType = connType
                        setCookie('session', newUser.userCookie)
                        genericPost('/api/user/update', newUser).then(
                            (response: User) => {
                                setUser(response)
                            }
                        )
                    } else {
                        setUser(newUser)
                    }
                } else {
                    setOpenLogin(true)
                }
            })
        }
    }, [address])

    useEffect(() => {
        if (user !== undefined) {
            setInitUserLoad(true)
        }
    }, [user])

    if (!initUserLoad) {
        return (
            <div
                className="App"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Grid
                    sx={{
                        '--CircularProgress-progressColor': '#9E9FEB',
                    }}
                >
                    <CircularProgress color="lightpurple" variant="plain" />
                </Grid>
            </div>
        )
    }
    return (
        <div className="App">
            <CssVarsProvider defaultMode="dark" theme={theme}>
                <GlobalStyle />
                <UserContext.Provider
                    value={{
                        userLoaded: initUserLoad,
                        address: address,
                        user: user,
                        connectToPera: connectToPera,
                        connectToMyAlgo: connectToMyAlgo,
                        logOut: logOut,
                        openLogin: openLogin,
                        closeLogin: cancelLogin,
                        addUser: addUser,
                        updateUser: setUser,
                        enterBeta: enterBeta,
                    }}
                >
                    <FirstLogin />
                    <ErrorPopup
                        isOpen={usePera}
                        onClose={() => {
                            setUsePera(false)
                        }}
                        message="Your account is associated with Pera Wallet. Please log in with Pera Wallet instead."
                    />
                    <ErrorPopup
                        isOpen={useMyAlgo}
                        onClose={() => {
                            setUseMyAlgo(false)
                        }}
                        message="Your account is associated with MyAlgo Wallet. Please log in with MyAlgo Wallet instead."
                    />
                    {beta ? (
                        <Routes>
                            <Route path="/*" element={<Beta />}></Route>
                        </Routes>
                    ) : (
                        <>
                            <div id="content-wrapper">
                                {user ? (
                                    <Routes>
                                        <Route
                                            path="/about"
                                            element={<About />}
                                        ></Route>
                                        <Route
                                            path="/feedback"
                                            element={<FeedbackPage />}
                                        ></Route>
                                        <Route
                                            path="/terms"
                                            element={<Terms />}
                                        ></Route>
                                        <Route
                                            path="/help/wallet"
                                            element={<WalletWalkthrough />}
                                        ></Route>
                                        <Route
                                            path="/help/fund"
                                            element={<FundHelp />}
                                        ></Route>
                                        <Route
                                            path="/help/swap"
                                            element={<SwapHelp />}
                                        ></Route>
                                        <Route
                                            path="/help/*"
                                            element={<AlgoHelp />}
                                        ></Route>
                                        <Route
                                            path="/art"
                                            element={<Art />}
                                        ></Route>

                                        <Route
                                            path="/create"
                                            element={<Create />}
                                        ></Route>
                                        <Route
                                            path="/create/story"
                                            element={<CreateStory />}
                                        ></Route>
                                        <Route
                                            path="/create/chapter/*"
                                            element={<CreateChapter />}
                                        ></Route>
                                        <Route
                                            path="/create/art"
                                            element={<CreateArtwork />}
                                        ></Route>
                                        <Route
                                            path="/create/collection"
                                            element={<CreateCollection />}
                                        ></Route>

                                        <Route
                                            path="/edit/story/*"
                                            element={
                                                <CreateStory edit={true} />
                                            }
                                        ></Route>
                                        <Route
                                            path="/edit/chapter/*"
                                            element={
                                                <CreateChapter edit={true} />
                                            }
                                        ></Route>

                                        <Route
                                            path="/story/*"
                                            element={<Story />}
                                        ></Route>
                                        <Route
                                            path="/chapter/*"
                                            element={<Chapter />}
                                        ></Route>

                                        <Route
                                            path="/gallery/story/draft"
                                            element={
                                                <Gallery
                                                    art={false}
                                                    draft={true}
                                                />
                                            }
                                        ></Route>
                                        <Route
                                            path="/gallery/story/published"
                                            element={
                                                <Gallery
                                                    art={false}
                                                    draft={false}
                                                />
                                            }
                                        ></Route>

                                        <Route
                                            path="/profile"
                                            element={<Profile />}
                                        ></Route>
                                        <Route
                                            path="/edit-profile"
                                            element={<EditProfile />}
                                        ></Route>
                                        <Route
                                            path="/profile/:username"
                                            element={<GenericProfile />}
                                        ></Route>

                                        <Route
                                            path="/collection/*"
                                            element={<Collection />}
                                        ></Route>

                                        <Route
                                            path="/"
                                            element={<Home />}
                                        ></Route>
                                        <Route
                                            path="*"
                                            element={<RouteNotFound />}
                                        ></Route>
                                    </Routes>
                                ) : (
                                    <Routes>
                                        <Route
                                            path="/about"
                                            element={<About />}
                                        ></Route>
                                        <Route
                                            path="/feedback"
                                            element={<FeedbackPage />}
                                        ></Route>
                                        <Route
                                            path="/terms"
                                            element={<Terms />}
                                        ></Route>
                                        <Route
                                            path="/help/wallet"
                                            element={<WalletWalkthrough />}
                                        ></Route>
                                        <Route
                                            path="/help/fund"
                                            element={<FundHelp />}
                                        ></Route>
                                        <Route
                                            path="/help/swap"
                                            element={<SwapHelp />}
                                        ></Route>
                                        <Route
                                            path="/help/*"
                                            element={<AlgoHelp />}
                                        ></Route>
                                        <Route
                                            path="/art"
                                            element={<Art />}
                                        ></Route>
                                        <Route
                                            path="/profile/:username"
                                            element={<GenericProfile />}
                                        ></Route>
                                        <Route
                                            path="/story/*"
                                            element={<Story />}
                                        ></Route>
                                        <Route
                                            path="/chapter/*"
                                            element={<Chapter />}
                                        ></Route>
                                        <Route
                                            path="/collection/*"
                                            element={<Collection />}
                                        ></Route>
                                        <Route
                                            path="/"
                                            element={<Home />}
                                        ></Route>
                                        <Route
                                            path="*"
                                            element={<RouteNotFound />}
                                        ></Route>
                                    </Routes>
                                )}
                            </div>
                            <Footer />
                        </>
                    )}
                </UserContext.Provider>
            </CssVarsProvider>
        </div>
    )
}

export default App
