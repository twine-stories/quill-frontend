import React from 'react'

interface LoginButtonProps {
    connectToMyAlgo: () => Promise<void>
}

function LoginButton(props: LoginButtonProps) {
    return <button onClick={props.connectToMyAlgo}>Connect</button>
}

export default LoginButton
