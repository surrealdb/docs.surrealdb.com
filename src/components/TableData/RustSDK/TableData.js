export const data = [
  {
    functionKey: 'Surreal::init()',
    description: 'Initialises a static database engine',
  },
  {
    functionKey: 'db.connect(endpoint)',
    description: 'Connects to a specific database endpoint, saving the connection on the static client',
  },
  {
    functionKey: 'Surreal::new::<T>(endpoint)',
    description: 'Connects to a local or remote database endpoint',
  },
  {
    functionKey: 'db.use_ns(namespace).use_db(database)',
    description: 'Switch to a specific namespace and database',
  },
  {
    functionKey: 'db.signup(credentials)',
    description: 'Signs up a user to a specific authentication scope',
  },
  {
    functionKey: 'db.signin(credentials)',
    description: 'Signs this connection in to a specific authentication scope',
  },
  {
    functionKey: 'db.invalidate()',
    description: 'Invalidates the authentication for the current connection',
  },
  {
    functionKey: 'db.authenticate(token)',
    description: 'Authenticates the current connection with a JWT token',
  },
  {
    functionKey: 'db.set(key, val)',
    description: 'Assigns a value as a parameter for this connection',
  },
  {
    functionKey: 'db.query(sql)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'db.select(resource)',
    description: 'Selects all records in a table, or a specific record',
  },
  {
    functionKey: 'db.create(resource).content(data)',
    description: 'Creates a record in the database',
  },
  {
    functionKey: 'db.update(resource).content(data)',
    description: 'Updates all records in a table, or a specific record',
  },
  {
    functionKey: 'db.update(resource).merge(data)',
    description: 'Modifies all records in a table, or a specific record',
  },
  {
    functionKey: 'db.update(resource).patch(data)',
    description: 'Applies JSON Patch changes to all records in a table, or a specific record',
  },
  {
    functionKey: 'db.delete(resource)',
    description: 'Deletes all records, or a specific record',
  },
];

