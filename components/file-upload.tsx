"use client";
import { AlertCircle, FileIcon, X } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { useCallback, useEffect, useState } from "react";
import { create } from "domain";
import { ourFileRouter } from "../app/api/uploadthing/core";
import { createRouteHandler } from "uploadthing/next";
interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}
export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [uploadError, setUploadError] = useState(""); // State to track upload error

  const fileType = value?.split(".").pop();

  // Handle upload error
  const handleUploadError = (error: Error) => {
    setUploadError(
      `File size is huge.Please upload a file that is less than 4MB.`
    );
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  // Clear upload error
  const clearUploadError = () => {
    setUploadError("");
  };

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      {uploadError && ( // Conditionally render alert if upload error exists
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-center">Error</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      <UploadDropzone
        className="bg-slate-100 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 border-2 border-dashed border-slate-400 rounded-md p-4 mt-2"
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
          clearUploadError(); // Clear upload error on successful upload
        }}
        onUploadError={handleUploadError} // Pass handleUploadError function
      />
    </>
  );
};
