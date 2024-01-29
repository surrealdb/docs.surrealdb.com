import React, { useState } from 'react';

function FeedbackForm() {
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [url, setUrl] = useState('');

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
                console.log('Success:', data);
        
                setCategory('');
                setMessage('');
                setUrl('');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        };

    return (
        <form onSubmit={handleSubmit}>
        <div>
            <button type="button" onClick={() => setCategory('issue')}>Issue</button>
            <button type="button" onClick={() => setCategory('idea')}>Idea</button>
            <button type="button" onClick={() => setCategory('other')}>Other</button>
        </div>
        <div>
            <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL where the feedback is from"
            />
        </div>
        <div>
            <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you want us to know?"
            />
        </div>
        <div>
            <button type="submit">Submit Feedback</button>
        </div>
        </form>
    );
}

export default FeedbackForm;
