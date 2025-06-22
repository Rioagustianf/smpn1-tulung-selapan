"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface GalleryItem {
  _id: string;
  image: string;
  createdAt: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  onEdit: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

export default function GalleryGrid({
  items,
  onEdit,
  onDelete,
}: GalleryGridProps) {
  const [imgError, setImgError] = useState<{ [id: string]: boolean }>({});
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border overflow-hidden group"
        >
          <div className="relative">
            <img
              src={imgError[item._id] ? "/no-image.png" : item.image}
              alt="Gallery Image"
              className="w-full h-48 object-cover"
              onError={() =>
                setImgError((prev) => ({ ...prev, [item._id]: true }))
              }
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(item)}
              >
                <Edit className="w-4 h-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Gallery Item</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this gallery item? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(item._id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
