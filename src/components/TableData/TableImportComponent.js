import React, { useState } from 'react';
import styled from 'styled-components';

const FunctionKeyword = styled.p`
  font-style: normal;
  color: white;
`;

const DescriptionText = styled.p`
  color: white;
`;

const FirstWord = styled.span`
  color: #66d9ef;
  margin-right: 10px;
`;

const RestOfFunction = styled.span`
  color: white;
`;

const WordAfterDot = styled.span`
  color: #e6db74;
`;

function TableComponent({ data }) {
  
  const [hoveredLink, setHoveredLink] = useState("#");

  return (
    <div>
      <div className='table'>
        <div className='table-header'>
          <div className='table-cell'>Argument</div>
          <div className='table-cell'>Description</div>
        </div>
        <a href={hoveredLink}>
          <div className='table-body'>
            {data.map((item, index) => {
              const words = item.functionKey.split(' ');
              return (
                <div 
                  className='table-row' 
                  key={index}
                  onMouseEnter={() => setHoveredLink(item.functionKey)}
                >
                  <div className='table-cell'>
                    <FunctionKeyword>{item.functionKey}</FunctionKeyword>
                      <span className='layout-boxes-required'>
                      <required className={item.required ? 'yellow' : 'grey'} r=''>
                        {item.required ? 'REQUIRED' : 'OPTIONAL'}
                      </required>
                    </span>
                  </div>
                  <div className='table-cell'>
                    <DescriptionText>{item.description}</DescriptionText>
                  </div>          
                </div>
              );
            })}
          </div>
        </a>
      </div>
    </div>
  );
}


export default TableComponent;
