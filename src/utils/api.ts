import { User, Work, Artwork, NFTCollection, Episode } from './types.ts'
import { env } from '../config.ts'

const axios = require('axios').default
export const proxy =
    env === 'prod'
        ? 'https://proxy.cors.sh/http://ec2-13-58-80-245.us-east-2.compute.amazonaws.com:8080'
        : ''
if (env === 'prod') {
    axios.defaults.headers.common['x-cors-api-key'] =
        'live_247c418e3e045d65807ae434c4b7b9835161122ab01906c5a2f9e4efb440a23c'
}

type CookieParams = {
    userCookie: string
    walletAddress: string
}

export const genericGet = async (endpoint: string) => {
    const response = await axios.get(proxy + endpoint)
    if (response.status === 200) {
        return response.data
    }

    console.error('get request to ' + endpoint + ' failed')
    return null
}

export const genericPost = async (endpoint: string, requestBody: object) => {
    const response = await axios.post(proxy + endpoint, requestBody)
    if (response.status === 200) {
        return response.data
    }

    console.error('post request to ' + endpoint + ' failed')
    return null
}

export const userGet = (addr: string, setter: (user: User) => void): void => {
    axios
        .get(proxy + '/api/user/' + addr)
        .then((response) => {
            setter(response.data)
        })
        .catch((error) => {
            console.error(error)
        })
}

export const userUpdate = (user: User, setter: (user: User) => void): void => {
    axios
        .post(proxy + '/api/user/update', user)
        .then((response) => {
            if (response.status === 200) {
                console.log(user)
                setter(user)
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const userAdd = (user: User, setter: (user: User) => void): void => {
    axios
        .post(proxy + '/api/user/add', user)
        .then((response) => {
            if (response.status === 200) {
                setter(user)
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const cookieSet = (
    params: CookieParams,
    setter: (cookie: string) => void
): void => {
    axios
        .post(proxy + '/api/user/setUserCookie', params)
        .then((response) => {
            if (response.status === 200) {
                setter(params['userCookie'])
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const workGetByUrl = (
    url: string,
    setter: (work: Work) => void,
    fail: () => void
): void => {
    axios
        .get(proxy + '/api/work/url/' + url)
        .then((response) => {
            if (response.data) {
                setter(response.data)
            } else {
                fail()
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const worksGetByCreator = async (
    address: string
): Promise<Work[] | null> => {
    const response = await axios.get(proxy + '/api/work/creator/' + address)
    if (response.status === 200) {
        return response.data
    }
    return null
}

export const workAdd = (work: Work, fail: (foundWork: Work) => void): void => {
    workGetByUrl(work.url, fail, () => {
        axios
            .post(proxy + '/api/work/add', work)
            .then((response) => {
                if (response.status === 200) {
                    console.log('success')
                }
            })
            .catch((error) => {
                console.error(error)
            })
    })
}

export const episodeGetByUrl = (
    url: string,
    setter: (episode: Episode) => void,
    fail: () => void
): void => {
    axios
        .get(proxy + '/api/episode/url/' + url)
        .then((response) => {
            if (response.data) {
                setter(response.data)
            } else {
                fail()
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const episodeAdd = (
    episode: Episode,
    fail: (foundEpisode: Episode) => void
): void => {
    episodeGetByUrl(episode.url, fail, () => {
        axios
            .post(proxy + '/api/episode/add', episode)
            .then((response) => {
                if (response.status === 200) {
                    console.log('success')
                }
            })
            .catch((error) => {
                console.error(error)
            })
    })
}

export const episodesGetByWorkId = async (
    workId: number,
    fail: () => void
): Promise<Episode[] | null> => {
    const response = await axios.get(proxy + '/api/episode/work/id/' + workId)
    if (response.status === 200) {
        return response.data
    } else {
        fail()
    }
    return null
}

export const artworkGetAll = async (): Promise<Artwork[] | null> => {
    const response = await axios.get(proxy + '/api/artworks')
    if (response.status === 200) {
        return response.data
    }
    return null
}

export const artworkGet = async (assetId: number): Promise<Artwork> => {
    const response = await axios.get(proxy + '/api/artwork/' + assetId)
    if (response.status === 200) {
        return response.data
    }
    return null
}

export const artworkAdd = (artwork: Artwork): void => {
    axios
        .post(proxy + '/api/artwork/create', artwork)
        .then((response) => {
            if (response.status === 200) {
                console.log('success')
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const artworkUpdate = (artwork: Artwork): void => {
    axios
        .post(proxy + '/api/artwork/update', artwork)
        .then((response) => {
            if (response.status === 200) {
                console.log('success')
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

export const collectionCreateWithArt = async (
    collection: NFTCollection,
    artworks: Artwork[]
): Promise<NFTCollection> => {
    const response = await axios.post(proxy + '/api/collection/createWithArt', {
        collection: collection,
        artworks: artworks,
    })
    if (response.status === 200) {
        return response.data
    }
    return null
}

export const getEscrowProgram = async (
    saleType: string,
    assetId: string,
    appId: number
): Promise<string> => {
    const escrowResponse = await axios.get(
        '/algo/escrow/' + saleType + '?nft_id=' + assetId + '&app_id=' + appId
    )
    const escrowData = escrowResponse.data
    return escrowData
}

export const collectionGetAll = async (): Promise<NFTCollection[] | null> => {
    const response = await axios.get(proxy + '/api/collections')
    if (response.status === 200) {
        return response.data
    }
    return null
}

export const collectionGetByUrl = async (
    url: string
): Promise<NFTCollection> => {
    const response = await axios.get(proxy + '/api/collection/url/' + url)
    if (response.status === 200) {
        return response.data
    }
    return null
}
