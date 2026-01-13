// llmNode.js

import React from 'react';
import BaseNode from '../components/BaseNode';
import { getNodeConfig } from '../utils/nodeConfigs';
import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const config = getNodeConfig('llm');
  
  // Set default values if not provided
  const nodeData = {
    model: data?.model || 'gpt-3.5-turbo',
    temperature: data?.temperature || 0.7,
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
