'use client';

import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-slate-800 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Address */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="bg-blue-600 p-3 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Jl. Merdeka Tulung Selapan,<br />
                Ogan Komering Ilir Regency,<br />
                South Sumatra 30655
              </p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start space-x-4"
          >
            <div className="bg-blue-600 p-3 rounded-lg">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Mail Us</h3>
              <p className="text-gray-300 text-sm">
                smpn1tulungselapan@yahoo.com
              </p>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-start space-x-4"
          >
            <div className="bg-blue-600 p-3 rounded-lg">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Telephone</h3>
              <p className="text-gray-300 text-sm">
                083175234544
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-700 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            Copyright © SMP Negeri 1 Tulung Selapan
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}