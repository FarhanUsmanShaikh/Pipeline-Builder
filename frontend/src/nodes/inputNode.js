// inputNode.js

import React from 'react';
import BaseNode from '../components/BaseNode';
import { getNodeConfig } from '../utils/nodeConfigs';
import { useStore } from '../store';

export const InputNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const config = getNodeConfig('customInput');
  
  // Set default name based on ID if not provided
  const nodeData = {
    name: data?.name || id.replace('customInput-', 'input_'),
    type: data?.type || 'Text',
    ...data,
  };

  const handleFieldChange = (nodeId, fieldName, fieldValue) => {
    updateNodeField(nodeId, fieldName, fieldValue);
  };

  return (
    <BaseNode
      id={id}
      data={nodeData}
      selected={selected}
      config={config}
      onFieldChange={handleFieldChange}
    />
  );
};
