'use client';
import { motion, animate } from 'framer-motion';
import { useEffect, useRef, useMemo } from 'react';

type StatsSectionProps = Record<string, never>;

interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface Counter {
  count: number;
  node: HTMLSpanElement | null;
}

const StatsSection: React.FC<StatsSectionProps> = () => {
  // Updated stats based on PRD information that are accurate and compelling
  const stats = useMemo<StatItem[]>(() => [
    { value: 5, label: 'Token Types Supported', prefix: '' },
    { value: 99.9, label: 'Platform Uptime Target', suffix: '%' },
    { value: 4, label: 'Target Audience Segments', prefix: '' },
    { value: 5, label: 'Competitive Advantages', prefix: '' },
  ], []);

  const counters = useRef<Array<Counter>>([]).current;

  useEffect(() => {
    const observers = stats.map((stat, i) => {
      return new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && counters[i]?.count !== undefined) {
            animate(0, stat.value, {
              duration: 2,
              onUpdate: (value) => {
                if (counters[i]?.node) {
                  counters[i].node.textContent = 
                    `${stat.prefix || ''}${Number.isInteger(stat.value) ? Math.floor(value) : value.toFixed(1)}${stat.suffix || ''}`;
                }
              },
            });
            
            observers[i].disconnect();
          }
        },
        { threshold: 0.7 }
      );
    });

    counters.forEach((counter, i) => {
      if (counter?.node) {
        observers[i].observe(counter.node);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [stats, counters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <section className="py-16 bg-[#1A0D23] border-t border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={itemVariants}
            >
              <h3 
                className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <span
                  ref={(node) => {
                    if (node && (!counters[index] || counters[index].node !== node)) {
                      counters[index] = { count: 0, node };
                    }
                  }}
                >
                  {stat.prefix || ''}0{stat.suffix || ''}
                </span>
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;