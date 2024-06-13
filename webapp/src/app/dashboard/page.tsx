'use client';

import {AddressType, ChainAddress, ChainIds} from '@/app/types/chainAddress';
import FlowChart from "@/app/components/charts/FlowChart";
import {Spinner} from "@/app/components/spinner/Spinner";
import {useFundsFlow} from "@/app/dashboard/hooks/useFundsFlow";

const sourceChainAddress: ChainAddress = {
    address: '0x39cd23328b5ba304ae70bb0c1866e224f727f962',
    chainId: ChainIds.EthereumMainnet,
    type: AddressType.EOA,
};

export default function Dashboard() {

    const {isLoading, nodes, edges} = useFundsFlow(sourceChainAddress);

    if (nodes?.length === 0 && edges?.length === 0) {
        return null;
    }

    return <div className="flowChartContainer">
        {isLoading ? <Spinner/> : <FlowChart nodes={nodes} edges={edges} onNodesChange={() => {
        }} onEdgesChange={() => {
        }}/>}</div>

}
