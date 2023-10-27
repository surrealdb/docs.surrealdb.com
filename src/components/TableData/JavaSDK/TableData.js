export const data = [
  {
    functionKey: 'new SurrealWebSocketConnection(host, port, tls)',
    description: 'Creates a new connection instance. The connection will upgrade the protocol to WebSockets, providing better performance and functionality. This class is used to connect to the database but is not the driver.',
  },
  {
    functionKey: 'SurrealWebSocketConnection.connect(timeout)',
    description: 'Initiates the connection to the database. This is necessary before the driver can be used.',
  },
  {
    functionKey: 'new SyncSurrealDriver(conn)',
    description: 'Creates an instance of the driver to interact with the database remotely.',
  },
  {
    functionKey: 'driver.signIn(user, pass)',
    description: 'Sign in to the database. This is a necessary step before using the database.',
  },
  {
    functionKey: 'driver.signUp(namespace, database, scope, email, password)',
    description: 'Signs up a user to a specific authentication scope.',
  },
  {
    functionKey: 'driver.authenticate(token)',
    description: 'Authenticates the current connection with a JWT token.',
  },
  {
    functionKey: 'driver.invalidate()',
    description: 'Signs this connection in to a specific authentication scope',
  },
  {
    functionKey: 'driver.use(namespace, database)',
    description: 'Switch to a specific namespace and database.',
  },
  {
    functionKey: 'driver.let(key, value)',
    description: 'Set a variable that can be used throughout the database session.',
  },
  {
    functionKey: 'driver.query(query, args, rowType)',
    description: 'Runs a set of SurrealQL statements against the database.',
  },
  {
    functionKey: 'driver.select(thing, rowType)',
    description: 'Selects all records in a table, or a specific record.',
  },
  {
    functionKey: 'driver.create(thing, data)',
    description: 'Creates a record in the database.',
  },
  {
    functionKey: 'driver.update(thing, data)',
    description: 'Updates all records in a table, or a specific record.',
  },
  {
    functionKey: 'driver.change(thing, data, rowType)',
    description: 'Change all records in a table, or a specific record.',
  },
  {
    functionKey: 'driver.patch(thing, patches)',
    description: 'Patch all records in a table, or a specific record.',
  },
  {
    functionKey: 'driver.delete(thing)',
    description: 'Deletes all records, or a specific record.',
  },

];

