// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import styled from 'styled-components';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { DatabaseNode } from './nodes/databaseNode';
import { APINode } from './nodes/apiNode';
import { FilterNode } from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { colors, borderRadius, shadows } from './styles/constants';

import 'reactflow/dist/style.css';

const CanvasContainer = styled.div`
  width: 100vw;
  height: 70vh;
  background: linear-gradient(135deg, ${colors.gray[50]} 0%, ${colors.gray[100]} 50%, ${colors.gray[50]} 100%);
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.xl};
  overflow: hidden;
  box-shadow: ${shadows.lg};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(14, 165, 233, 0.02) 0%, transparent 50%, rgba(14, 165, 233, 0.01) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

const StyledReactFlow = styled(ReactFlow)`
  .react-flow__background {
    background: linear-gradient(135deg, ${colors.gray[50]} 0%, ${colors.gray[100]} 50%, ${colors.gray[50]} 100%);
  }

  .react-flow__controls {
    background: linear-gradient(135deg, ${colors.surface} 0%, ${colors.gray[50]} 100%);
    border: 1px solid ${colors.border};
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.xl};
    bottom: 20px;
    left: 20px;
    backdrop-filter: blur(10px);
  }

  .react-flow__controls-button {
    background: linear-gradient(135deg, ${colors.surface} 0%, ${colors.gray[50]} 100%);
    border-bottom: 1px solid ${colors.border};
    color: ${colors.gray[600]};
    transition: all 0.3s ease-in-out;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.1), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%);
      color: ${colors.primary[600]};
      transform: scale(1.05);
      box-shadow: ${shadows.md};

      &::before {
        left: 100%;
      }
    }

    &:last-child {
      border-bottom: none;
    }

    svg {
      width: 18px;
      height: 18px;
      position: relative;
      z-index: 1;
    }
  }

  .react-flow__minimap {
    background: linear-gradient(135deg, ${colors.surface} 0%, ${colors.gray[50]} 100%);
    border: 1px solid ${colors.border};
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.xl};
    bottom: 20px;
    right: 20px;
    backdrop-filter: blur(10px);
  }

  .react-flow__minimap-mask {
    fill: ${colors.primary[200]};
    fill-opacity: 0.2;
  }

  .react-flow__minimap-node {
    fill: ${colors.primary[400]};
    stroke: ${colors.primary[600]};
    stroke-width: 1;
  }

  .react-flow__edge-path {
    stroke: ${colors.primary[400]};
    stroke-width: 2.5;
    filter: drop-shadow(0 2px 4px rgba(14, 165, 233, 0.2));
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: ${colors.primary[600]};
    stroke-width: 3.5;
    filter: drop-shadow(0 3px 6px rgba(14, 165, 233, 0.3));
  }

  .react-flow__edge:hover .react-flow__edge-path {
    stroke: ${colors.primary[500]};
    stroke-width: 3;
    filter: drop-shadow(0 2px 6px rgba(14, 165, 233, 0.25));
  }

  .react-flow__connection-line {
    stroke: ${colors.primary[400]};
    stroke-width: 2.5;
    stroke-dasharray: 8, 4;
    animation: dash 1.5s linear infinite;
    filter: drop-shadow(0 1px 3px rgba(14, 165, 233, 0.3));
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -12;
    }
  }

  .react-flow__handle {
    border: 2px solid ${colors.surface};
    width: 14px;
    height: 14px;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .react-flow__handle:hover {
    transform: scale(1.4);
    box-shadow: ${shadows.lg};
  }

  .react-flow__handle-connecting {
    background: ${colors.warning} !important;
    transform: scale(1.5);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }

  .react-flow__handle-valid {
    background: ${colors.success} !important;
    transform: scale(1.3);
    box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4);
  }

  .react-flow__node {
    transition: all 0.3s ease-in-out;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
  }

  .react-flow__node:hover {
    transform: translateY(-2px);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  .react-flow__node.selected {
    transform: translateY(-3px);
    filter: drop-shadow(0 6px 12px rgba(14, 165, 233, 0.2));
  }

  .react-flow__selection {
    background: linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.primary[200]} 100%);
    border: 2px solid ${colors.primary[400]};
    border-radius: ${borderRadius.md};
  }

  .react-flow__nodesselection-rect {
    background: linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.primary[200]} 100%);
    border: 2px solid ${colors.primary[400]};
    border-radius: ${borderRadius.md};
  }
`;

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  database: DatabaseNode,
  api: APINode,
  filter: FilterNode,
  transform: TransformNode,
  conditional: ConditionalNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <CanvasContainer ref={reactFlowWrapper}>
            <StyledReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                minZoom={0.2}
                maxZoom={2}
                attributionPosition="bottom-left"
            >
                <Background 
                  color={colors.primary[300]} 
                  gap={gridSize} 
                  size={1.5}
                  variant="dots"
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)'
                  }}
                />
                <Controls 
                  showZoom={true}
                  showFitView={true}
                  showInteractive={true}
                />
                <MiniMap 
                  nodeStrokeColor={colors.primary[600]}
                  nodeColor={colors.primary[400]}
                  nodeBorderRadius={8}
                  maskColor={colors.primary[100]}
                />
            </StyledReactFlow>
        </CanvasContainer>
    )
}
