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
    <section className="mb-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {posts.map((post, idx) => (
          <iframe
            key={idx}
            src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
              post.href
            )}&show_text=true&width=${post.width ?? 300}`}
            width={post.width ?? 300}
            height={post.height ?? 250}
            style={{ border: 'none', overflow: 'hidden' }}
          />
        ))}
      </div>
    </section>
  );
};