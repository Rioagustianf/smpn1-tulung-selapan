"use client";

import { Monitor, Award, Handshake, Building2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import FeatureCard from "@/components/ui/FeatureCard";
import GallerySection from "@/components/ui/GallerySection";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import herobg from "../public/herobg.png";
import chatbot from "../public/robot-assistant.png";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import GalleryGrid from "@/components/admin/GalleryGrid";
import { Card } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  description?: string;
  createdAt: string;
}

interface DownloadableFile {
  _id: string;
  title: string;
  fileUrl: string;
  variant: "outline" | "default";
}

interface ContentItem {
  _id: string;
  title: string;
  content: string;
  type: string;
  image?: string;
  createdAt: string;
  featured?: boolean;
}

export default function Home() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [featuredContents, setFeaturedContents] = useState<ContentItem[]>([]);
  const [downloadableFiles, setDownloadableFiles] = useState<
    DownloadableFile[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchGallery();
    fetchFeaturedContents();
    fetchDownloadableFiles();
    fetchSettings();
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
        description: "Failed to fetch gallery",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedContents = async () => {
    try {
      const response = await fetch("/api/admin/content");
      const data = await response.json();
      setFeaturedContents(data.filter((item: ContentItem) => item.featured));
    } catch (error) {
      // handle error
    }
  };

  const fetchDownloadableFiles = async () => {
    try {
      const response = await fetch("/api/admin/downloadable-files");
      const data: DownloadableFile[] = await response.json();
      setDownloadableFiles(data);
    } catch (error) {
      console.error("Error fetching downloadable files:", error);
      toast({
        title: "Error",
        description: "Failed to fetch downloadable files",
        variant: "destructive",
      });
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleDownloadClick = (fileUrl: string | undefined) => {
    if (fileUrl) {
      setSelectedFileUrl(fileUrl);
      setDialogOpen(true);
    } else {
      toast({
        title: "Info",
        description: "Tidak ada berkas yang tersedia untuk diunduh.",
        variant: "default",
      });
    }
  };

  const confirmDownload = () => {
    if (selectedFileUrl) {
      window.open(selectedFileUrl, "_blank");
    }
    setDialogOpen(false);
    setSelectedFileUrl(null);
  };

  const features = [
    {
      icon: Monitor,
      title: "Fasilitas Lengkap",
      description: "Perangkat belajar dengan kualitas terbaik",
    },
    {
      icon: Building2,
      title: "Lingkungan Nyaman",
      description: "Berada di lingkungan yang nyaman dan asri",
    },
    {
      icon: Award,
      title: "Pengajar Kompeten",
      description: "Guru terbaik dengan pengalaman",
    },
    {
      icon: Handshake,
      title: "Kerja Sama Luas",
      description: "Dapat kesempatan kerja yang lebih terjamin",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen mb-16">
        <div className="absolute inset-0 bg-cover bg-center m-2">
          <Image
            className="w-full min-h-screen rounded-lg"
            src={herobg}
            width={100}
            height={100}
            alt="hero-background"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {downloadableFiles.map((file) => (
                  <Button
                    key={file._id}
                    variant={file.variant}
                    className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => handleDownloadClick(file.fileUrl)}
                  >
                    {file.title}
                  </Button>
                ))}
              </div>

              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Welcome to
                <br />
                <span className="text-blue-300">SMP N 1 Tulung Selapan</span>
              </h1>

              <p className="text-xl mb-8 opacity-90">
                Hemat waktu dan dapatkan informasi maksimal dengan cepat
              </p>

              <div className="flex items-center space-x-4">
                <Link
                  href="/chatbot"
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-8 py-3"
                >
                  <span>Chatbot</span>
                  <Image
                    src={chatbot}
                    alt="chatbot-icon"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="bg-gray-50 w-3/4 mx-auto">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="shadow-2xl rounded-lg mb-12"
          >
            <h2 className="text-2xl rounded-lg text-white p-2 font-bold text-center mb-6 bg-blue-600">
              Informasi
            </h2>
            <div className="space-y-4 text-sm leading-relaxed p-8">
              {featuredContents.length === 0 ? (
                <p className="text-center text-gray-500">
                  Belum ada konten yang ditampilkan
                </p>
              ) : (
                featuredContents.map((item) => (
                  <div key={item._id} className="mb-6">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {item.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className=" w-3/4 mx-auto">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Kenapa Harus{" "}
              <span className="text-blue-600">
                SMP Negeri 1 Tulung Selapan?
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Alasan kenapa harus memilih untuk bergabung dengan SMP N 1 Tulung
              Selapan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 w-3/4 mx-auto">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Galeri Sekolah
          </h2>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No gallery items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {gallery.slice(0, 6).map((item) => (
                <Card
                  key={item._id}
                  className="bg-white rounded shadow p-2 flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    window.open(item.image, "_blank");
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title || "Gallery Image"}
                    className="w-full h-40 object-cover rounded"
                  />
                  {item.title && (
                    <div className="mt-2 text-center font-semibold">
                      {item.title}
                    </div>
                  )}
                  {item.description && (
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Unduhan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengunduh berkas ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFileUrl(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDownload}>
              Ya, Unduh
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
      <Chatbot />
    </div>
  );
}
