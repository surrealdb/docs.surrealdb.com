import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const versions = [
  'v2.0.0', 'v1.5.4', 'v1.5.3', 'v1.5.2', 'v1.5.1', 'v1.5.0',
  'v1.4.2', 'v1.4.0', 'v1.3.1', 'v1.3.0', 'v1.2.2', 'v1.2.1',
  'v1.2.0', 'v1.1.1', 'v1.1.0', 'v1.0.2', 'v1.0.1', 'v1.0.0',
  'v0.3.0', 'v0.2.0', 'v0.1.0'
];

const parseSemVer = (semver) => semver.split('.').map((part) => parseInt(part.replace(/[^0-9]/g, ''), 10));

const getFeatureStatus = (sinceVersion, latestVersion) => {
  const [sinceMajor, sinceMinor] = parseSemVer(sinceVersion);
  const [latestMajor, latestMinor] = parseSemVer(latestVersion);

  if (sinceMajor > latestMajor || (sinceMajor === latestMajor && sinceMinor > latestMinor)) {
    return 'beta';
  }
  if (sinceMajor === latestMajor && sinceMinor === latestMinor) {
    return 'new';
  }
  return 'current';
};

const Since = ({ v }) => {
  const [featureStatus, setFeatureStatus] = useState('current');

  useEffect(() => {
    const latestVersion = versions[0];
    setFeatureStatus(getFeatureStatus(v, latestVersion));
  }, [v]);

  return (
    <span>
      <strong>Added in</strong>
      <code>{v}</code>
      {featureStatus === 'new' && <span style={{ marginLeft: '10px', padding: '3px 6px', backgroundColor: '#28a745', color: '#fff', borderRadius: '3px' }}>New</span>}
      {featureStatus === 'beta' && <span style={{ marginLeft: '10px', padding: '3px 6px', backgroundColor: '#ffc107', color: '#000', borderRadius: '3px' }}>Beta</span>}
    </span>
  );
};

Since.propTypes = {
  v: PropTypes.string.isRequired,
};

export default Since;
