export const data = [
  {
    functionKey: 'Surreal(url)',
    description: 'Surreal is a class that represents a Surreal server.',
  },
  {
    functionKey: 'db.connect()',
    description: 'Connects to a local or remote database endpoint',
  },
  {
    functionKey: 'db.close()',
    description: 'Closes the persistent connection to the database',
  },
  {
    functionKey: 'db.use(ns, db)',
    description: 'Switch to a specific namespace and database',
  },
  {
    functionKey: 'db.signup(vars)',
    description: 'Signs this connection up to a specific authentication scope',
  },
  {
    functionKey: 'db.signin(vars)',
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
    functionKey: 'db.let(key, val)',
    description: 'Assigns a value as a parameter for this connection',
  },
  {
    functionKey: 'db.query(sql, vars)',
    description: 'Runs a set of SurrealQL statements against the database',
  },
  {
    functionKey: 'db.select(thing)',
    description: 'Selects all records in a table, or a specific record',
  },
  {
    functionKey: 'db.create(thing, data)',
    description: 'Creates a record in the database',
  },
  {
    functionKey: 'db.update(thing, data)',
    description: 'Updates all records in a table, or a specific record',
  },
  {
    functionKey: 'db.merge(thing, data)',
    description: 'Modifies by deep merging all records in a table, or a specific record, in the database',
  },
  {
    functionKey: 'db.patch(thing, data)',
    description: 'Applies JSON Patch changes to all records in a table, or a specific record',
  },
  {
    functionKey: 'db.delete(thing)',
    description: 'Deletes all records, or a specific record',
  },
];

