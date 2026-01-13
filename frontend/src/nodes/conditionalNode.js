// conditionalNode.js

import React from 'react';
import BaseNode from '../components/BaseNode';
import { getNodeConfig } from '../utils/nodeConfigs';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const config = getNodeConfig('conditional');
  
  // Set default values if not provided
  const nodeData = {
    condition: data?.condition || 'input === "true"',
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