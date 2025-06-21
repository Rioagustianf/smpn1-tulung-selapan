"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import GalleryGrid from "@/components/admin/GalleryGrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  description?: string;
  createdAt: string;
}

export default function GalleryManagement() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ imageFile: null as File | null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch("/api/admin/gallery");
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil galeri",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    // TODO: Implement edit functionality
    console.log("Edit item:", item);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item galeri berhasil dihapus",
        });
        fetchGallery();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus item galeri",
        variant: "destructive",
      });
    }
  };

  const handleOpenModal = () => {
    setForm({ imageFile: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setForm((prev) => ({ ...prev, imageFile: file || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageFile) {
      toast({
        title: "Error",
        description: "Gambar diperlukan",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (form.imageFile) formData.append("image", form.imageFile);
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Gambar ditambahkan ke galeri",
        });
        setIsModalOpen(false);
        setForm({ imageFile: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchGallery();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Gagal menambahkan gambar",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan gambar",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Manajemen Galeri"
        description="Kelola foto dan gambar sekolah"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Manajemen Galeri"
      description="Kelola foto dan gambar sekolah"
    >
      <div className="flex justify-end mb-6">
        <Button onClick={handleOpenModal}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Gambar
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Gambar ke Galeri</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image">Gambar</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                required
              />
              {form.imageFile && (
                <img
                  src={URL.createObjectURL(form.imageFile)}
                  alt="Preview"
                  className="h-24 mt-2 rounded"
                />
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Tambah"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {gallery.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada gambar di galeri</p>
        </div>
      ) : (
        <GalleryGrid
          items={gallery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
