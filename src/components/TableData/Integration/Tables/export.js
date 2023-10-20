export const exportTable = [
    {
      functionKey: 'Authorization',
      description: 'Sets the root, namespace, or database authentication data',
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
      description: 'Sets the desired namespace into which to import data',
      required: true,
    },
    {
      functionKey: '--db',
      description: 'Sets the desired database into which to import data',
      required: true,
    },
  ];
  
  