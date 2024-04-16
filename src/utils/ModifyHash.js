import { useEffect } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';

function ModifyHash() {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        let modified = false;
        let newHash = location.hash;
        const substringsToRemove = ["-websocket-only", "-since-110", "-since-120", "-since-130", "-since-140"];

        substringsToRemove.forEach(substring => {
            const regex = new RegExp(substring, 'g');
            if (newHash.includes(substring)) {
                newHash = newHash.replace(regex, "");
                modified = true;
            }
        });
        
        if (modified && newHash !== location.hash) {
            history.replace({ ...location, hash: newHash });
        }
    }, [location, history]);

    return null;
}

export default ModifyHash;
