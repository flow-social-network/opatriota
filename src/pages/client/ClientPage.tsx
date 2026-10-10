import React from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { SubscriberPortal } from '../../components/subscriber/SubscriberPortal';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';

export default function ClientPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subpage: routeSubpage } = useParams<{ subpage?: string }>();
  const { currentUser, setCurrentUser } = useAuth();
  const { articles } = useData();

  // Supports both /minha-conta/:subpage and legacy ?tab=... links.
  const subpage = routeSubpage || searchParams.get('tab') || 'dashboard';
  const requestedNext = searchParams.get('next');
  const safeNext = requestedNext && requestedNext.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : null;

  const handleLogin = (user: NonNullable<typeof currentUser>) => {
    setCurrentUser(user);
    // Return to the originally requested internal page after login.
    if (safeNext) navigate(safeNext, { replace: true });
  };

  return (
    <div className="flex-1">
      <SubscriberPortal
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={() => { setCurrentUser(null); navigate('/'); }}
        onBackToHome={() => navigate('/')}
        articles={articles}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        initialSubpage={subpage}
      />
    </div>
  );
}
