import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
import { dispatchOpenFeedbackModalEvent } from '@site/src/theme/FeedbackDialog/globalEventDispatcher';
import ModifyHash from '@site/src/utils/ModifyHash';

export default function TOC({ className, ...props }) {
    return (
        <>
            <ModifyHash />
            <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
                <TOCItems
                    {...props}
                    linkClassName='table-of-contents__link toc-highlight'
                    linkActiveClassName='table-of-contents__link--active' />
                <button className="feedback-btn" onClick={dispatchOpenFeedbackModalEvent}>
                    Give us Feedback
                </button>
            </div>
        </>
    );
}
