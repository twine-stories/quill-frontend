import React from 'react'
import './Help.css'
import Navbar from '../../components/Navbar.tsx'
import { Grid, Typography } from '@mui/joy'

function FundHelp() {
    return (
        <div>
            <Navbar />
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="space-around"
            >
                <Grid xs={11}>
                    <Typography level="h2" color="purple">
                        Fund Your Wallet with Debit
                    </Typography>
                </Grid>
                <Grid xs={10} className="help-content">
                    <Grid>
                        <Typography level="h5">
                            Step 1: Go to{' '}
                            <a
                                className="twine-highlighted-link"
                                href="https://global.transak.com/"
                                target="_blank"
                            >
                                global.transak.com
                            </a>
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            Step 2: Enter desired amount of money, and select
                            ALGO from the dropdown list of assets to receive.
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            Step 3: Copy your wallet address from your Twine
                            account, and paste it into the recipient address on
                            your order.
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            Step 4: Confirm your email address.
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            Step 5: Follow instructions and enter the requested
                            user information. If you are living in the US, they
                            are legally required to collect the requested
                            information as per Know Your Customer (KYC) laws.
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            Step 6: Enter your credit card information.
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            Step 7: Confirm transaction. Go ahead and use it on
                            Twine to support your favorite artists!
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography level="h5">
                            If you're interested, check out our guide on{' '}
                            <a
                                className="twine-highlighted-link"
                                href="/help/swap"
                            >
                                swapping your Algo to USDC!
                            </a>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default FundHelp
