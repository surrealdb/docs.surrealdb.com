import React from 'react';
import { ModalProvider } from '../../utils/ModalContext';
import GlobalModal from './GlobalModal';

const Feedback: React.FC = () => {
  return (
    <ModalProvider>
      <GlobalModal />
    </ModalProvider>
  );
}

export default Feedback;