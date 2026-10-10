
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../../components/AdminDashboard';
import { useData } from '../../app/contexts/DataContext';

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    sources, queueItems, setSources, setQueueItems,
    updateSources, updateQueue, portalSettings, savePortalSettings,
  } = useData();

  return (
    <div className="flex-1">
      <AdminDashboard
        sources={sources}
        queueItems={queueItems}
        onBack={() => navigate('/')}
        onUpdateSource={updateSources}
        onUpdateQueue={updateQueue}
        onSyncResult={(updatedSources, updatedQueue) => {
          setSources(updatedSources);
          setQueueItems(updatedQueue);
        }}
        portalSettings={portalSettings}
        onSavePortalSettings={savePortalSettings}
      />
    </div>
  );
}
