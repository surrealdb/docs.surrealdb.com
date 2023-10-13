import React from 'react';
import commandData from './commandData.json';

function CommandHelp() {
  const {
    commandLine,
    usageHeading,
    usage,
    args,
    options,
    database,
    authentication,
    Datastore_connection,
    http_server,
    capabilities,
  } = commandData;

  return (
    <codes vertical=''>
      <div className='codes'>
        <div>
          <pre>
            <code>
              {usageHeading}
            </code>
          </pre>
          <pre>
            <h5>USAGE:</h5>
            <code className='language-txt'>
              {usage}
            </code>
          </pre>
          <pre>
            <h5>ARGS:</h5>
            <code className='language-txt'>
              {args}
            </code>
          </pre>
        </div>
        <div className='options'>
          <h4>OPTIONS:</h4>
          <div className='option-description-container'>
            {options.map((option, index) => (
              <div key={index} className='option-description'>
                <div className='option-column'>
                  <span className='option-align'>{option.option}</span>
                </div>
                <div className='option-column'>
                  <span className='option-desc-align'>{option.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='options'>
          <h4>DATABASE:</h4>
          <div className='option-description-container'>
            {database.map((database, index) => (
              <div key={index} className='option-description'>
                <div className='option-column'>
                  <span className='option-align'>{database.database}</span>
                </div>
                <div className='option-column'>
                  <span className='option-desc-align'>{database.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='options'>
          <h4>AUTHENTICATION:</h4>
          <div className='option-description-container'>
            {authentication.map((authentication, index) => (
              <div key={index} className='option-description'>
                <div className='option-column'>
                  <span className='option-align'>{authentication.authentication}</span>
                </div>
                <div className='option-column'>
                  <span className='option-desc-align'>{authentication.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className='options'>
          <h4>DATASTORE CONNECTION:</h4>
          <div className='option-description-container'>
            {Datastore_connection.map((Datastore_connection, index) => (
              <div key={index} className='option-description'>
                <div className='option-column'>
                  <span className='option-align'>{Datastore_connection.Datastore_connection}</span>
                </div>
                <div className='option-column'>
                  <span className='option-desc-align'>{Datastore_connection.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='options'>
          <h4>HTTP SERVER:</h4>
          <div className='option-description-container'>
            {http_server.map((http_server, index) => (
              <div key={index} className='option-description'>
                <div className='option-column'>
                  <span className='option-align'>{http_server.http_server}</span>
                </div>
                <div className='option-column'>
                  <span className='option-desc-align'>{http_server.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='options'>
          <h4>CAPABILITIES:</h4>
          <div className='option-description-container'>
            {capabilities.map((capabilities, index) => (
              <div key={index} className='option-description'>
                <div className='option-column'>
                  <span className='option-align'>{capabilities.capabilities}</span>
                </div>
                <div className='option-column'>
                  <span className='option-desc-align'>{capabilities.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </codes>
  );
}

export default CommandHelp;
