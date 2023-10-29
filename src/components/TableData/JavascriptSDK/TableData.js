export const data = [
  {
    functionKey: 'async db.connect(url, options)',
    description: 'Connects to a local or remote database endpoint',
  },
  {
    functionKey: 'async db.wait()',
    description: 'Waits for the connection to the database to succeed',
  },
  {
    functionKey: 'async db.close()',
    description: 'Closes the persistent connection to the database',
  },
  {
    functionKey: 'async db.use({ ns, db })',
    description: 'Switch to a specific namespace and database',
  },
  {
    functionKey: 'async db.info<T>()',
    description: 'Returns the record of an authenticated scope user',
  },
  {
    functionKey: 'async db.signup(vars)',
    description: 'Signs this connection up to a specific authentication scope',
  },
  {
    functionKey: 'async db.signin(vars)',
    description: 'Signs this connection in to a specific authentication scope',
  },
  {
    functionKey: 'async db.invalidate()',
    description: 'Invalidates the authentication for the current connection',
  },
  {
    functionKey: 'async db.authenticate(token)',
    description: 'Assigns a value as a parameter for this connection',
  },
  {
    functionKey: 'async db.let(key, val)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'async db.unset(key)',
    description: 'Removes a parameter for this connection',
  },
  {
    functionKey: 'async db.live<T>(table, callback, diff)',
    description: 'Initiate a live query',
  },
  {
    functionKey: 'async db.listenLive<T>(queryUuid, callback)',
    description: 'Register a callback for a running live query',
  },
  {
    functionKey: 'async db.kill(queryUuid)',
    description: 'Kill a running live query',
  },
  {
    functionKey: 'async db.query<T>(sql, vars)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'async db.select<T>(thing)',
    description: 'Selects all records in a table, or a specific record',
  },
  {
    functionKey: 'async db.create<T, U>(thing, data)',
    description: 'Creates a record in the database',
  },
  {
    functionKey: 'async db.insert<T, U>(thing, data)',
    description: 'Inserts one or multiple records in the database',
  },
  {
    functionKey: 'async db.update<T, U>(thing, data)',
    description: 'Updates all records in a table, or a specific record',
  },
  {
    functionKey: 'async db.merge<T, U>(thing, data)',
    description: 'Modifies all records in a table, or a specific record',
  },
  {
    functionKey: 'async db.patch(thing, data)',
    description: 'Applies JSON Patch changes to all records in a table, or a specific record',
  },
  {
    functionKey: 'async db.delete<T>(thing)',
    description: 'Deletes all records, or a specific record',
  },
];

