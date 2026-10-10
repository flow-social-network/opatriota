import React from 'react';

interface FacebookPostsSectionProps {
  posts: {
    href: string;
    width?: number;
    height?: number;
  }[];
}

export const FacebookPostsSection: React.FC<FacebookPostsSectionProps> = ({
  posts,
}) => {
  return (
    <section className="mb-12 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <iframe
            key={idx}
            src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
              post.href
            )}&show_text=true&width=${post.width ?? 500}`}
            width={post.width ?? 500}
            height={post.height ?? 600}
            style={{ border: 'none', overflow: 'hidden' }}
          />
        ))}
      </div>
    </section>
  );
};