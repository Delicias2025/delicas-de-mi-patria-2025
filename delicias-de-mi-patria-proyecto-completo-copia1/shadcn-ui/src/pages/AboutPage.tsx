import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { getAboutUs } from '@/lib/site-content-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAboutContent = () => {
      try {
        // Force refresh by clearing any cached data
        const content = getAboutUs();
        console.log('🔄 Loading about content:', content.substring(0, 100) + '...');
        setAboutContent(content);
      } catch (error) {
        console.error('Error loading about us content:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load initial data
    loadAboutContent();

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      console.log('📱 Storage changed:', e.key);
      if (e.key === 'site-content') {
        setLoading(true);
        loadAboutContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the admin panel
    const handleContentUpdate = () => {
      console.log('🔔 Content update event received');
      setLoading(true);
      loadAboutContent();
    };
    
    window.addEventListener('contentUpdated', handleContentUpdate);

    // Force reload every 2 seconds to ensure updates are caught
    const intervalId = setInterval(() => {
      loadAboutContent();
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contentUpdated', handleContentUpdate);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <>
              <Skeleton className="h-12 w-3/4 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-1/2 mt-8 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </>
          ) : (
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-primary">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
              >
                {aboutContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}