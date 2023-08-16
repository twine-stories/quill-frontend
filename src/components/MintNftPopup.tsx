import React from 'react'
import {
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
    Grid,
    CircularProgress,
} from '@mui/joy'
import TwineButton from './TwineButton.tsx'

interface MintNftPopupProps {
    isOpen: boolean
    onClose: () => void
    mintNft: () => void
    loading: boolean
}

export default function MintNftPopup(props: MintNftPopupProps) {
    return (
        <Modal className="modal" open={props.isOpen} onClose={props.onClose}>
            <ModalDialog size="sm" variant="plain" className="modal-dialog">
                <ModalClose />
                <Grid
                    container
                    alignItems="center"
                    flexDirection="column"
                    justifyContent="space-around"
                    sx={{ padding: '20px', width: '400px' }}
                >
                    <Typography
                        level="h2"
                        color="purple"
                        sx={{ textAlign: 'center' }}
                    >
                        Data uploaded successfully
                    </Typography>
                    <TwineButton
                        action={props.mintNft}
                        name={
                            props.loading ? (
                                <CircularProgress
                                    color="darkpurple"
                                    variant="plain"
                                />
                            ) : (
                                'Mint NFT'
                            )
                        }
                    />
                </Grid>
            </ModalDialog>
        </Modal>
    )
}
