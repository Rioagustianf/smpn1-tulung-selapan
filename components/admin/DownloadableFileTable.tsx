"use client";

import { Edit, Trash2, Copy, ExternalLink } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface DownloadableFile {
  _id: string;
  title: string;
  fileUrl: string;
  variant: "outline" | "default";
  createdAt: string;
}

interface DownloadableFileTableProps {
  files: DownloadableFile[];
  onEdit: (file: DownloadableFile) => void;
  onDelete: (id: string) => void;
}

export default function DownloadableFileTable({
  files,
  onEdit,
  onDelete,
}: DownloadableFileTableProps) {
  const { toast } = useToast();

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Disalin!",
      description: "URL file telah disalin ke clipboard.",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Style Tombol</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <tr key={file._id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{file.title}</TableCell>
              <TableCell>
                <Badge variant={file.variant}>{file.variant}</Badge>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-center gap-2">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                  >
                    Lihat File
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(file.fileUrl)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {new Date(file.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(file)}
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
                          Tindakan ini tidak dapat dibatalkan. Berkas akan
                          dihapus secara permanen dari server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(file._id)}>
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
