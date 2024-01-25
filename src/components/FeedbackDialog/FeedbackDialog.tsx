import React from 'react';

interface FeedbackDialogProps {
    onClose: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ onClose }) => {

    console.log("feedback dialog");
    
    return (
        <div className="modal-container">
        <div className="box-container">
            <div className="box">Github issue</div>
            <div className="box">Feedback</div>
        </div>

        <p className="modal-text">Give some feedback</p>

        <button onClick={onClose} className="close-button">Close</button>
        </div>
    );
};

export default FeedbackDialog;
