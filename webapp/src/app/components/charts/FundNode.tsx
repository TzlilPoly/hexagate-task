import {NodeProps, Position, Handle} from 'reactflow';
import {FC} from 'react';
import {ChainAddress} from "@/app/types/chainAddress";

interface AddressNodeData extends ChainAddress {
    readonly isSource?: boolean;
}

const truncate = (input: string, maxLength: number) => input.length > maxLength ? `${input.substring(0, maxLength)}...` : input;

export const FundNode: FC<NodeProps<AddressNodeData>> = node => {
    const {data} = node;
    return (
        <div className="fundNode">
            <Handle type="target" position={Position.Left} isConnectableStart={data.isSource} style={{opacity: 0}}/>
            <div className="content">
                <label className="text bold">{data?.chainId}</label>
                <label className="text">{truncate(data?.address, 19)}</label>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{opacity: 0}}
            />

        </div>
    );
};
