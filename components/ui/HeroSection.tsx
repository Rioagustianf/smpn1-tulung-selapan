'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  buttons?: Array<{
    text: string;
    variant?: 'default' | 'outline';
    onClick?: () => void;
  }>;
}

export default function HeroSection({ 
  title, 
  subtitle, 
  backgroundImage, 
  buttons = [] 
}: HeroSectionProps) {
  return (
    <section className="relative h-96 bg-gradient-to-r from-blue-900/80 to-blue-800/80">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-blue-900/60" />
      
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {subtitle && (
            <p className="text-lg opacity-90 mb-6">{subtitle}</p>
          )}
          {buttons.length > 0 && (
            <div className="flex items-center justify-center space-x-4">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || 'default'}
                  onClick={button.onClick}
                  className={button.variant === 'outline' 
                    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}