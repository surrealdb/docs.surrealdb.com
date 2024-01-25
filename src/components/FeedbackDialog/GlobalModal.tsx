import React, { useContext } from 'react';
import { ModalContext } from '../../utils/ModalContext';
import FeedbackDialog  from './FeedbackDialog';


const GlobalModal: React.FC = () => {
    const { isModalOpen, closeModal } = useContext(ModalContext);

    return isModalOpen ? <FeedbackDialog onClose={closeModal} /> : null;
};

export default GlobalModal;
