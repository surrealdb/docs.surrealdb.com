export const data = [
  {
    functionKey: 'new SurrealDbClient(endpoint)',
    description: 'Creates a new client, detecting the right protocol from the endpoint',
  },
  {
    functionKey: 'SurrealDbHttpClient.New(host)',
    description: 'Initialises a client using HTTP protocol',
  },
  {
    functionKey: 'SurrealDbHttpsClient.New(host)',
    description: 'Initialises a client using HTTPS protocol',
  },
  {
    functionKey: 'SurrealDbWsClient.New(host)',
    description: 'Initialises a client using WS protocol',
  },
  {
    functionKey: 'SurrealDbWssClient.New(host)',
    description: 'Initialises a client using WSS protocol',
  },
  {
    functionKey: 'db.Configure(ns, db, credentials)',
    description: 'Configures the client to use a specific namespace and database, with credentials',
  },
  {
    functionKey: 'await db.Connect()',
    description: 'Connects the client to the underlying endpoint, also improving performance to avoid cold starts',
  },
  {
    functionKey: 'await db.Use(ns, db)',
    description: 'Switch to a specific namespace and database',
  },
  {
    functionKey: 'await db.SignUp(credentials)',
    description: 'Signs up a user to a specific authentication scope',
  },
  {
    functionKey: 'await db.SignIn(credentials)',
    description: 'Signs this connection in to a specific authentication scope',
  },
  {
    functionKey: 'await db.Authenticate(jwt)',
    description: 'Authenticates the current connection with a JWT token',
  },
  {
    functionKey: 'await db.Invalidate()',
    description: 'Invalidates the authentication for the current connection',
  },
  {
    functionKey: 'await db.Set(key, value)',
    description: 'Assigns a value as a parameter for this connection',
  },
  {
    functionKey: 'await db.Unset(key)',
    description: 'Removes a parameter for this connection',
  },
  {
    functionKey: 'async db.query<T>(sql, vars)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'await db.Query(sql, params)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'await db.Select(resource)',
    description: 'await db.Create(resource, data)',
  },
  {
    functionKey: 'await db.Create(resource, data)',
    description: 'Creates a record in the database',
  },
  {
    functionKey: 'await db.Upsert(data)',
    description: 'Creates or updates a specific record',
  },
  {
    functionKey: 'await db.Merge(resource, data)',
    description: 'Modifies all records in a table, or a specific record',
  },
  {
    functionKey: 'await db.Delete(resource)',
    description: 'Deletes all records, or a specific record',
  },
  {
    functionKey: 'await db.Version()',
    description: 'Retrieves the version of the SurrealDB instance',
  },
  {
    functionKey: 'await db.Health()',
    description: 'Checks the status of the database server and storage engine',
  },
];

