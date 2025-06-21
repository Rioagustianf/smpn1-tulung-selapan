"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import DownloadableFileTable from "@/components/admin/DownloadableFileTable";
import DownloadableFileForm from "@/components/admin/DownloadableFileForm";

interface DownloadableFile {
  _id: string;
  title: string;
  fileUrl: string;
  variant: "outline" | "default";
  createdAt: string;
}

export default function DownloadableFileManagement() {
  const [files, setFiles] = useState<DownloadableFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<
    DownloadableFile | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/admin/downloadable-files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFile = async (
    fileData: Omit<DownloadableFile, "_id" | "createdAt">
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/downloadable-files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileData),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "File created successfully",
        });
        setIsFormOpen(false);
        fetchFiles();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFile = async (
    fileData: Omit<DownloadableFile, "_id" | "createdAt">
  ) => {
    if (!editingFile) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/downloadable-files/${editingFile._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        }
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "File updated successfully",
        });
        setIsFormOpen(false);
        setEditingFile(undefined);
        fetchFiles();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update file",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      await fetch(`/api/admin/downloadable-files/${id}`, {
        method: "DELETE",
      });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      fetchFiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Kelola Berkas Unduhan"
        description="Atur berkas yang dapat diunduh dari halaman depan"
      >
        <div className="flex items-center justify-center h-64">
          <div className="rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Kelola Berkas Unduhan"
      description="Atur berkas yang dapat diunduh dari halaman depan"
    >
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Berkas
        </Button>
      </div>
      <DownloadableFileTable
        files={files}
        onEdit={(file) => {
          setEditingFile(file);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteFile}
      />
      <DownloadableFileForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFile(undefined);
        }}
        onSubmit={editingFile ? handleUpdateFile : handleCreateFile}
        initialData={editingFile}
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
