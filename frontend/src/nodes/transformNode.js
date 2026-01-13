// transformNode.js

import React from 'react';
import BaseNode from '../components/BaseNode';
import { getNodeConfig } from '../utils/nodeConfigs';
import { useStore } from '../store';

export const TransformNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const config = getNodeConfig('transform');
  
  // Set default values if not provided
  const nodeData = {
    operation: data?.operation || 'map',
    expression: data?.expression || 'x => x * 2',
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