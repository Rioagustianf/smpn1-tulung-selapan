"use client";

import { useState, useEffect } from "react";
import { FileText, MessageSquare, ImageIcon, Users } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  contents: number;
  messages: number;
  gallery: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    contents: 0,
    messages: 0,
    gallery: 0,
    users: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [contentsRes, messagesRes, galleryRes] = await Promise.all([
        fetch("/api/admin/content"),
        fetch("/api/admin/contacts"),
        fetch("/api/admin/gallery"),
      ]);

      const [contents, messages, gallery] = await Promise.all([
        contentsRes.json(),
        messagesRes.json(),
        galleryRes.json(),
      ]);

      setStats({
        contents: contents.length,
        messages: messages.length,
        gallery: gallery.length,
        users: 1,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Konten",
      value: stats.contents,
      icon: FileText,
      color: "bg-blue-600",
    },
    {
      title: "Pesan Masuk",
      value: stats.messages,
      icon: MessageSquare,
      color: "bg-green-600",
    },
    {
      title: "Item Galeri",
      value: stats.gallery,
      icon: ImageIcon,
      color: "bg-purple-600",
    },
    {
      title: "Pengguna Aktif",
      value: stats.users,
      icon: Users,
      color: "bg-orange-600",
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout
        title="Dashboard"
        description="Ringkasan sistem informasi sekolah Anda"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
                <Skeleton className="h-4 w-24 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Ringkasan sistem informasi sekolah Anda"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Konten baru ditambahkan</p>
                  <p className="text-xs text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pesan baru diterima</p>
                  <p className="text-xs text-gray-500">5 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Gambar ditambahkan ke galeri
                  </p>
                  <p className="text-xs text-gray-500">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ringkasan Konten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span>📢</span>
                  <span className="font-medium">Pengumuman</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {Math.floor(stats.contents * 0.4)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span>📰</span>
                  <span className="font-medium">Berita</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {Math.floor(stats.contents * 0.4)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span className="font-medium">Acara</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {Math.floor(stats.contents * 0.2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
