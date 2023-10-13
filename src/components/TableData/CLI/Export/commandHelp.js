import React from 'react';
import commandData from './commandData.json';

function CommandHelp() {
  const {
    commandLine,
    usageHeading,
    usage,
    args,
    options,
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

      </div>
    </codes>
  );
}

export default CommandHelp;
