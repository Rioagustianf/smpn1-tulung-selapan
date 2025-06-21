"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContentItem {
  _id: string;
  title: string;
  content: string;
  type: "announcement" | "news" | "event";
  image?: string;
  createdAt: string;
  featured?: boolean;
}

interface ContentTableProps {
  contents: ContentItem[];
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
}

export default function ContentTable({
  contents,
  onEdit,
  onDelete,
}: ContentTableProps) {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "announcement":
        return "default";
      case "news":
        return "secondary";
      case "event":
        return "outline";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "announcement":
        return "Pengumuman";
      case "news":
        return "Berita";
      case "event":
        return "Acara";
      default:
        return type;
    }
  };

  const handleToggleFeatured = async (content: ContentItem) => {
    try {
      const response = await fetch(`/api/admin/content/${content._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.title,
          content: content.content,
          type: content.type,
          featured: !content.featured,
        }),
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (e) {
      // handle error
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Konten</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Tampil di Beranda</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => (
            <tr key={content._id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{content.title}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(content.type)}>
                  {getTypeLabel(content.type)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {content.content
                  ? content.content.substring(0, 100) + "..."
                  : "-"}
              </TableCell>
              <TableCell>
                {new Date(content.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <input
                  type="checkbox"
                  checked={!!content.featured}
                  onChange={() => handleToggleFeatured(content)}
                  className="w-4 h-4"
                />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(content)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Yakin ingin menghapus?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Konten akan
                          dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(content._id)}
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
