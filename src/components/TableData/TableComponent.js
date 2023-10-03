import React from 'react';
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
              <div className='table-row' key={index}>
                <div className='table-cell'>
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
                      return <RestOfFunction key={idx}>{word}</RestOfFunction>;
                    }).reduce((prev, curr) => [prev, ' ', curr])}
                  </FunctionKeyword>
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
