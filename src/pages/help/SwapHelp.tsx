import React from 'react';
import './Help.css';
import Navbar from '../../components/Navbar.tsx';
import { Grid, Typography } from '@mui/joy';

function SwapHelp() {

    return (
        <div>
            <Navbar />
            <Grid container direction='column' alignItems='center' justifyContent='space-around'>
                <Grid xs={11}><Typography level='h2' color='purple'>Swap from Algo to USDC</Typography></Grid>
                <Grid xs={10} className='help-content'>
                    <Grid>
                        <Typography level='h5' color='purple'>USDC is a stablecoin, designed that each coin is backed by $1 of value redeemable through Circle, the issuer. Swapping your Algo to USDC protects you from the price fluctuations of Algo.</Typography>
                        <Typography level='h5' color='purple'>However, if you are a creator who has earned a significant amount of Algo, we recommend moving it to your bank account, as this is safer than keeping USDC for extended periods of time.</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 1: Open Pera Mobile Wallet, navigate to "Home"</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 2: Click "Swap" button</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 3: Select Account</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 4: Click "Choose an asset," then click "USDC"</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 5: If this is the first time swapping to USDC, you will need to opt-in to the asset. After clicking "USDC," you should get a pop-up titled "Adding Asset." Click Approve.</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 6: You should be back on the "Swap" page. Enter the amount of Algo you want to swap to USDC. It is important to remember to leave at least 1 Algo in your account at all times to pay for transaction costs.</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>Step 7: Confirm swap. You are all set!</Typography>
                    </Grid>

                    <Grid>
                        <Typography level='h5'>*IMPORTANT NOTES*</Typography>
                        <Typography level='h5' color='purple'>Pera charges a fee for the convenience of swapping within the wallet. If you are swapping large amounts, proceed to <a href='http://app.tinyman.org' target='_blank'>app.tinyman.org</a> and swap directly on their site to avoid the .8% fee Pera Wallet charges.</Typography>
                        <Typography level='h5' color='purple'>In swapping within Pera Mobile Wallet or tinyman, you are using an AMM decentralized exchange, meaning the order you place is through a liquidity pool. You can read more about them <a href='https://learn.bybit.com/glossary/definition-automated-market-maker-amm/' target='_blank'>here</a>. <strong>Be cautious with large swaps!</strong> If the "price impact" listed under the "Confirm Swap" page is &gt; 5%, we recommend not proceeding with the swap. This means you will only receive 95% of the value of the Algo you are swapping. Instead, swap a smaller amount of Algo, wait for a few hours and swap again.</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default SwapHelp;