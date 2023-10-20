export const data = [
    {
      functionKey: 'use [ ns, db ]',
      description: 'Specifies the namespace and database for the current connection',
    },
    {
      functionKey: 'info',
      description: 'Returns the record of an authenticated scope user',
    },
    {
      functionKey: 'signup [ NS, DB, SC, ... ]',
      description: `Signup a user against a scope's SIGNUP method`,
    },
    {
      functionKey: 'signin [ ... ]',
      description: 'Signin a root, NS, DB or SC user against SurrealDB',
    },
    {
      functionKey: 'authenticate [ token ]',
      description: 'Authenticate a user against SurrealDB with a token',
    },
    {
      functionKey: 'invalidate',
      description: `Invalidate a user's session for the current connection`,
    },
    {
      functionKey: 'let [ name, value ]',
      description: 'Define a variable on the current connection',
    },
    {
      functionKey: 'unset [ name ]',
      description: 'Remove a variable from the current connection',
    },
    {
      functionKey: 'live [ table, diff ]',
      description: 'Initiate a live query',
    },
    {
      functionKey: 'kill [ queryUuid ]',
      description: 'Kill an active live query',
    },
    {
      functionKey: 'query [ sql, vars ]',
      description: 'Execute a custom query with optional variables',
    },
    {
      functionKey: 'select [ thing ]',
      description: 'Select either all records in a table or a single record',
    },
    {
      functionKey: 'create [ thing, data ]',
      description: 'Create a record with a random or specified ID',
    },
    {
      functionKey: 'insert [ thing, data ]',
      description: 'Insert one or multiple records in a table',
    },
    {
      functionKey: 'update [ thing, data ]',
      description: 'Replace either all records in a table or a single record with specified data',
    },
    {
      functionKey: 'merge [ thing, data ]',
      description: 'Merge specified data into either all records in a table or a single record',
    },
    {
     functionKey: 'patch [ thing, patches, diff ]',
    description: 'Patch either all records in a table or a single record with specified patches',
      },
      {
        functionKey: 'delete [ thing ]',
        description: 'Delete either all records in a table or a single record',
      },
  ];
  
  