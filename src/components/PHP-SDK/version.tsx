import React, { useState, useEffect } from "react";

function Version(): JSX.Element | null {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      const result = await fetch("https://repo.packagist.org/p2/surrealdb/surrealdb.php.json");
      const data = await result.json();
      const version = data?.packages?.["surrealdb/surrealdb.php"]?.[0]?.version;
      setVersion(version ?? "Unknown");
    };

    fetchVersion();
  }, []);

  if (!version) {
    return null;
  }

  return <code>{version}</code>;
}

export default React.memo(Version);