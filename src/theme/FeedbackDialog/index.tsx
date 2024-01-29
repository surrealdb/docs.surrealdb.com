import React, { useRef, useCallback, useEffect } from 'react';

const FeedbackDialog = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const openDialog = useCallback(() => {
        dialogRef.current?.showModal();
    }, []);

    const closeDialog = useCallback(() => {
        dialogRef.current?.close();
    }, []);

    useEffect(() => {
        const handleOpenModalEvent = () => openDialog();

        window.addEventListener('openFeedbackModal', handleOpenModalEvent);

        return () => window.removeEventListener('openFeedbackModal', handleOpenModalEvent);
    }, [openDialog]);

    return (
        <dialog ref={dialogRef} className="modal-container">
            <div className="modal-container">

                <div className="select-pane">
                    <span className="github-heading">What's on your mind?</span>
                    <button className="github-close-btn" onClick={closeDialog}>
                    <svg aria-hidden="true" className="github-issue-icon-x" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m13.41 12 6.3-6.29a1.004 1.004 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1.004 1.004 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42.998.998 0 0 0 1.42 0l6.29-6.3 6.29 6.3a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12Z"></path></svg>
                    </button>
                </div>

                <div className="select-pane">
                    <div className="select-buttons">
                        <a className="github-button-left" href="https://github.com/surrealdb/docs.surrealdb.com/issues/new" target="_blank" rel="noopener noreferrer">
                            <svg aria-hidden="true" className="github-issue-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"></path></svg>
                            <h2 className="github-issue">
                                Create GitHub Issue
                            </h2>
                            <p className="github-issue-copy">
                                Quickest way to alert our team of a problem.
                            </p>
                        </a>
                        <button className="github-button-right">
                            <svg aria-hidden="true" className="github-issue-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10.67 1.47-8.05-14a3 3 0 0 0-5.24 0l-8 14A3 3 0 0 0 3.94 22h16.12a3 3 0 0 0 2.61-4.53Zm-1.73 2a1 1 0 0 1-.88.51H3.94a1 1 0 0 1-.88-.51 1 1 0 0 1 0-1l8-14a1 1 0 0 1 1.78 0l8.05 14a1 1 0 0 1 .05 1.02v-.02ZM12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z"></path></svg>
                            <h2 className="github-issue">
                                Send us feedback
                            </h2>
                            <p className="github-issue-copy">
							    Send us a message directly.
						    </p>
                        </button>
                    </div>
                </div>
            
            </div>
        </dialog>
    );
};

export default FeedbackDialog;

