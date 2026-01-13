from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging
from collections import defaultdict, deque

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="VectorShift Pipeline API",
    description="API for processing and analyzing data pipelines",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class NodeData(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any] = Field(default_factory=dict)

class EdgeData(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelineRequest(BaseModel):
    nodes: List[NodeData]
    edges: List[EdgeData]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

def is_directed_acyclic_graph(nodes: List[NodeData], edges: List[EdgeData]) -> bool:
    """
    Check if the given nodes and edges form a directed acyclic graph (DAG).
    Uses Kahn's algorithm for topological sorting.
    """
    try:
        # Create adjacency list and in-degree count
        graph = defaultdict(list)
        in_degree = defaultdict(int)
        
        # Initialize all nodes with in-degree 0
        node_ids = {node.id for node in nodes}
        for node_id in node_ids:
            in_degree[node_id] = 0
        
        # Build graph and calculate in-degrees
        for edge in edges:
            source, target = edge.source, edge.target
            
            # Validate that source and target nodes exist
            if source not in node_ids or target not in node_ids:
                logger.warning(f"Edge references non-existent node: {source} -> {target}")
                continue
                
            graph[source].append(target)
            in_degree[target] += 1
        
        # Kahn's algorithm
        queue = deque([node_id for node_id in node_ids if in_degree[node_id] == 0])
        processed_count = 0
        
        while queue:
            current = queue.popleft()
            processed_count += 1
            
            # Process all neighbors
            for neighbor in graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        # If we processed all nodes, it's a DAG
        is_dag = processed_count == len(node_ids)
        
        logger.info(f"DAG check: processed {processed_count}/{len(node_ids)} nodes, is_dag={is_dag}")
        return is_dag
        
    except Exception as e:
        logger.error(f"Error in DAG detection: {str(e)}")
        # If there's an error, assume it's not a DAG for safety
        return False

def validate_pipeline(pipeline: PipelineRequest) -> None:
    """
    Validate the pipeline structure and data.
    """
    # Check for duplicate node IDs
    node_ids = [node.id for node in pipeline.nodes]
    if len(node_ids) != len(set(node_ids)):
        raise HTTPException(status_code=400, detail="Duplicate node IDs found")
    
    # Check for duplicate edge IDs
    edge_ids = [edge.id for edge in pipeline.edges]
    if len(edge_ids) != len(set(edge_ids)):
        raise HTTPException(status_code=400, detail="Duplicate edge IDs found")
    
    # Validate edge references
    node_id_set = set(node_ids)
    for edge in pipeline.edges:
        if edge.source not in node_id_set:
            raise HTTPException(
                status_code=400, 
                detail=f"Edge source '{edge.source}' references non-existent node"
            )
        if edge.target not in node_id_set:
            raise HTTPException(
                status_code=400, 
                detail=f"Edge target '{edge.target}' references non-existent node"
            )

@app.get('/')
def read_root():
    """Health check endpoint"""
    return {'status': 'healthy', 'message': 'VectorShift Pipeline API is running'}

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse and analyze a pipeline structure.
    
    Returns:
    - num_nodes: Number of nodes in the pipeline
    - num_edges: Number of edges in the pipeline  
    - is_dag: Whether the pipeline forms a directed acyclic graph
    """
    try:
        logger.info(f"Received pipeline with {len(pipeline.nodes)} nodes and {len(pipeline.edges)} edges")
        
        # Validate pipeline structure
        validate_pipeline(pipeline)
        
        # Count nodes and edges
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        # Check if it's a DAG
        is_dag = is_directed_acyclic_graph(pipeline.nodes, pipeline.edges)
        
        # Log node types for debugging
        node_types = {}
        for node in pipeline.nodes:
            node_type = node.type
            node_types[node_type] = node_types.get(node_type, 0) + 1
        
        logger.info(f"Node types: {node_types}")
        logger.info(f"Analysis result: nodes={num_nodes}, edges={num_edges}, is_dag={is_dag}")
        
        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing pipeline: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@app.get('/health')
def health_check():
    """Detailed health check endpoint"""
    return {
        'status': 'healthy',
        'service': 'VectorShift Pipeline API',
        'version': '1.0.0',
        'endpoints': {
            'parse_pipeline': '/pipelines/parse',
            'health': '/health',
            'root': '/'
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
