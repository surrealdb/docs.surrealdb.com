import React, { useState, useEffect } from "react";

function Version(): JSX.Element | null {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      const result = await fetch("https://crates.io/api/v1/crates/surrealdb/versions");
      const data = await result.json();

      setVersion(data["versions"][0]["num"]);
    };

    fetchVersion();
  }, []);

  if (!version) {
    return null;
  }

  return <code>v{version}</code>;
}

export default React.memo(Version);