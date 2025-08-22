"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import HeroSection from "@/components/ui/HeroSection";
import heroKontak from "@/public/herokontak.png";
import { useSettings } from "@/hooks/use-settings";

export default function Kontak() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Pesan Terkirim",
          description: "Terima kasih! Pesan Anda telah berhasil dikirim.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />

      <HeroSection
        title="Kontak Kami"
        subtitle="Jika Memiliki Pertanyaan Bisa Langsung Isi Form Dibawah Ini"
        backgroundImage={heroKontak.src}
      />

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Nama
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Mikasa Ackerman"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="emailkamu@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        No Telp
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+62"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Isi Pesan
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Pesan kamu"
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Mengirim..." : "Kirim"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-green-100 rounded-lg p-8 h-96 flex items-center justify-center"
          >
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
              {/* Google Maps */}
              <iframe
                src="https://www.google.com/maps?q=-3.242738163596475,105.31265919262529&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi SMPN 1 Tulung Selapan"
              ></iframe>
              {/* Overlay Card */}
              <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md flex items-center gap-4 max-w-xs w-full z-10">
                <div className="flex flex-col gap-4">
                  <img
                    src="/herobg.png"
                    alt={settings?.schoolName || "SMPN 1 Tulung Selapan"}
                    className="w-100 h-100 rounded object-cover border"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {settings?.schoolName || "SMPN 1 TULUNG SELAPAN"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {settings?.address ||
                        "Jl. Merdeka, Tulung Selapan, Kab. Ogan Komering Ilir, Sumatera Selatan"}
                    </p>
                    {settings?.phone && (
                      <p className="text-sm text-gray-600 mt-1">
                        📞 {settings.phone}
                      </p>
                    )}
                    {settings?.email && (
                      <p className="text-sm text-gray-600">
                        ✉️ {settings.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
