
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
        <p className="text-2xl text-muted-foreground mb-8">{t('pageNotFound')}</p>
        
        <div className="glitch relative text-xl mb-8" data-text="SYSTEM MALFUNCTION">
          SYSTEM MALFUNCTION
        </div>
        
        <Link
          to="/"
          className="px-6 py-3 rounded-md bg-neon-purple/20 hover:bg-neon-purple/30 transition-all duration-300 animate-border-glow"
        >
          {t('backToHome')}
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
