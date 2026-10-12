-- Publicidade: solicitações e auditoria.
-- A aplicação usa opatriota_documents como armazenamento polimórfico PostgreSQL.
-- Esta migração é informativa/versionada e não altera dados existentes.
-- Os documentos são gravados nas coleções advertisingInquiries e advertisingAudit.

CREATE INDEX IF NOT EXISTS idx_opatriota_documents_advertising_inquiries
  ON public.opatriota_documents (collection_name, updated_at DESC)
  WHERE collection_name = 'advertisingInquiries';

CREATE INDEX IF NOT EXISTS idx_opatriota_documents_advertising_audit
  ON public.opatriota_documents (collection_name, updated_at DESC)
  WHERE collection_name = 'advertisingAudit';
