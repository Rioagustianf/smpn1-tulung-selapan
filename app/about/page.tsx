"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import HeroSection from "@/components/ui/HeroSection";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />

      <HeroSection
        title="Visi dan Misi SMP Negeri 1 Tulung Selapan"
        backgroundImage="/herobg.png"
      />

      {/* Vision & Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-gray-200 shadow-xl rounded-lg"
            >
              <h2 className="text-2xl font-bold text-center text-white mb-6 bg-blue-700 py-3 rounded">
                Visi
              </h2>
              <p className="text-center leading-relaxed p-7">
                Membentuk pembelajar yang akhlakul kariman, berilmu, beretika,
                berwawasan lingkungan untuk menuju pentas dunia.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-gray-200 shadow-xl rounded-lg"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-white bg-blue-700 py-3 rounded">
                Misi
              </h2>
              <ul className="space-y-3 text-sm p-7">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mewujudkan pendidikan dengan keteladanan
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mengembangkan budaya belajar dengan didasari pada kecintaan
                  terhadap ilmu pengetahuan
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Meningkatkan fasilitas sekolah menuju sekolah bersih, sehat
                  dan berwawasan lingkungan
                </li>
              </ul>
            </motion.div>
          </div>

          {/* School Goals 2025 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-3 rounded">
              Tujuan Sekolah Pada Tahun 2025 Diharapkan:
            </h2>
            <div className="space-y-4">
              {[
                "100% Seluruh Guru/Staf memberikan pelayanan, keteladanan kepada para pengguna jasa dengan pendekatan agama, etika, dan budaya",
                "100% Siswa melakukan syariat agama, etika dan budaya baik di Sekolah maupun diluar",
                "90% Fasilitas sekolah mendekati Standar Nasional Pendidikan (SNP)",
                "80% Siswa berprestasi baik ditingkat regional, nasional maupun Global",
              ].map((goal, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{goal}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-3 rounded">
              STRATEGI
            </h2>
            <p className="text-gray-700 text-center leading-relaxed">
              Tiada kekayaan yang paling utama daripada kekayaan jiwa, tiada
              kepapan yang paling menyedihkan daripada kebodohan, dan tiada
              warisan yang paling baik daripada pendidikan.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  );
}
