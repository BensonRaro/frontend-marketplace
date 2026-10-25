export type UploadEndpoint =
  | "avatarUploader"
  | "portfolioUploader"
  | "attachmentUploader"
  | "deliverableUploader"
  | "messageUploader";
import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const UPLOADTHING_URL = `${API_URL}/api/uploadthing`;

// We need to override the fetch function to include credentials when making requests to our own backend. This is necessary for cookie-based authentication to work properly. The `uploadFetch` function checks if the request URL starts with our backend URL and adds the `credentials: "include"` option accordingly.
const uploadFetch: typeof fetch = async (input, init) => {
  const requestUrl =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const isOwnBackend = requestUrl.startsWith(UPLOADTHING_URL);

  return fetch(input, {
    ...init,
    ...(isOwnBackend
      ? {
          credentials: "include",
        }
      : {}),
  });
};

export const UploadButton = generateUploadButton({
  url: UPLOADTHING_URL,
  fetch: uploadFetch,
});

export const UploadDropzone = generateUploadDropzone({
  url: UPLOADTHING_URL,
  fetch: uploadFetch,
});

export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: UPLOADTHING_URL,
  fetch: uploadFetch,
});
