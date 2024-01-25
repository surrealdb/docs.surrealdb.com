import React, { useContext } from 'react';
import { ModalContext } from './ModalContext';
import FeedbackDialog  from './FeedbackDialog';

const GlobalModal: React.FC = () => {

    console.log ("globalmodal");
    const { isModalOpen, closeModal } = useContext(ModalContext);
    return isModalOpen ? <FeedbackDialog onClose={closeModal} /> : null;
};

export default GlobalModal;
