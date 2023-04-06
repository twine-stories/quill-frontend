import React from 'react';

const TwoColumnLayout = ({ leftComponent, rightComponent }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: '0 0 70%', marginRight: '5%' }}>
        {leftComponent}
      </div>
      <div style={{ flex: '0 0 30%' }}>
        {rightComponent}
      </div>
    </div>
  );
};

export default TwoColumnLayout;