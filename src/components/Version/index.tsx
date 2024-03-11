import React, { useState, useEffect } from "react";

function Version(): JSX.Element | null {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      const result = await fetch("https://version.surrealdb.com");
      const data = await result.text();
      const text = data?.trim();
      setVersion(data);
    };

    fetchVersion();
  }, []);

  if (!version) {
    return null;
  }

  return <code>{version}</code>;
}

export default React.memo(Version);