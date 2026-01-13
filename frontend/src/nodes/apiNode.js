// apiNode.js

import React from 'react';
import BaseNode from '../components/BaseNode';
import { getNodeConfig } from '../utils/nodeConfigs';
import { useStore } from '../store';

export const APINode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const config = getNodeConfig('api');
  
  // Set default values if not provided
  const nodeData = {
    url: data?.url || 'https://api.example.com/endpoint',
    method: data?.method || 'GET',
    headers: data?.headers || '{"Content-Type": "application/json"}',
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