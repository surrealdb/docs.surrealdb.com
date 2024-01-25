import React, { useContext } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
import { ModalContext } from '../../components/FeedbackDialog/ModalContext';
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';
export default function TOC({className, ...props}) {

  const { openModal } = useContext(ModalContext);

  const handleOpen = () => {
    console.log('handleOpen called'); // For debugging
    openModal();
  };

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
      
      <button className="feedback-btn" onClick={handleOpen}>Give us feedback</button>

    </div>
  );
}
