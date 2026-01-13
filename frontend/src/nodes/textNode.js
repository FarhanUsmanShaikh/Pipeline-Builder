// textNode.js

import React from 'react';
import { EnhancedTextNode } from '../components/EnhancedTextNode';

export const TextNode = ({ id, data, selected }) => {
  return (
    <EnhancedTextNode
      id={id}
      data={data}
      selected={selected}
    />
  );
};
