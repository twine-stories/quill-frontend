import React from 'react'
import './About.css'
import Navbar from '../../components/Navbar.tsx'
import { Grid, Typography } from '@mui/joy'

function About() {
    return (
        <div>
            <Navbar />
            <Grid container alignItems="center" justifyContent="center">
                <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="space-around"
                    id="about"
                    xs={10}
                >
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        xs={12}
                        columnSpacing={1}
                    >
                        <Grid
                            container
                            direction="column"
                            alignItems="flex-start"
                            justifyContent="space-between"
                            xs={7}
                        >
                            <Typography level="h2" color="green">
                                About Us
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            xs={5}
                        >
                            <img id="about-logo" src="/icons/twine_logo.svg" />
                        </Grid>
                    </Grid>
                    <Typography level="h6" color="white">
                        Twine is a Web3 publishing platform where authors and
                        illustrators collaborate to create story-based art and
                        serialized fiction.
                    </Typography>
                    <Typography level="h6" color="white">
                        Creators should be able to support themselves with their
                        work. Twine provides a Creator Collab for authors and
                        illustrators to meet and match and a platform to post
                        and sell the art. Author-illustrator teams retain 97% of
                        revenue from art sales, and authors retain 90% of all
                        story tips. By working together to visualize stories and
                        build worlds, authors and illustrators transform the way
                        they monetize.
                    </Typography>
                    <Typography level="h6" color="white">
                        Many storytelling corporations greenlight projects based
                        on predicted audience interest or social media
                        followings. Unlike competitor platforms, Twine does not
                        stand between creators and fans, control the
                        intellectual property, or determine how, what, or when
                        creators publish. We chose the name Twine because we
                        were inspired by the science of forests. A tree alone is
                        vulnerable to weather, but a forest controls it.
                        Transformational change can begin with a small community
                        of people who demand equity. Let’s grow a forest
                        together!
                    </Typography>
                    <Typography level="h6" color="white">
                        The Twine Team:
                    </Typography>
                    <Typography level="h6" className="about-team" color="white">
                        <a
                            href="https://www.linkedin.com/in/sam-raphaelson-87514422b/"
                            target="_blank"
                        >
                            Sam Raphaelson
                        </a>{' '}
                        <br />
                        <a
                            href="https://www.linkedin.com/in/rithikjain/"
                            target="_blank"
                        >
                            Rithik Jain
                        </a>{' '}
                        <br />
                        <a
                            href="https://www.linkedin.com/in/nicholas-raphaelson-a343b7149/"
                            target="_blank"
                        >
                            Nick Raphaelson
                        </a>{' '}
                        <br />
                        <a
                            href="https://www.linkedin.com/in/j-bryant-cassady/"
                            target="_blank"
                        >
                            Bryant Cassady
                        </a>{' '}
                        <br />
                        <a
                            href="https://www.linkedin.com/in/parvs1/"
                            target="_blank"
                        >
                            Parv Shrivastava
                        </a>{' '}
                        <br />
                        <a
                            href="https://www.linkedin.com/in/jeff-raphaelson-aa98031b/"
                            target="_blank"
                        >
                            Jeff Raphaelson
                        </a>{' '}
                        <br />
                    </Typography>
                </Grid>
            </Grid>
        </div>
    )
}

export default About
