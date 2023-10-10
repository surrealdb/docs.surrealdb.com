import React from 'react';

function CommandHelpComponent({helpData = []}) {
  return (
    <codes vertical=''>
    {helpData.map((item, index) => (
      <div key={index} className='codes'>
        <div>
          <pre>
            <code>
              {item.usageHeading}
            </code>
          </pre>
          <pre>
            <h5>USAGE:</h5>
            <code className='language-txt'>
              {item.usage}
            </code>
          </pre>
          <pre>
            <h5>ARGS:</h5>
            <code className='language-txt'>
              {item.args}
            </code>
          </pre>
        </div>
        <div className='options'>
          <h4>OPTIONS:</h4>
          <div className='option-description-container'>
            {item.options && item.options.map((option, idx) => (
              <div key={idx} className='option-description'>
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
    ))}
    </codes>
  );
}

export default CommandHelpComponent;
