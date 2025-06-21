"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentTable from "@/components/admin/ContentTable";
import ContentForm from "@/components/admin/ContentForm";

interface ContentItem {
  _id: string;
  title: string;
  content: string;
  type: "announcement" | "news" | "event";
  image?: string;
  createdAt: string;
  imageFile?: File | null;
}

export default function ContentManagement() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<
    ContentItem | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch("/api/admin/content");
      const data = await response.json();
      setContents(data);
    } catch (error) {
      console.error("Error fetching contents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch contents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContent = async (
    contentData: Omit<ContentItem, "_id" | "createdAt"> & {
      featured?: boolean;
    }
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: contentData.title,
          content: contentData.content,
          type: contentData.type,
          featured: contentData.featured || false,
        }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Content created successfully",
        });
        setIsFormOpen(false);
        fetchContents();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContent = async (
    contentData: Omit<ContentItem, "_id" | "createdAt"> & {
      featured?: boolean;
    }
  ) => {
    if (!editingContent) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/content/${editingContent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: contentData.title,
          content: contentData.content,
          type: contentData.type,
          featured: contentData.featured || false,
        }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Content updated successfully",
        });
        setIsFormOpen(false);
        setEditingContent(undefined);
        fetchContents();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout
        title="Manajemen Konten"
        description="Kelola pengumuman, berita, dan acara"
      >
        <div className="flex items-center justify-center h-64">
          <div className="rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Manajemen Konten"
      description="Kelola pengumuman, berita, dan acara"
    >
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Konten
        </Button>
      </div>
      <ContentTable
        contents={contents}
        onEdit={setEditingContent}
        onDelete={async (id) => {
          try {
            const response = await fetch(`/api/admin/content/${id}`, {
              method: "DELETE",
            });
            if (response.ok) fetchContents();
          } catch {}
        }}
      />
      <ContentForm
        isOpen={isFormOpen || !!editingContent}
        onClose={() => {
          setIsFormOpen(false);
          setEditingContent(undefined);
        }}
        onSubmit={editingContent ? handleUpdateContent : handleCreateContent}
        initialData={editingContent}
        isLoading={isSubmitting}
      />
    </AdminLayout>
  );
}
