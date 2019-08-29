import React from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

function SimpleAlert(props) {
    // props: title, onConfirm
    let show = props.show

    let title = props.title
    let onConfirm = props.onConfirm

    return (
        <Modal show={show} onHide={onConfirm}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="primary" onClick={onConfirm}>
                    确定
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SimpleAlert