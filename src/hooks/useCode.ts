import { useEffect } from "react";
import getAllDataFetcher from "src/fetchers/getAllDataFetcher";
import useSWR from "swr";
import { CODE_URL } from "@definitions/apiEndpoints";
import { CodeInterface } from "@server/models/Code";

interface ReturnedCode extends CodeInterface {
  isWinningCode: boolean;
}

interface UseCodeReturn {
  codeData: ReturnedCode;
  isLoading: boolean;
  isError: boolean;
}

export default function useCode(codeId: string | undefined): UseCodeReturn {
  const { data, error } = useSWR(
    codeId ? CODE_URL(codeId) : null,
    getAllDataFetcher,
  );

  useEffect(() => {
    if (error) {
      console.error("Error when fetching code: ", error);
    }
  }, [error]);

  return {
    codeData: data,
    isLoading: !error && !data,
    isError: error,
  };
}
