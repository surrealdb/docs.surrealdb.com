import React, { useRef, useCallback, useEffect, useState } from 'react';
import FeedbackForm from '../Feedback';

const FeedbackDialog = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [showForm, setShowForm] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openDialog = useCallback(() => {
        dialogRef.current?.showModal();
        setShowForm(false);
        setIsModalOpen(true);
    }, []);

    const closeDialog = useCallback(() => {
        dialogRef.current?.close();
        setIsModalOpen(false);
    }, []);

    const checkIfClickedOutside = e => {
        if (dialogRef.current && !dialogRef.current.contains(e.target)) {
            closeDialog();
        }
    }

    const handleBack = () => {
        setShowForm(false);
    };

    useEffect(() => {
        const handleOpenModalEvent = () => openDialog();
        window.addEventListener('openFeedbackModal', handleOpenModalEvent);

        return () => {
            window.removeEventListener('openFeedbackModal', handleOpenModalEvent);
        };
    }, [openDialog, closeDialog]);

    useEffect(() => {
        document.addEventListener('mousedown', checkIfClickedOutside);
        return () => document.removeEventListener('mousedown', checkIfClickedOutside);
    }, [checkIfClickedOutside]);

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    }, [isModalOpen]);

    return (
        <>

            <div className={isModalOpen ? "modal-backdrop" : "modal-backdrop-hidden"}>
            </div>
            <dialog ref={dialogRef} className="modal-container" id="modal-container">
                    {showForm ? (
                    <FeedbackForm onBack={handleBack} closeDialog={closeDialog} />
                    ) : (
                        <div className="modal-container">
                            <span className="github-heading">What's on your mind?</span>
                            <div className="select-pane">
                                <button className="github-close-btn" onClick={closeDialog}>
                                    <svg aria-hidden="true" className="github-issue-icon-x" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m13.41 12 6.3-6.29a1.004 1.004 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1.004 1.004 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42.998.998 0 0 0 1.42 0l6.29-6.3 6.29 6.3a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12Z"></path></svg>
                                </button>
                            </div>

                            <div className="select-pane">
                                <div className="select-buttons">
                                    <a className="github-button-left" href="https://github.com/surrealdb/docs.surrealdb.com/issues/new/choose" target="_blank" rel="noopener noreferrer">
                                        <svg aria-hidden="true" className="github-issue-icon-gh" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"></path>
                                        </svg>
                                        <h2 className="github-issue">
                                            Create GitHub Issue
                                        </h2>
                                        <p className="github-issue-copy">
                                            Quickest way to alert <br />our team of a problem.
                                        </p>
                                    </a>
                                    <button className="github-button-right" onClick={() => setShowForm(true)}>
                                        <svg aria-hidden="true" className="github-issue-icon-feed" width="30" height="28" viewBox="0 0 30 28" fill="currentColor">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 3C0 1.34315 1.34315 0 3 0H27C28.6569 0 30 1.34315 30 3V19C30 20.6569 28.6569 22 27 22H12.7143L5.80697 27.3724C5.47854 27.6278 5 27.3938 5 26.9777V22H3C1.34315 22 0 20.6569 0 19V3ZM7 13C8.10457 13 9 12.1046 9 11C9 9.89543 8.10457 9 7 9C5.89543 9 5 9.89543 5 11C5 12.1046 5.89543 13 7 13ZM17 11C17 12.1046 16.1046 13 15 13C13.8954 13 13 12.1046 13 11C13 9.89543 13.8954 9 15 9C16.1046 9 17 9.89543 17 11ZM23 13C24.1046 13 25 12.1046 25 11C25 9.89543 24.1046 9 23 9C21.8954 9 21 9.89543 21 11C21 12.1046 21.8954 13 23 13Z" />
                                        </svg>
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
                    )}
            </dialog>
        </>
    );
};

export default FeedbackDialog;
