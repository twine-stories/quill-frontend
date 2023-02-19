import { User, Work, Artwork, NFTCollection } from './types.ts';

const axios = require('axios').default;

type CookieParams = {
    userCookie: string;
    walletAddress: string;
}

export const userGet = (addr: string, setter: (user: User) => void) : void => {
    axios.get('/api/user/' + addr)
        .then(response => {
            setter(response.data);
        })
        .catch(error => {
            console.error(error);
        });
}

export const userUpdate = (user: User, setter: (user: User) => void) : void => {
    axios.post('/api/user/update', user)
        .then(response => {
            if (response.status === 200) {
                setter(user);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const userAdd = (user: User, setter: (user: User) => void) : void => {
    axios.post('/api/user/add', user)
        .then(response => {
            if (response.status === 200) {
                setter(user);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const cookieGet = (cookie: string, setter: (user: User) => void ) : void => {
    axios.get('/api/user/cookie/' + cookie)
        .then(response => {
            if (response.data) {
                setter(response.data);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const cookieSet = (params: CookieParams, setter: (cookie: string) => void) : void => {
    axios.post('/api/user/setUserCookie', params)
        .then(response => {
            if (response.status === 200) {
                setter(params['userCookie']);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const workGetByUrl = (url: string, setter: (work: Work) => void, fail: () => void) : void => {
    axios.get('/api/work/url/' + url)
        .then(response => {
            if (response.data) {
                setter(response.data);
            } else {
                fail();
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const worksGetByCreator = async (address: string): Promise<Work[] | null> => {
    const response = await axios.get('/api/work/creator/' + address);
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export const workAdd = (work: Work, fail: (foundWork: Work) => void) : void => {
    workGetByUrl(work.url, fail, () => {
        axios.post('/api/work/add', work)
            .then(response => {
                if (response.status === 200) {
                    console.log('success');
                }
            })
            .catch(error => {
                console.error(error);
            });
    });
}

export const artworkGetAll = async (): Promise<Artwork[] | null> => {
    const response = await axios.get('/api/artworks');
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export const artworkGet = async (assetId: number): Promise<Artwork> => {
    const response = await axios.get('/api/artwork/' + assetId);
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export const artworkAdd = (artwork: Artwork): void => {
    axios.post('/api/artwork/create', artwork)
        .then(response => {
            if (response.status === 200) {
                console.log('success');
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const artworkUpdate = (artwork: Artwork): void => {
    axios.post('/api/artwork/update', artwork)
        .then(response => {
            if (response.status === 200) {
                console.log('success');
            }
        })
        .catch(error => {
            console.error(error);
        });
}

export const collectionCreateWithArt = async (collection: NFTCollection, artworks: Artwork[]): Promise<NFTCollection> => {
    const response = await axios.post('/api/collection/createWithArt', {collection: collection, artworks: artworks});
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export const getEscrowProgram = async (assetId: number, appId: number): Promise<string> => {
    const escrowResponse = await axios.get('/algo/escrow?nft_id=' + assetId + '&app_id=' + appId);
    const escrowData = escrowResponse.data;
    return escrowData;
}