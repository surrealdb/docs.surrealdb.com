import React from 'react';

type Version = `v${number}.${number}.${number}`;

interface SinceProps {
    v: Version;
}

const Since: React.FC<SinceProps> = ({ v }) => {

    const version = v.startsWith('v') ? v.slice(1) : v;

    return <div className="version">Since {version}</div>;
};

export default Since;
