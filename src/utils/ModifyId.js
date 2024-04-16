import React, { useEffect } from 'react';

function ModifyIds() {
    useEffect(() => {

        const modifyIds = () => {
            const headers = document.querySelectorAll('h2');
            const substringsToRemove = [
                '-websocket-only', 
                '-since-110', 
                '-since-120', 
                '-since-130', 
                '-since-140'
            ];

            headers.forEach(header => {
                substringsToRemove.forEach(substring => {
                    if (header.id.includes(substring)) {
                        header.id = header.id.replace(substring, '');
                    }
                });
            });
        };

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    modifyIds();
                }
            });
        });
    
        observer.observe(document.body, { childList: true, subtree: true });
    
        return () => observer.disconnect();

    }, []);

    return null;
}

export default ModifyIds;
