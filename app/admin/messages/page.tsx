"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import MessagesList from "@/components/admin/MessagesList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/admin/contacts");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil pesan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus pesan ini?")) return;
    try {
      await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pesan",
        variant: "destructive",
      });
    }
  };

  const handleToggleRead = async (id: string, read: boolean) => {
    try {
      await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status pesan",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (filter === "read") return msg.read;
      if (filter === "unread") return !msg.read;
      return true;
    })
    .filter((msg) => {
      const q = search.toLowerCase();
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.phone.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q)
      );
    });

  return (
    <AdminLayout
      title="Pesan"
      description="Lihat dan kelola pesan kontak yang masuk"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Semua
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            Belum Dibaca
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
          >
            Sudah Dibaca
          </Button>
        </div>
        <Input
          placeholder="Cari nama/email/isi pesan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada pesan ditemukan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                !msg.read ? "border-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-lg">{msg.name}</div>
                  <div className="text-sm text-gray-600 flex gap-4">
                    <span>{msg.email}</span>
                    <span>{msg.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      msg.read
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {msg.read ? "Sudah Dibaca" : "Belum Dibaca"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4 mb-2 text-gray-800 whitespace-pre-line">
                {msg.message}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant={msg.read ? "outline" : "default"}
                  onClick={() => handleToggleRead(msg._id, !msg.read)}
                >
                  {msg.read ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(msg._id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
