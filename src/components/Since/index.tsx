
type Version = `v${number}.${number}.${number}`;

interface SinceProps {
    v: Version;
}

const Since: React.FC<SinceProps> = ({ v }) => {
 // Regular expression to validate the version format
    const versionRegex = /^v\d+\.\d+\.\d+$/;

 // Check if the passed version matches the expected format
    if (!versionRegex.test(v)) {
        return <div>Error: Version {v} is not recognized.</div>;
 }

    return <p style={{
        marginTop: '10px',
    }}> <strong>Available since: </strong><code className="version">{v}</code> </p>;
};

export default Since;