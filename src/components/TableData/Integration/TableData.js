export const data = [
  {
    functionKey: '/export GET',
    description: 'Exports all data for a specific Namespace and Database',
  },
  {
    functionKey: '/health GET',
    description: 'Checks the status of the database server and storage engine',
  },
  {
    functionKey: '/import POST',
    description: 'Imports data into a specific Namespace and Database',
  },
  {
    functionKey: '/key/:table GET',
    description: 'Selects all records in a table from the database',
  },
  {
    functionKey: '/key/:table POST',
    description: 'Creates a records in a table in the database',
  },
  {
    functionKey: '/key/:table DELETE',
    description: 'Deletes all records in a table from the database',
  },
  {
    functionKey: '/key/:table/:id GET',
    description: 'Selects the specific record from the database',
  },
  {
    functionKey: '/key/:table/:id POST',
    description: 'Creates the specific record in the database',
  },
  {
    functionKey: '/key/:table/:id PUT',
    description: 'Updates the specified record in the database',
  },
  {
    functionKey: '/key/:table/:id PATCH',
    description: 'Modifies the specified record in the database',
  },
  {
    functionKey: '/key/:table/:id DELETE',
    description: 'Deletes the specified record from the database',
  },
  {
    functionKey: '/signup POST',
    description: 'Signs-up as a scope user to a specific scope',
  },
  {
    functionKey: '/signin POST',
    description: 'Signs-in as a root, namespace, database, or scope user',
  },
  {
    functionKey: '/sql POST',
    description: 'Allows custom SurrealQL queries',
  },
  {
    functionKey: '/status GET',
    description: 'Applies JSON Patch changes to all records in a table, or a specific record',
  },
  {
    functionKey: '/version GET',
    description: 'Returns the version of the SurrealDB database serverd',
  },
];

