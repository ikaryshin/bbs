import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function BasicAlert(props) {

    // toggleShow = () => {
    //     this.setState((prev) => ({
    //         showAlert: !prev.showAlert,
    //     }))
    // }

    let title = props.title
    let body = props.body
    let toggleShow = props.toggleShow
    let show = props.show

    return (
        <Modal show={show} onHide={toggleShow}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={toggleShow}>
                    确认
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BasicAlert