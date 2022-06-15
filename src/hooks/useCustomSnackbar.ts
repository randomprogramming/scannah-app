import React from "react";
import { useSnackbar } from "react-simple-snackbar";

type ISnackBarType = "warning" | "success" | "alert";

const SNACKBAR_DURATION = 3000;

const successSnackbarOptions = {
  position: "top-center",
  style: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
    fontFamily: "poppins",
  },
};

const warningSnackbarOptions = {
  position: "top-center",
  style: {
    backgroundColor: "#f44336",
    color: "#ffffff",
    fontFamily: "poppins",
  },
};

const alertSnackbarOptions = {
  position: "top-center",
  style: {
    backgroundColor: "#d9871c",
    color: "#ffffff",
    fontFamily: "poppins",
  },
};

export const useCustomSnackbar = () => {
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(
    successSnackbarOptions,
  );
  const [openWarningSnackbar, closeWarningSnackbar] = useSnackbar(
    warningSnackbarOptions,
  );
  const [openAlertSnackbar, closeAlertSnackbar] =
    useSnackbar(alertSnackbarOptions);

  const openCustomSnackbar = (message: string, type: ISnackBarType) => {
    switch (type) {
      case "success":
        openSuccessSnackbar(message);

        setTimeout(() => {
          closeSuccessSnackbar();
        }, SNACKBAR_DURATION);
        break;

      case "warning":
        openWarningSnackbar(message);

        setTimeout(() => {
          closeWarningSnackbar();
        }, SNACKBAR_DURATION);
        break;

      case "alert":
        openAlertSnackbar(message);

        setTimeout(() => {
          closeAlertSnackbar();
        }, SNACKBAR_DURATION);

        break;
    }
  };

  return openCustomSnackbar;
};
