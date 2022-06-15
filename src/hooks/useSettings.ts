import { useEffect } from "react";
import getAllDataFetcher from "src/fetchers/getAllDataFetcher";
import useSWR from "swr";
import {
  ACCOUNT_SETTINGS_URL,
  COMPANY_SETTINGS_URL,
  QR_CODE_SETTINGS_URL,
} from "@definitions/apiEndpoints";
import axios from "axios";

interface ISettings {
  settings: any;
  isLoading: boolean;
  isError: any;
}

export function useAccountSettings(): ISettings {
  const { data, error } = useSWR(ACCOUNT_SETTINGS_URL, getAllDataFetcher);

  useEffect(() => {
    if (error) {
      console.error("Error when fetching account settings: ", error);
    }
  }, [error]);

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function useUpdateAccountSettings(data: any) {
  let status = {
    isError: false,
    message: "",
  };
  try {
    await axios({
      url: ACCOUNT_SETTINGS_URL,
      method: "POST",
      data,
    });

    status = {
      isError: false,
      message: "Account information updated.",
    };
  } catch (err) {
    status = {
      isError: true,
      message: err.response.data.message,
    };
  }

  return status;
}

export function useCompanySettings(): ISettings {
  const { data, error } = useSWR(COMPANY_SETTINGS_URL, getAllDataFetcher);

  useEffect(() => {
    if (error) {
      console.error("Error when fetching company settings: ", error);
    }
  }, [error]);

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export async function useUpdateCompanySettings(data: any) {
  let status = {
    isError: false,
    message: "",
  };
  try {
    await axios({
      url: COMPANY_SETTINGS_URL,
      method: "POST",
      data,
    });

    status = {
      isError: false,
      message: "Company information updated.",
    };
  } catch (err) {
    status = {
      isError: true,
      message: err.response.data.message,
    };
  }

  return status;
}

export async function useUpdateQrCodeSettings(data: any) {
  let status = {
    isError: false,
    message: "",
  };
  try {
    await axios({
      url: QR_CODE_SETTINGS_URL,
      method: "POST",
      data,
    });

    status = {
      isError: false,
      message: "QR Code updated.",
    };
  } catch (err) {
    status = {
      isError: true,
      message: err.response.data.message,
    };
  }

  return status;
}
