"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "uploading" | "analyzed" | "pending" | "error";
  size: string;
  file?: File;
  extractedText?: string;
  category?: string;
  selected?: boolean;
  pdfData?: any;
}

interface FileContextType {
  uploadedFiles: UploadedFile[];
  addFile: (file: File, category?: string, pdfData?: any) => Promise<void>;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: UploadedFile["status"]) => void;
  updateFileText: (id: string, text: string) => void;
  toggleFileSelection: (id: string) => void;
  getSelectedFiles: () => UploadedFile[];
  clearAllFiles: () => void;
  isUploading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFile = useCallback(async (file: File, category?: string, pdfData?: any) => {
    console.log("Adding file:", file.name, "Category:", category);
    const fileId = `file-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      type: getFileType(file.name),
      uploadDate: new Date().toISOString().split("T")[0],
      status: "analyzed",
      size: fileSize,
      file,
      category,
      selected: false,
      extractedText: `File: ${file.name} (${fileSize})`,
      pdfData,
    };

    setUploadedFiles((prev) => [...prev, newFile]);
    console.log("File added successfully:", file.name);
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  }, []);

  const updateFileStatus = useCallback(
    (id: string, status: UploadedFile["status"]) => {
      setUploadedFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, status } : file))
      );
    },
    []
  );

  const updateFileText = useCallback((id: string, text: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, extractedText: text } : file
      )
    );
  }, []);

  const toggleFileSelection = useCallback((id: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    );
  }, []);

  const getSelectedFiles = useCallback(() => {
    return uploadedFiles.filter((file) => file.selected);
  }, [uploadedFiles]);

  const clearAllFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  const value: FileContextType = {
    uploadedFiles,
    addFile,
    removeFile,
    updateFileStatus,
    updateFileText,
    toggleFileSelection,
    getSelectedFiles,
    clearAllFiles,
    isUploading,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

// Helper function to determine file type based on extension
const getFileType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "PDF Document";
    case "doc":
    case "docx":
      return "Word Document";
    case "txt":
      return "Text Document";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "tiff":
      return "Image";
    default:
      return "Document";
  }
};
