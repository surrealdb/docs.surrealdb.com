import { useEffect, useState } from 'react';

function ModifyIds() {
    const [isHydrated, setHydrated] = useState(false);

    const ModifyIds = () => {
        const headers = document.querySelectorAll('h2');

        const sinceRegex = /-since-\d+/g;

        headers.forEach(header => {
            if (header.id.includes('-websocket-only')) {
                header.id = header.id.replace('-websocket-only', '');
            }
            
            header.id = header.id.replace(sinceRegex, '');
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
