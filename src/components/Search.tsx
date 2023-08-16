import React, { useState, useEffect } from 'react'
import { Autocomplete, AutocompleteOption, Typography, Box } from '@mui/joy'
import { UserContext } from '../App.tsx'
import { Work, User } from '../utils/types.ts'
import { genericGet } from '../utils/api.ts'
import IconButton from './IconButton.tsx'
import './Hamburger.css'

type dyad = {
    isWork: boolean
    name: string
    link: string
}

const Search = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [dyads, setDyads] = useState<dyad[]>([])
    const openSearch = async () => {
        setIsSearching(true)
    }

    const closeSearch = async () => {
        setIsSearching(false)
    }
    const onChange = async (
        e: React.SyntheticEvent<Element, Event>,
        value: string | dyad | null
    ) => {
        if (value !== null && typeof value !== 'string') {
            window.location.href = value.link
        }
    }

    useEffect(() => {
        const getDyads = async () => {
            const response1 = await genericGet('/api/published_works')
            const response2 = await genericGet('/api/users')
            const newDyads: dyad[] = []
            if (response2) {
                response2.forEach((user: User) => {
                    newDyads.push({
                        isWork: false,
                        name: user.userName,
                        link: `/profile/${user.userName}`,
                    })
                })
            }
            if (response1) {
                response1.forEach((work: Work) => {
                    newDyads.push({
                        isWork: true,
                        name: work.title,
                        link: `/story/${work.url}`,
                    })
                })
            }

            setDyads(newDyads)
        }

        getDyads()
    }, [])

    const searchIcon: JSX.Element = isSearching ? (
        <Box display={'flex'}>
            <IconButton
                action={openSearch}
                icon={
                    isSearching
                        ? '/icons/search_color.svg'
                        : '/icons/search_color.svg'
                }
                color={isSearching ? 'litegreen' : 'green'}
            />
            <Autocomplete
                autoHighlight
                sx={{ width: '75%', outline: 'none' }}
                className="search-inputfield"
                options={dyads}
                freeSolo={true}
                onClose={closeSearch}
                onChange={onChange}
                getOptionLabel={(option: string | dyad) => {
                    if (typeof option === 'string') {
                        return option
                    } else {
                        return option.name
                    }
                }}
                renderOption={(props, option) => {
                    return (
                        <>
                            <AutocompleteOption {...props}>
                                <div
                                    className="optionss"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left',
                                        gap: '0px',
                                    }}
                                >
                                    <span
                                        className="options-name"
                                        style={{
                                            fontStyle: 'Oxanium',
                                            fontSize: '18px',
                                            padding: '5px 10px 0px',
                                        }}
                                    >
                                        {option.name}
                                    </span>
                                    <Typography
                                        level="body3"
                                        sx={{ margin: '1px' }}
                                    >
                                        <span
                                            className="options-name"
                                            style={{
                                                fontStyle: 'Oxanium',
                                                fontSize: '12px',
                                                padding: '5px 10px 0px',
                                            }}
                                        >
                                            {option.isWork ? 'Story' : 'User'}
                                        </span>
                                    </Typography>
                                </div>
                            </AutocompleteOption>
                        </>
                    )
                }}
            />
        </Box>
    ) : (
        <IconButton
            action={openSearch}
            icon="/icons/search.svg"
            color="green"
        />
    )

    return <span>{searchIcon}</span>
}

export default Search
