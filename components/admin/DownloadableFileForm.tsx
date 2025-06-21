"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DownloadableFile {
  _id?: string;
  title: string;
  fileUrl: string;
  variant: "outline" | "default";
}

interface DownloadableFileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DownloadableFile, "_id">) => void;
  initialData?: DownloadableFile;
  isLoading?: boolean;
}

export default function DownloadableFileForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: DownloadableFileFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<DownloadableFile, "_id">>({
    title: initialData?.title || "",
    fileUrl: initialData?.fileUrl || "",
    variant: initialData?.variant || "outline",
  });

  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      fileUrl: initialData?.fileUrl || "",
      variant: initialData?.variant || "outline",
    });
    setFile(null);
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let submissionData = { ...formData };

    if (file) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const { fileUrl } = await response.json();
        submissionData.fileUrl = fileUrl;
      } catch (error) {
        console.error(error);
        return;
      }
    }

    onSubmit(submissionData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Berkas" : "Tambah Berkas Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tampilan</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Surat Edaran PPDB"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variant">Style Tombol</Label>
            <Select
              value={formData.variant}
              onValueChange={(value: "outline" | "default") =>
                handleChange("variant", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="default">Default</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File Berkas</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required={!initialData}
            />
            {formData.fileUrl && !file && (
              <p className="text-sm text-gray-500 mt-1">
                File saat ini:{" "}
                <a
                  href={formData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lihat File
                </a>
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : initialData ? "Perbarui" : "Buat"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
