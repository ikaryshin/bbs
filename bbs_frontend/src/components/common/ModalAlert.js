import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function ModalAlert(props) {
    let show = props.show

    let title = props.title
    let body = props.body
    let confirm = props.confirm || '确认'
    let cancel= props.cancel || '取消'
    let onConfirm = props.onConfirm
    let onCancel = props.onCancel

    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    {cancel}
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    {confirm}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAlert