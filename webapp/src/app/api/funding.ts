"use client";

import { ChainAddress } from '@/app/types/chainAddress';
import { FundingResData } from '@/app/types/fundingRecord';
const API_URL = 'http://localhost:8000/api/v1'


export const getFundingGraph = async (source: ChainAddress): Promise<FundingResData> => {
    return new Promise<FundingResData>((resolve, reject) => {
        try {
            const url = `${API_URL}/funding/graph/${source.chainId}/${source.address}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch funding graph: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((responseData: FundingResData) => {
                    resolve(responseData);
                })
                .catch(error => {
                    console.error('Error fetching funding graph:', error);
                    reject(error);
                });
        } catch (error) {
            console.error('Error fetching funding graph:', error);
            reject(error);
        }
    })
};