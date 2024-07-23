import React from 'react';
import styles from './since.module.css';

const Versions: string[] = [
  'v2.0.0', 'v1.5.4', 'v1.5.3', 'v1.5.2', 'v1.5.1', 'v1.5.0',
  'v1.4.2', 'v1.4.0', 'v1.3.1', 'v1.3.0', 'v1.2.2', 'v1.2.1',
  'v1.2.0', 'v1.1.1', 'v1.1.0', 'v1.0.2', 'v1.0.1', 'v1.0.0',
  'v0.3.0', 'v0.2.0', 'v0.1.0'
];

interface SinceProps {
    v: string;
}

const Since: React.FC<SinceProps> = ({ v }) => {
    if (!Versions.includes(v)) {
        return <div>Error: Version {v} is not recognized.</div>;
    }

    const versionWithoutV = v.startsWith('v') ? v.slice(1) : v;

    return <div className={styles.Version}>Since {versionWithoutV}</div>;
};

export default Since;
