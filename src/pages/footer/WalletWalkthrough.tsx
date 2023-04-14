import React from 'react';
import './WalletWalkthrough.css';
import Navbar from '../../components/Navbar.tsx';
import { Grid, Typography } from '@mui/joy';

function WalletWalkthrough() {

    return (
        <div>
            <Navbar />
            <Grid container direction='column' alignItems='center' justifyContent='space-around' id='wallet-help'>
                <Grid xs={11}><Typography level='h2' color='purple'>Getting Started with Pera</Typography></Grid>
                <iframe src="https://www.youtube.com/embed/GxuSRKfeeFM">
                </iframe>
                <Grid xs={10} id='wallet-help-content'>
                    <Grid>
                        <Typography level='h5'>Step 1: Download Pera Algo Wallet from the app store on your phone.</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 2: Click "Create New Account," "I want to create an account," "create a new account"</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 3: Get a pen and paper out. Write down your recovery passphrase <u>on paper</u> and store it somewhere safe. It is good to have <u>multiple paper copies</u> in different secure locations. This 25 word phrase gives full control of the account to anyone who has it, making it a 2-edged sword. It will allow you to recover your account, but if someone accesses it, they can control your account.</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 4: Verify recovery passphrase - it's a little quiz!</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 5: Make a pin: this will secure your pera wallet app. You can turn on face ID / fingerprint in settings.</Typography>
                        <Typography color='purple' level='h6'>It is important to know that while the pin will give your app protection, anyone with the recovery passphrase of your account on the app can access the account (so keep your recovery phrase somewhere safe)! The pin simply protects someone from accessing your account if they gain control of your phone.</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 6: To log into Twine, click log in, select pera, then "connect with pera mobile". In your app, navigate to Home and select "Scan QR," and then scan the QR that appears on the website. After scanning the QR, you should confirm the request that appears in the pera mobile app. Congrats, you are logged in!</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 7: Whenever you attempt a transaction on the website, you should receive a popup in-app on the pera mobile app. Confirm this request to complete the transaction on the website.</Typography>
                        <Typography color='purple' level='h6'>Important: when you confirm a transaction on the pera mobile app, <u>it is final</u>. You should only confirm transactions that you request.</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default WalletWalkthrough;