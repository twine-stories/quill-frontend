import React from 'react'
import { Work } from '../utils/types.ts'

interface ProfileWorkProps {
    work: Work
}

function ProfileWork(props: ProfileWorkProps) {
    return (
        <div>
            {props.work && (
                <a href={'/story/' + props.work['url']}>
                    {props.work['title']}
                </a>
            )}
        </div>
    )
}

export default ProfileWork
