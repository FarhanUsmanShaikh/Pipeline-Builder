// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {}, // Initialize nodeIDs object
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        // Validate node before adding
        if (!node.id || !node.type) {
            console.error('Invalid node: missing id or type', node);
            return;
        }
        
        // Check if node with same ID already exists
        const existingNode = get().nodes.find(n => n.id === node.id);
        if (existingNode) {
            console.warn('Node with ID already exists:', node.id);
            return;
        }
        
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      // Validate connection before adding
      const sourceNode = get().nodes.find(node => node.id === connection.source);
      const targetNode = get().nodes.find(node => node.id === connection.target);
      
      if (!sourceNode || !targetNode) {
        console.warn('Invalid connection: source or target node not found');
        return;
      }
      
      // Prevent self-connections
      if (connection.source === connection.target) {
        console.warn('Invalid connection: cannot connect node to itself');
        return;
      }
      
      // Check if connection already exists
      const existingConnection = get().edges.find(edge => 
        edge.source === connection.source && 
        edge.target === connection.target &&
        edge.sourceHandle === connection.sourceHandle &&
        edge.targetHandle === connection.targetHandle
      );
      
      if (existingConnection) {
        console.warn('Connection already exists');
        return;
      }
      
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));
