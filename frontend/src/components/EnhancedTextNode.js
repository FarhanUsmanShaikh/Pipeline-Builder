// EnhancedTextNode.js - Text node with dynamic sizing and variable detection
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/constants';
import { extractVariables, isValidVariableName, calculateTextDimensions } from '../utils/helpers';
import { useStore } from '../store';

const NodeContainer = styled.div`
  background: ${colors.surface};
  border: 2px solid ${props => props.selected ? colors.primary[500] : colors.border};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  padding: ${spacing.md};
  font-family: ${typography.fontFamily.sans.join(', ')};
  transition: all 0.2s ease-in-out;
  position: relative;
  min-width: 200px;
  min-height: 80px;
  
  /* Dynamic sizing based on content */
  width: ${props => Math.max(200, props.contentWidth + 40)}px;
  height: ${props => Math.max(80, props.contentHeight + 60)}px;
  
  &:hover {
    border-color: ${colors.primary[300]};
    box-shadow: ${shadows.lg};
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.sm};
  padding-bottom: ${spacing.sm};
  border-bottom: 1px solid ${colors.gray[200]};
`;

const NodeTitle = styled.h3`
  margin: 0;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[800]};
`;

const NodeIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${borderRadius.sm};
  background: ${colors.gray[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.bold};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: ${spacing.sm};
  border: 1px solid ${colors.gray[300]};
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  font-family: ${typography.fontFamily.sans.join(', ')};
  resize: none;
  transition: border-color 0.2s ease-in-out;
  background: ${colors.gray[50]};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
    background: ${colors.surface};
  }
`;

const StyledHandle = styled(Handle)`
  width: 12px;
  height: 12px;
  border: 2px solid ${colors.surface};
  background: ${props => props.handletype === 'source' ? colors.success : colors.primary[500]};
  
  &:hover {
    transform: scale(1.2);
  }
  
  &.react-flow__handle-connecting {
    background: ${colors.warning};
  }
`;

const VariableIndicator = styled.div`
  position: absolute;
  left: -8px;
  top: ${props => props.top}px;
  width: 4px;
  height: 20px;
  background: ${colors.primary[400]};
  border-radius: 2px;
  opacity: 0.7;
`;

const VariableLabel = styled.div`
  position: absolute;
  left: -60px;
  top: ${props => props.top - 10}px;
  background: ${colors.gray[800]};
  color: white;
  padding: 2px 6px;
  border-radius: ${borderRadius.sm};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
  z-index: 10;
  
  ${NodeContainer}:hover & {
    opacity: 1;
  }
`;

/**
 * EnhancedTextNode - Text node with dynamic sizing and variable detection
 */
export const EnhancedTextNode = ({ id, data = {}, selected = false }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data?.text || '{{input}}');
  const [dimensions, setDimensions] = useState({ width: 200, height: 80 });
  const textAreaRef = useRef(null);

  // Extract variables from text with error handling
  const variables = useMemo(() => {
    try {
      const extracted = extractVariables(text);
      return extracted.filter(isValidVariableName);
    } catch (error) {
      console.warn('Error extracting variables:', error);
      return [];
    }
  }, [text]);

  // Calculate dynamic dimensions based on text content
  useEffect(() => {
    if (textAreaRef.current) {
      const element = textAreaRef.current;
      
      // Create a temporary element to measure text dimensions
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.whiteSpace = 'pre-wrap';
      tempDiv.style.wordWrap = 'break-word';
      tempDiv.style.font = window.getComputedStyle(element).font;
      tempDiv.style.padding = window.getComputedStyle(element).padding;
      tempDiv.style.border = window.getComputedStyle(element).border;
      tempDiv.style.width = '200px'; // Base width
      tempDiv.textContent = text || 'Placeholder text';
      
      document.body.appendChild(tempDiv);
      
      const rect = tempDiv.getBoundingClientRect();
      const newWidth = Math.max(200, Math.min(400, rect.width + 20));
      const newHeight = Math.max(60, rect.height + 10);
      
      document.body.removeChild(tempDiv);
      
      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [text]);

  // Update store when text changes
  useEffect(() => {
    updateNodeField(id, 'text', text);
    updateNodeField(id, 'variables', variables);
  }, [id, text, variables, updateNodeField]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Calculate handle positions for variables
  const getHandlePosition = (index, total) => {
    if (total === 1) return 50; // Center for single handle
    const spacing = 60 / (total + 1); // Distribute evenly in 60% of height
    return 20 + spacing * (index + 1); // Start at 20% from top
  };

  return (
    <NodeContainer 
      selected={selected}
      contentWidth={dimensions.width}
      contentHeight={dimensions.height}
      data-testid={`enhanced-text-node-${id}`}
    >
      {/* Variable input handles */}
      {variables.map((variable, index) => {
        const topPosition = getHandlePosition(index, variables.length);
        return (
          <React.Fragment key={variable}>
            <StyledHandle
              type="target"
              position={Position.Left}
              id={`${id}-${variable}`}
              handletype="target"
              style={{ top: `${topPosition}%` }}
            />
            <VariableIndicator top={topPosition * dimensions.height / 100 - 10} />
            <VariableLabel top={topPosition * dimensions.height / 100}>
              {variable}
            </VariableLabel>
          </React.Fragment>
        );
      })}

      {/* Output handle */}
      <StyledHandle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        handletype="source"
      />

      {/* Node header */}
      <NodeHeader>
        <NodeTitle>Text</NodeTitle>
        <NodeIcon>T</NodeIcon>
      </NodeHeader>

      {/* Text input */}
      <TextArea
        ref={textAreaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text with variables like {{variableName}}"
        style={{ height: `${dimensions.height - 20}px` }}
      />
    </NodeContainer>
  );
};