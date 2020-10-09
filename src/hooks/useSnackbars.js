import { useContext } from "react";

import { SnackbarContext } from "../context/SnackbarContext";

const useSnackbars = () => useContext(SnackbarContext);

export default useSnackbars;
