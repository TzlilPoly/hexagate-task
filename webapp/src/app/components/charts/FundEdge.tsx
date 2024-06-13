import React from 'react';
import {BaseEdge, EdgeProps, getStraightPath,} from 'reactflow';

export function FundEdge(
    {
        sourceX,
        sourceY,
        targetX,
        targetY,
        markerEnd,
    }: EdgeProps) {

    const [edgePath] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    return <BaseEdge path={edgePath} markerEnd={markerEnd}/>;
}
