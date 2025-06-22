"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GalleryItem {
  _id: string;
  image: string;
  createdAt: string;
}

export default function GalleryManagement() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFile, setAddFile] = useState<File | null>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // State untuk Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/gallery");
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data galeri",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({ title: "Sukses", description: "Gambar berhasil dihapus." });
        fetchGallery();
      } else {
        throw new Error("Gagal menghapus gambar.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus gambar.",
        variant: "destructive",
      });
    }
  };

  const handleOpenAddModal = () => {
    setAddFile(null);
    if (addFileInputRef.current) addFileInputRef.current.value = "";
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!addFile) {
      toast({
        title: "Error",
        description: "File gambar harus dipilih.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", addFile);
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        toast({ title: "Sukses", description: "Gambar berhasil ditambahkan." });
        setIsAddModalOpen(false);
        fetchGallery();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Gagal menambahkan gambar.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setEditFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editFile || !editingItem) {
      toast({
        title: "Error",
        description: "File gambar baru harus dipilih.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", editFile);
      const response = await fetch(`/api/admin/gallery/${editingItem._id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        toast({ title: "Sukses", description: "Gambar berhasil diperbarui." });
        setIsEditModalOpen(false);
        fetchGallery();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Gagal memperbarui gambar.");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
        <Button onClick={handleOpenAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Gambar
        </Button>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Gambar Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <Label htmlFor="add-image">Pilih Gambar</Label>
              <Input
                id="add-image"
                type="file"
                accept="image/*"
                ref={addFileInputRef}
                onChange={(e) => setAddFile(e.target.files?.[0] || null)}
                required
              />
              {addFile && (
                <img
                  src={URL.createObjectURL(addFile)}
                  alt="Preview"
                  className="h-24 mt-2 rounded"
                />
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {editingItem && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ganti Gambar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <Label>Gambar Saat Ini:</Label>
                <img
                  src={editingItem.image}
                  alt="Current"
                  className="h-24 mt-1 rounded border"
                />
              </div>
              <div>
                <Label htmlFor="edit-image">Pilih Gambar Baru</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  ref={editFileInputRef}
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  required
                />
                {editFile && (
                  <img
                    src={URL.createObjectURL(editFile)}
                    alt="New Preview"
                    className="h-24 mt-2 rounded"
                  />
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Memperbarui..." : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {gallery.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada gambar di galeri</p>
        </div>
      ) : (
        <GalleryGrid
          items={gallery}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}
