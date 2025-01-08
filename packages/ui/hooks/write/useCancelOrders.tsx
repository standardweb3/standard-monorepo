import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import defaultTokenList from "@standardweb3/default-token-list";
import MatchingEngineABI from "/components/abis/MatchingEngine.json";
import { ChainIds } from "../../enums";

export function useCancelOrders(
  networkName: string,
  args: [string[], string[], boolean[], bigint[]]
) {
  // @ts-ignore
  const matchingEngine = defaultTokenList.matchingEngine[networkName].address;
  const chainId: number = ChainIds[networkName as keyof typeof ChainIds];
  const { data: cancelOrdersData, queryKey: cancelOrdersQueryKey } = useSimulateContract({
    address: matchingEngine,
    abi: MatchingEngineABI,
    chainId,
    functionName: "cancelOrders",
    args,
  });

  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    isError: isWriteError,
    writeContract,
    writeContractAsync,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isTxPending,
    isSuccess: isTxConfirmed,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  return { cancelOrdersData, cancelOrdersQueryKey, isWritePending, isWriteError, writeContract, writeContractAsync, receipt, isTxPending, isTxConfirmed, isTxError, hash };
}
