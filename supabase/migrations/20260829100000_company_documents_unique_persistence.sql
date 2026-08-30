-- Company document persistence hardening
-- Prevent duplicate document types within an assessment/company.

CREATE UNIQUE INDEX IF NOT EXISTS assessment_company_documents_natural_key
ON public.assessment_company_documents
(assessment_id, company_id, document_type);
