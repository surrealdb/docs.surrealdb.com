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
                <form onSubmit={handleSubmit}>
                    <div className="feedbackform">
                        <div>
                            <p>Thanks, your form has been submitted.</p>
                            <button type="button" onClick={onBack}>Back</button>
                        </div>
                    </div>
                </form>
            );
        }

    return (
        <form onSubmit={handleSubmit}>
            <div className="feedbackform">
                <div className="feedback-controls">
                    <div className="feedback-controls-left">
                        <button type="button" onClick={onBack} className='feedbackform-back-btn'>
                        <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 1L2 9L10 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
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
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.6224 3.89402C17.7631 3.75336 17.8421 3.5626 17.8421 3.36369C17.8421 3.16477 17.7631 2.97401 17.6224 2.83336C17.4818 2.6927 17.291 2.61369 17.0921 2.61369C16.8932 2.61369 16.7024 2.6927 16.5618 2.83336L15.7132 3.68188C15.4067 3.98842 15.1946 4.35328 15.0768 4.74254C14.4903 4.42087 13.8285 4.26169 13.1598 4.28145C12.4911 4.30122 11.8398 4.49922 11.2733 4.85497C11.1152 4.54455 11.0593 4.19203 11.1138 3.84792C11.1683 3.50382 11.3303 3.1858 11.5767 2.93942L13.0616 1.4545C13.2022 1.31385 13.2812 1.12308 13.2812 0.924168C13.2812 0.725256 13.2022 0.53449 13.0616 0.393838C12.9209 0.253186 12.7302 0.174168 12.5312 0.174168C12.3323 0.174168 12.1416 0.253186 12.0009 0.393838L10.516 1.87876C9.99869 2.39585 9.67745 3.07684 9.60739 3.80491C9.53733 4.53297 9.72282 5.26272 10.132 5.86897L9.03107 6.96993L6.69762 4.63648C6.55697 4.49583 6.3662 4.41681 6.16729 4.41681C5.96838 4.41681 5.77761 4.49583 5.63696 4.63648C5.49631 4.77713 5.41729 4.9679 5.41729 5.16681C5.41729 5.36572 5.49631 5.55649 5.63696 5.69714L7.97041 8.03059L6.16729 9.83371C6.05274 9.94826 5.94455 10.0671 5.84379 10.189C5.26597 9.75665 4.55164 9.54705 3.8318 9.59868C3.11196 9.65031 2.43486 9.95969 1.92465 10.4701L0.333658 12.0611C0.193006 12.2018 0.113988 12.3925 0.113988 12.5914C0.113988 12.7903 0.193006 12.9811 0.333658 13.1218C0.474311 13.2624 0.665076 13.3414 0.863988 13.3414C1.0629 13.3414 1.25367 13.2624 1.39432 13.1218L2.98531 11.5308C3.26032 11.2554 3.63156 11.0978 4.02064 11.091C4.40973 11.0843 4.7862 11.2291 5.07057 11.4947C4.71002 12.3944 4.62155 13.3802 4.81614 14.3297C5.01073 15.2793 5.4798 16.1508 6.16518 16.8362C6.85056 17.5216 7.72208 17.9906 8.67162 18.1852C9.62116 18.3798 10.6069 18.2913 11.5067 17.9308C11.7723 18.2152 11.917 18.5916 11.9103 18.9807C11.9036 19.3698 11.7459 19.741 11.4706 20.0161L9.8796 21.607C9.73895 21.7477 9.65993 21.9385 9.65993 22.1374C9.65993 22.3363 9.73895 22.527 9.8796 22.6677C10.0203 22.8084 10.211 22.8874 10.4099 22.8874C10.6088 22.8874 10.7996 22.8084 10.9403 22.6677L12.5312 21.0767C13.0417 20.5665 13.3511 19.8894 13.4027 19.1696C13.4543 18.4497 13.2447 17.7354 12.8123 17.1576C12.9359 17.0555 13.0545 16.9476 13.1676 16.8341L14.9708 15.0309L17.3042 17.3644C17.4449 17.5051 17.6356 17.5841 17.8346 17.5841C18.0335 17.5841 18.2242 17.5051 18.3649 17.3644C18.5055 17.2237 18.5846 17.033 18.5846 16.8341C18.5846 16.6352 18.5055 16.4444 18.3649 16.3037L16.0314 13.9703L17.1324 12.8693C17.7386 13.2785 18.4684 13.464 19.1965 13.394C19.9245 13.3239 20.6055 13.0027 21.1226 12.4854L22.6075 11.0004C22.7482 10.8598 22.8272 10.669 22.8272 10.4701C22.8272 10.2712 22.7482 10.0804 22.6075 9.93978C22.4669 9.79913 22.2761 9.72011 22.0772 9.72011C21.8783 9.72011 21.6875 9.79913 21.5469 9.93978L20.0619 11.4247C19.5422 11.9444 18.7637 12.0441 18.1443 11.7281C18.5004 11.1617 18.6987 10.5105 18.7189 9.84187C18.739 9.17319 18.5802 8.51127 18.2588 7.92452C18.659 7.80219 19.0229 7.58327 19.3184 7.28707L20.1669 6.43854C20.3076 6.29789 20.3866 6.10712 20.3866 5.90821C20.3866 5.7093 20.3076 5.51853 20.1669 5.37788C20.0263 5.23723 19.8355 5.15821 19.6366 5.15821C19.4377 5.15821 19.2469 5.23723 19.1063 5.37788L18.2578 6.22641C18.0608 6.42332 17.7938 6.53395 17.5153 6.53395C17.2368 6.53395 16.9697 6.42332 16.7728 6.22641C16.5759 6.0295 16.4653 5.76242 16.4653 5.48395C16.4653 5.20547 16.5759 4.9384 16.7728 4.74148L17.6224 3.89402Z" fill="currentColor"/>
                        </svg>
                        <h2 className="github-issue">Bug</h2>
                    </button>
                    <button
                        className={`feedbackform-cta-btn ${category === 'idea' ? 'button-active' : ''}`}
                        type="button"
                        onClick={() => handleCategoryClick('idea')}
                    >
                        <svg width="18" height="25" viewBox="0 0 18 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3605 17.5625C16.1274 16.0272 18 13.076 18 9.6875C18 4.71694 13.9706 0.6875 9 0.6875C4.02944 0.6875 0 4.71694 0 9.6875C0 13.076 1.87265 16.0272 4.63949 17.5625H13.3605Z" fill="currentColor"/>
                            <rect x="4.5" y="18.6875" width="9" height="2.25" rx="0.5625" fill="currentColor"/>
                            <path d="M11.25 22.0625C11.25 23.3051 10.2426 24.3125 9 24.3125C7.75736 24.3125 6.75 23.3051 6.75 22.0625C6.75 22.0625 10.0074 22.0643 11.25 22.0643V22.0625Z" fill="currentColor"/>
                        </svg>
                        <h2 className="github-issue">Idea</h2>
                    </button>
                    <button
                        className={`feedbackform-cta-btn ${category === 'other' ? 'button-active' : ''}`}
                        type="button"
                        onClick={() => handleCategoryClick('other')}
                    >
                        <svg width="27" height="6" viewBox="0 0 27 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="3.5" cy="3" r="3" fill="currentColor"/>
                            <circle cx="13.5" cy="3" r="3" fill="currentColor"/>
                            <circle cx="23.5" cy="3" r="3" fill="currentColor"/>
                        </svg>
                        <h2 className="github-issue">Other</h2>
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
