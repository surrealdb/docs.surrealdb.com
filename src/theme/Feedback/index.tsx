import React, { useState } from 'react';

function FeedbackForm({ onBack, closeDialog }) {
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [inputFocus, setInputFocus] = useState(false);

    const handleCategoryClick = (cat) => {
        setCategory(cat);
    };
    
    const handleInputFocus = () => {
        setInputFocus(true);
    };

    const handleInputBlur = () => {
        setInputFocus(false);
    };

    const isFormValid = category && message;

    const handleSubmit = (e) => {
        e.preventDefault();
    
        fetch('https://form.surrealdb.com/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                type: category,
                text: message,
                url: url,
                date: new Date(),
            }),
            })
            .then((response) => response.json())
            .then((data) => {        
                setCategory('');
                setMessage('');
                setUrl('');
                setIsSubmitted(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        };

        if (isSubmitted) {
            return (
                <div>
                    <p>Thanks, your form has been submitted.</p>
                    <button type="button" onClick={onBack}>Back</button>
                </div>
            );
        }

    return (
        <form onSubmit={handleSubmit}>
            <div className="feedbackform">
                <div className="feedback-controls">
                    <div className="feedback-controls-left">
                        <button type="button" onClick={onBack} className='feedbackform-back-btn'>
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1L2 9L10 17" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        </button>
                    </div>
                    <div className="feedback-controls-middle">
                        Send us your feedback
                    </div>
                    <div className="feedback-controls-right">
                        <button type="button" onClick={closeDialog} className="feedbackform-close-btn">
                            <svg aria-hidden="true" className="github-issue-icon-x" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m13.41 12 6.3-6.29a1.004 1.004 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1.004 1.004 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42.998.998 0 0 0 1.42 0l6.29-6.3 6.29 6.3a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12Z"></path></svg>
                        </button>
                    </div>
                </div>
                <div className="feedbackform-container">
                    <div className="feedbackform-cta">
                    <button
                        className={`feedbackform-cta-btn ${category === 'bug' ? 'button-active' : ''}`}
                        type="button"
                        onClick={() => handleCategoryClick('bug')}
                    >
                        Bug
                    </button>
                    <button
                        className={`feedbackform-cta-btn ${category === 'idea' ? 'button-active' : ''}`}
                        type="button"
                        onClick={() => handleCategoryClick('idea')}
                    >
                        Idea
                    </button>
                    <button
                        className={`feedbackform-cta-btn ${category === 'other' ? 'button-active' : ''}`}
                        type="button"
                        onClick={() => handleCategoryClick('other')}
                    >
                        Other
                    </button>
                    </div>
                    <div className={`feedbackform-input-url ${inputFocus ? 'input-focus' : ''}`}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            placeholder="URL where the issue was found"
                        />
                    </div>
                    <div className="feedbackform-textarea">
                        <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What do you want us to know?"
                        minLength={10}
                        maxLength={50}
                        />
                    </div>
                    <div className="feedback-controls">
                        <div>
                            <a href="https://surrealdb.com/legal/privacy" target="_blank" className="feedbackform-privacy-btn">Privacy Policy</a>
                        </div>
                        <div className="feedback-controls-right">
                            <button 
                                type="submit"
                                disabled={!isFormValid} 
                                className={isFormValid ? 'feedbackform-submit-btn' : 'submitButtonDisabled'}
                                >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </form>
    );
}

export default FeedbackForm;
