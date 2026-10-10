import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubscriberPortal } from '../../components/subscriber/SubscriberPortal';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';

export default function ClientPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, setCurrentUser } = useAuth();
  const { articles } = useData();

  const subpage = searchParams.get('tab') || 'dashboard';

  return (
    <div className="flex-1">
      <SubscriberPortal
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => { setCurrentUser(null); navigate('/'); }}
        onBackToHome={() => navigate('/')}
        articles={articles}
        onSelectArticle={(a) => navigate(`/noticia/${a.slug}`)}
        initialSubpage={subpage}
      />
    </div>
  );
}
