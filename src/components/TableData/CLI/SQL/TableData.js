export const data = [
  {
    functionKey: '-e / --endpoint',
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
    description: 'Sets the desired namespace into which to import data',
    required: false,
  },
  {
    functionKey: '--db',
    description: 'Sets the desired database into which to import data',
    required: false,
  },
  {
    functionKey: '--pretty',
    description: 'Sets whether database responses should be pretty printed',
    required: false,
  },
  {
    functionKey: '--json',
    description: 'Sets whether to emit results in JSON',
    required: false,
  },
  {
    functionKey: '--multi',
    description: 'Sets whether omitting semicolon causes a newline',
    required: false,
  },
  {
    functionKey: '-h / --help',
    description: 'Prints help',
    required: false,
  }
  
];

