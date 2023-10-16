import React, { useState } from 'react';
import styled from 'styled-components';

const FunctionKeyword = styled.p`
  font-style: normal;
  color: white;
`;

const DescriptionText = styled.p`
  color: white;
  pointer-events: none;
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

  const extractMethodFromFunctionKey = (functionKey) => {
    let methodWord = functionKey.split(' ').find(word => (word.includes('.') || word.includes('::')) && word.includes('('));
    
    if (methodWord) {
      if (methodWord.includes('.')) {
        return `#${methodWord.split('.')[1].split('(')[0]}`;
      }
      if (methodWord.includes('::')) {
        return `#${methodWord.split('::')[1].split('(')[0]}`;
      }
    }
    return "#";
  };

  return (
    <div>
      <div className='table'>
        <div className='table-header'>
          <div className='table-cell'>Function</div>
          <div className='table-cell'>Description</div>
        </div>
        <div className='table-body'>
          {data.map((item, index) => {
            const words = item.functionKey.split(' ');
            return (
              <div 
                className='table-row' 
                key={index}
                onMouseEnter={() => setHoveredLink(extractMethodFromFunctionKey(item.functionKey))}
              >
                <div className='table-cell'>
                  <a href={hoveredLink}>
                    <FunctionKeyword>
                      {words.map((word, idx) => {
                        if (idx === 0) return <FirstWord key={idx}>{word}</FirstWord>;
                        if (word.includes('.') && word.includes('(')) {
                          const [beforeDot, afterDot] = word.split('.');
                          const [method, params] = afterDot.split('(');
                          return (
                            <span key={idx}>
                              {beforeDot}.<WordAfterDot>{method}</WordAfterDot>({params}
                            </span>
                          );
                        }
                        if (word.includes('::') && word.includes('(')) {
                          const [beforeColon, afterColon] = word.split('::');
                          const [method, params] = afterColon.split('(');
                          return (
                            <span key={idx}>
                              {beforeColon}::<WordAfterDot>{method}</WordAfterDot>({params}
                            </span>
                          );
                        }

                        return <RestOfFunction key={idx}>{word}</RestOfFunction>;
                      }).reduce((prev, curr) => [prev, ' ', curr])}
                    </FunctionKeyword>
                  </a>
                </div>
                <div className='table-cell'>
                  <DescriptionText>{item.description}</DescriptionText>
                </div>          
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default TableComponent;
