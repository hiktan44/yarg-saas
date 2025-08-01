export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'mahkeme' | 'savcilik' | 'icra' | 'bakanlık';
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'integration' | 'planned';
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  type: CaseType;
  status: CaseStatus;
  institutionId: string;
  assignedJudge: string;
  parties: Party[];
  documents: Document[];
  hearings: Hearing[];
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id: string;
  name: string;
  type: 'plaintiff' | 'defendant' | 'witness' | 'lawyer';
  contactInfo: ContactInfo;
  caseId: string;
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  filePath: string;
  fileSize: number;
  mimeType: string;
  caseId: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Hearing {
  id: string;
  date: string;
  time: string;
  courtroom: string;
  judge: string;
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
  notes: string;
  caseId: string;
  createdAt: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

export type UserRole = 'admin' | 'judge' | 'prosecutor' | 'clerk' | 'viewer';

export type CaseType = 'ceza' | 'hukuk' | 'idari' | 'anayasa';

export type CaseStatus = 
  | 'draft'
  | 'active'
  | 'pending'
  | 'completed'
  | 'archived'
  | 'cancelled';

export type DocumentType = 
  | 'petition'
  | 'evidence'
  | 'judgment'
  | 'appeal'
  | 'correspondence'
  | 'other';

export interface SearchFilters {
  query?: string;
  institution?: string;
  caseType?: CaseType;
  status?: CaseStatus;
  dateFrom?: string;
  dateTo?: string;
  assignedJudge?: string;
}

export interface SearchResult {
  cases: Case[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}