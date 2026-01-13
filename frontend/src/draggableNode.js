// draggableNode.js

import styled from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from './styles/constants';

const NodeCard = styled.div`
  cursor: grab;
  min-width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: ${borderRadius.lg};
  background: linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%);
  color: white;
  box-shadow: ${shadows.md};
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
  font-family: ${typography.fontFamily.sans.join(', ')};
  user-select: none;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    border-color: ${colors.primary[300]};
  }

  &:active {
    cursor: grabbing;
    transform: translateY(0);
    box-shadow: ${shadows.md};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &.customInput {
    background: linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%);
  }

  &.customOutput {
    background: linear-gradient(135deg, ${colors.success} 0%, #059669 100%);
  }

  &.llm {
    background: linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[800]} 100%);
  }

  &.text {
    background: linear-gradient(135deg, ${colors.gray[600]} 0%, ${colors.gray[700]} 100%);
  }

  &.database {
    background: linear-gradient(135deg, ${colors.primary[800]} 0%, ${colors.primary[900]} 100%);
  }

  &.api {
    background: linear-gradient(135deg, ${colors.warning} 0%, #d97706 100%);
  }

  &.filter {
    background: linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%);
  }

  &.transform {
    background: linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%);
  }

  &.conditional {
    background: linear-gradient(135deg, ${colors.warning} 0%, #d97706 100%);
  }
`;

const NodeIcon = styled.div`
  font-size: 24px;
  margin-bottom: ${spacing.xs};
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
`;

const NodeLabel = styled.span`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.025em;
`;

export const DraggableNode = ({ type, label, icon }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <NodeCard
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          {icon && <NodeIcon>{icon}</NodeIcon>}
          <NodeLabel>{label}</NodeLabel>
      </NodeCard>
    );
};