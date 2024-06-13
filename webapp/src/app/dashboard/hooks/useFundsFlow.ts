import {ChainAddress} from '@/app/types/chainAddress';
import {Edge, MarkerType, Node} from 'reactflow';
import {getGroupLayout} from "@/app/utils/getGroupLayout";
import {useQuery} from "@tanstack/react-query";
import {getFundingGraph} from "@/app/api/funding";
import {EDGES_TYPES, NODE_TYPES} from "@/app/components/charts";
import {FundingFlowRecord} from "@/app/types/fundingRecord";


type FundsFlowData = {
    readonly isLoading?: boolean;
    readonly nodes: Node[];
    readonly edges: Edge[];
}

type NodeT = {
    id: string;
    data: ChainAddress & { isSource: boolean };
    type: string;
}

type EdgeT = {
    id: string;
    animated: boolean;
    data: FundingFlowRecord;
    selected: boolean;
    source: string;
    target: string;
    type: string;
    markerEnd: {
        type: MarkerType.ArrowClosed,
    }
}

export const useFundsFlow = (sourceAddress: ChainAddress): FundsFlowData => {
    const {isLoading, error, data} = useQuery({
        queryKey: ['funding-graph', sourceAddress.address, sourceAddress.chainId],
        queryFn: () => getFundingGraph(sourceAddress)
    })

    if (error) {
        return {
            isLoading: false,
            edges: [],
            nodes: []
        };
    }

    const nodes = data?.edges.flatMap((edge) => [edge.source, edge.dest])
        .reduce((uniqueNodes: NodeT[], node, index) => {
            const exists = uniqueNodes.some((n) => n.data.address === node.address && n.data.chainId === node.chainId);
            if (!exists) {
                uniqueNodes.push({
                    id: node.address,
                    data: {...node, isSource: node.address === sourceAddress.address},
                    type: NODE_TYPES.FUND_NODE,
                });
            }
            return uniqueNodes;
        }, []) || [];
    const edges = data?.edges
        .reduce((acc: EdgeT[], edge) => {
            acc.push({
                id: `${edge.source.address}->${edge.dest.address}`,
                animated: false,
                data: edge,
                selected: false,
                source: edge.source.address,
                target: edge.dest.address,
                type: EDGES_TYPES.FUND_EDGE,
                markerEnd: {type: MarkerType.ArrowClosed}
            })
            return acc;
        }, []) || [];

    const graph = getGroupLayout(nodes, edges, 'LR');

    return {
        isLoading,
        nodes: graph.nodes,
        edges
    };
};
