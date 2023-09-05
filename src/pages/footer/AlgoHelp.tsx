import React from 'react'
import './AlgoHelp.css'
import Navbar from '../../components/layout/Navbar.tsx'
import { Grid, Typography } from '@mui/joy'
import Footer from '../../components/layout/Footer.tsx'

function AlgoHelp() {
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
                        Algo Help
                    </Typography>
                </Grid>
                <Grid xs={10} id="algo-help-links">
                    <a href="/help/wallet">
                        <Typography level="h4">
                            Getting Started with Pera
                        </Typography>
                    </a>
                    <a href="/help/fund">
                        <Typography level="h4">
                            Fund Your Wallet with Debit
                        </Typography>
                    </a>
                    <a href="/help/swap">
                        <Typography level="h4">
                            Swap from Algo to USDC
                        </Typography>
                    </a>
                </Grid>
            </Grid>
           <Footer />
        </div>
    )
}

export default AlgoHelp
