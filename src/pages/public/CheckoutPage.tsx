import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckoutWizard } from '../../components/pages/CheckoutWizard';
import { useData } from '../../app/contexts/DataContext';
import { useAuth } from '../../app/contexts/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subscriptionPlans } = useData();
  const { currentUser } = useAuth();

  const planId = searchParams.get('plano') || 'digital';

  return (
    <CheckoutWizard
      plans={subscriptionPlans}
      selectedPlanId={planId}
      currentUser={currentUser}
      onBack={() => navigate('/planos')}
      onOpenAccount={(sub) => navigate(sub === 'entrar' ? '/minha-conta?tab=entrar' : '/minha-conta')}
    />
  );
}
