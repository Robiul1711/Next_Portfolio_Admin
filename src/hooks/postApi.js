import { useMutation } from "@tanstack/react-query";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";
import {
  showLoadingToast,
  updateToastSuccess,
  updateToastError,
} from "@/lib/utils";

export const useApiMutation = ({
  url = "",                 // default base url for this hook (optional)
  successMessage = "Success!",
  secure = false,
  defaultMethod = "post",   // fallback method if none provided in mutate()
} = {}) => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    // variables arg will be the object you pass to mutate()
    mutationFn: async (variables = {}) => {
      const instance = secure ? axiosSecure : axiosPublic;
      const finalMethod = (variables.method || defaultMethod).toLowerCase();
      const finalUrl = variables.customUrl || url;

      // require a usable URL
      if (!finalUrl) {
        throw new Error("No URL provided for the API request.");
      }

      // DELETE special-case (axios.delete(url, config))
      if (finalMethod === "delete") {
        // If user passed data and backend expects body for delete, send as config.data
        // but most backends expect id in the URL; prefer URL DELETE.
        const config = variables.data ? { data: variables.data } : undefined;
        const res = await instance.delete(finalUrl, config);
        return res.data;
      }

      // For POST/PUT/PATCH, pass data as usual
      if (["post", "put", "patch"].includes(finalMethod)) {
        const res = await instance[finalMethod](finalUrl, variables.data);
        return res.data;
      }

      // For GET or others — if GET, variables.data will be treated as config.params
      if (finalMethod === "get") {
        const res = await instance.get(finalUrl, { params: variables.data });
        return res.data;
      }

      // fallback: try generic call
      const res = await instance[finalMethod](finalUrl, variables.data);
      return res.data;
    },

    onMutate: () => {
      const toastId = showLoadingToast("Processing...");
      return { toastId };
    },

    onSuccess: (response, variables, context) => {
      updateToastSuccess(context.toastId, response?.message || successMessage);
    },

    onError: (error, variables, context) => {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      updateToastError(context.toastId, message);
    },
  });
};
