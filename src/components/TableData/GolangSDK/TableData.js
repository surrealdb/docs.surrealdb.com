export const data = [
  {
    functionKey: 'surrealdb.New(url, options...)',
    description: 'Connects to a remote database endpoint.',
  },
  {
    functionKey: 'db.Close()',
    description: 'Closes the persistent connection to the database.',
  },
  {
    functionKey: 'db.Use(namespace, database)',
    description: 'Switch to a specific namespace and database.',
  },
  {
    functionKey: 'db.Signup(vars)',
    description: 'Switch to a specific namespace and database',
  },
  {
    functionKey: 'db.Signin(vars)',
    description: 'Signs in to a specific authentication scope.',
  },
  {
    functionKey: 'db.Invalidate()',
    description: 'Invalidates the authentication for the current connection',
  },
  {
    functionKey: 'db.Authenticate(token)',
    description: 'Authenticates the current connection with a JWT token',
  },
  {
    functionKey: 'db.Let(key, val)',
    description: 'Assigns a value as a parameter for this connection',
  },
  {
    functionKey: 'db.Query(sql, vars)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'db.Create(thing, data)',
    description: 'Creates a record in the database',
  },
  {
    functionKey: 'db.Select(what)',
    description: 'Selects all records in a table, or a specific record',
  },
  {
    functionKey: 'db.Update(what, data)',
    description: 'Updates all records in a table, or a specific record',
  },
  {
    functionKey: 'db.Change(what, data)',
    description: 'Modifies all records in a table, or a specific record',
  },
  {
    functionKey: 'db.Modify(what, data)',
    description: 'Applies JSON Patch changes to all records in a table, or a specific record',
  },
  {
    functionKey: 'db.Delete(what)',
    description: 'Deletes all records, or a specific record',
  },
  {
    functionKey: 'surrealdb.Unmarshal(data, v)',
    description: 'Unmarshal loads a SurrealDB response into a struct. It is perfectly fine to use this function however it requires casting types.',
  },
  {
    functionKey: 'surrealdb.UnmarshalRaw(rawData, v)',
    description: 'UnmarshalRaw loads a raw SurrealQL response returned by Query into a struct. This is not the same as a query result. The value of this function will include additional information such as execution time and status - details that tend to be omitted from the SurrealQL query the user would be interested in.',
  },
];

