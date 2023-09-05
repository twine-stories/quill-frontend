import React from 'react'
import { Grid, Typography } from '@mui/joy'
import Navbar from '../components/layout/Navbar.tsx'
import Footer from '../components/layout/Footer.tsx'

function RouteNotFound() {
    return (
        <div>
            <Navbar />
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                height="40vh"
            >
                <Grid>
                    <Typography level="h1" color="purple">
                        404. Link not found.
                    </Typography>
                    <Typography level="h6">
                        The requested URL was not found on this server. Sorry!
                    </Typography>
                </Grid>
            </Grid>
            <Footer/>
        </div>
    )
}

export default RouteNotFound
