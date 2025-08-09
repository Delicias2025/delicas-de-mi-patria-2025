import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { getShippingPolicy } from '@/lib/site-content-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShippingPolicyPage() {
  const [policyContent, setPolicyContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const content = getShippingPolicy();
      setPolicyContent(content);
    } catch (error) {
      console.error('Error loading shipping policy:', error);
    } finally {
      setLoading(false);
    }
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
                {policyContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}