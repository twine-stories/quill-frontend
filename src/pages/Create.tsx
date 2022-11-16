import React, { useContext, useState } from 'react';
import { UserContext } from '../App.tsx';
import Navbar from "../components/Navbar.tsx";
import Button from '../components/Button.tsx';
import { Genre } from '../utils/enums.ts';
import { Work } from '../utils/types.ts';

interface CreateProps {
    addWork: (work: Work, setter: (work: Work) => void) => void;
}

function Create(props: CreateProps) {
    const context: object = useContext(UserContext);
    if (context['userLoaded'] === true && (!context['user'] || !context['user']['creator'])) {
        window.location.href = '/';
    }

    const genreOptions: Array<JSX.Element> = [];
    const genres: object = Object.keys(Genre);
    for (let i in Object.values(Genre)) {
        let val: string = genres[i];
        genreOptions.push(<option key={val.toLowerCase()} value={val.toLowerCase()}>{val.toLowerCase()}</option>);
    }

    return (
        <div>
            <Navbar />
            <div className='pageHeader'>Create</div>
            <div className='pageContent'>
                <p>create story</p>
                <div>
                    <input type='text' id='title' name='title' placeholder='enter title' />
                    <input type='text' id='description' name='description' placeholder='description' />
                    <input type='text' id='url' name='url' placeholder='url' />
                    <select name='genre1' id='genre1'>
                        {genreOptions}
                    </select>
                    <select name='genre2' id='genre2'>
                        {genreOptions}
                    </select>
                    <select name='genre3' id='genre3'>
                        {genreOptions}
                    </select>
                    <Button name='Create!' action={(e) => {
                        const title = document.getElementById('title') as HTMLInputElement;
                        const description = document.getElementById('description') as HTMLInputElement;
                        const url = document.getElementById('url') as HTMLInputElement;
                        const genre1 = document.getElementById('genre1') as HTMLInputElement;
                        const genre2 = document.getElementById('genre2') as HTMLInputElement;
                        const genre3 = document.getElementById('genre3') as HTMLInputElement;
                        if (title && description && url && genre1 && genre2 && genre3) {
                            let newWork: Work = {
                                creator: context['user'],
                                title: title.value,
                                description: description.value,
                                cover: 'cover',
                                banner: 'banner',
                                genre1: genre1.value.toUpperCase(),
                                genre2: genre2.value.toUpperCase(),
                                genre3: genre3.value.toUpperCase(),
                                medium: "WRITTEN",
                                url: url.value
                            };
        
                            props.addWork(newWork, (work) => {
                                console.log("url taken");
                            });
                        }
                    }} />
                </div>
            </div>
        </div>
    );
}

export default Create;