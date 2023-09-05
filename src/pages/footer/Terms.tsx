import React from 'react'
import './Terms.css'
import Navbar from '../../components/layout/Navbar.tsx'
import { Grid, Typography } from '@mui/joy'
import Footer from '../../components/layout/Footer.tsx'

function Terms() {
    const legalUrl: string = 'https://twine-legal.s3.amazonaws.com/'
    const docMapping: object = {
        tos: 'TERMS_OF_USE',
        community: 'COMMUNITY_POLICY_AND_UPLOADING_GUIDELINES',
        privacy: 'PRIVACY_POLICY',
        revenue: 'REVENUE_TERMS_OF_SERVICE',
    }

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
                        Terms
                    </Typography>
                </Grid>
                <Grid xs={10} id="terms-links">
                    <a
                        href={legalUrl + docMapping['tos'] + '.pdf'}
                        target="_blank"
                    >
                        <Typography level="h4">Terms of Use</Typography>
                    </a>
                    <a
                        href={legalUrl + docMapping['community'] + '.pdf'}
                        target="_blank"
                    >
                        <Typography level="h4">Community Policy</Typography>
                    </a>
                    <a
                        href={legalUrl + docMapping['privacy'] + '.pdf'}
                        target="_blank"
                    >
                        <Typography level="h4">Privacy Policy</Typography>
                    </a>
                    <a
                        href={legalUrl + docMapping['revenue'] + '.pdf'}
                        target="_blank"
                    >
                        <Typography level="h4">
                            Revenue Terms of Service
                        </Typography>
                    </a>
                </Grid>
            </Grid>
            <Footer/> 
        </div>
    )
}

export default Terms
