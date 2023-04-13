import React from 'react';
import {Modal, ModalDialog, ModalClose, Typography} from "@mui/joy";
import './ErrorPopup.css';

export default function ErrorPopup({isOpen, onClose, message}) {
    return (
        <Modal className = "modal" open = {isOpen} onClose = {onClose} >
            <ModalDialog
                size="sm"
                variant="plain"
                className="modal-dialog"
            >
                <ModalClose />
                <div className="data">
                    <h2>Uh-Oh</h2>
                    <p>{message}</p>
                </div>
                
            </ModalDialog>
        </Modal>
    )
}