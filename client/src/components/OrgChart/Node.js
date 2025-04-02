import React from 'react';

const Node = ({ nodeData }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ccc', borderRadius: 5, background: '#fff' }}>
      <strong>{nodeData.nodeTitle}</strong>
      <div>{nodeData.nodeContent}</div>
    </div>
  );
};

export default Node;