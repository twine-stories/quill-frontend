import React from 'react';
import {Modal, ModalDialog, ModalClose, Typography} from "@mui/joy";

export default function SuccessPopup({isOpen, onClose}) {
    return (
        <Modal className = "modal" open = {isOpen} onClose = {onClose} >
            <ModalDialog
                size="sm"
                variant="plain"
                className="modal-dialog"
            >
                <ModalClose />
                <div className="data">
                    <Typography level='h2' color='green'>Success!</Typography>
                </div>
                
            </ModalDialog>
        </Modal>
    )
}