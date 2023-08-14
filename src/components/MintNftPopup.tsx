import React from 'react';
import {Modal, ModalDialog, ModalClose, Typography} from "@mui/joy";
import TwineButton from './TwineButton.tsx';

interface MintNftPopupProps {
    isOpen: boolean;
    onClose: () => void;
    mintNft: () => void;
}

export default function MintNftPopup(props: MintNftPopupProps) {
    return (
        <Modal className = "modal" open = {props.isOpen} onClose = {props.onClose} >
            <ModalDialog
                size="sm"
                variant="plain"
                className="modal-dialog"
            >
                <ModalClose />
                <div className="data">
                    <Typography level='h2' color='purple'>Data uploaded successfully</Typography>
                    <TwineButton action={props.mintNft} name='Mint NFT' />
                </div>
                
            </ModalDialog>
        </Modal>
    )
}