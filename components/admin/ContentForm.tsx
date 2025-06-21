"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ContentItem {
  _id?: string;
  title: string;
  content: string;
  type: "announcement" | "news" | "event";
  image?: string;
  imageFile?: File | null;
  featured?: boolean;
}

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: Omit<ContentItem, "_id">) => void;
  initialData?: ContentItem;
  isLoading?: boolean;
}

export default function ContentForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: ContentFormProps) {
  const [formData, setFormData] = useState<Omit<ContentItem, "_id">>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    type: initialData?.type || "announcement",
    featured: initialData?.featured || false,
  });

  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      content: initialData?.content || "",
      type: initialData?.type || "announcement",
      featured: initialData?.featured || false,
    });
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      content: "",
      type: "announcement",
      featured: false,
    });
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Konten" : "Buat Konten Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] ">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Masukkan judul konten"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Jenis</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "announcement" | "news" | "event") =>
                handleChange("type", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">Pengumuman</SelectItem>
                <SelectItem value="news">Berita</SelectItem>
                <SelectItem value="event">Acara</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Masukkan deskripsi konten"
              rows={6}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange("featured", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="featured">Tampilkan di Beranda</Label>
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
