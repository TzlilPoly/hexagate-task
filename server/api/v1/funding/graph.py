from typing import List

from fastapi import APIRouter, HTTPException

from api.schema import FundGraphResponse, ChainId, FundGraphEdge
from api.utils import try_parse_obj_as

from api.services import DataService

route = APIRouter(
    prefix="/graph",
)


# Function to recursively find children edges for a given edge
def find_children(root_edge: FundGraphEdge, all_edges: List[FundGraphEdge]) -> List[
    FundGraphEdge]:
    result = []
    children = [edge for edge in all_edges if
                root_edge.dest.chain_id == edge.source.chain_id and root_edge.dest.address == edge.source.address]

    for child in children:
        result.append(child)
        find_children(child, all_edges)
    return result


@route.get("/{chain}/{address}", response_model=FundGraphResponse)
def get_address_graph(address: str, chain: ChainId):

    data = DataService().get_data()

    edges = []
    for item in data:
        edge = try_parse_obj_as(FundGraphEdge, item)
        if edge is not None:
            edges.append(edge)
        else:
            raise HTTPException(status_code=500, detail="Failed to parse edge data")

    fund_graph = FundGraphResponse(edges=edges)

    all_edges = fund_graph.edges

    root_edge = [edge for edge in all_edges if edge.source.address == address and edge.source.chain_id == chain]

    response_edges = root_edge + find_children(root_edge[0], all_edges)

    return FundGraphResponse(edges=response_edges)
