import { useEffect, useState } from 'react';

function ModifyIds() {
    const [isHydrated, setHydrated] = useState(false);

    const ModifyIds = () => {
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

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            ModifyIds();

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        ModifyIds();
                    }
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });

            return () => observer.disconnect();
        }
    }, [isHydrated]);

    return null;
}

export default ModifyIds;
