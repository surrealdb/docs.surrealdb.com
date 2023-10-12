export const data = [
    {
      functionKey: ' -e, --endpoint / --conn',
      description: 'Sets the url of the database server to connect to',
      required: false,
    },
    {
      functionKey: '-u / --user',
      description: 'Sets the root, namespace, or database user',
      required: true,
    },
    {
      functionKey: '-p / --pass',
      description: 'Sets the password for the specified user',
      required: true,
    },
    {
      functionKey: '--ns',
      description: 'Sets the desired namespace from which to export data',
      required: true,
    },
    {
      functionKey: '--db',
      description: 'Sets the desired database from which to export data',
      required: true,
    },
  ];
  
  