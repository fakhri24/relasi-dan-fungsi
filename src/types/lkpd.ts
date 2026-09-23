export interface ArrowRelation {
  from: string;
  to: string;
}

export interface Case1Answer {
  status: 'Fungsi' | 'Bukan';
  reason: string;
  arrows: ArrowRelation[];
  imageBase64?: string;
}

export interface Case2Answer {
  status: 'Fungsi' | 'Bukan';
  violator: string;
  reason: string;
  arrows: ArrowRelation[];
  imageBase64?: string;
}

export interface Case3CustomAnswer {
  setAName: string;
  setBName: string;
  elementsA: string[];
  elementsB: string[];
  arrows: ArrowRelation[];
  status: 'Fungsi' | 'Bukan';
  reason: string;
  imageBase64?: string;
}

export interface VltAnswers {
  q1: 'Fungsi' | 'Bukan' | '';
  q2: 'Fungsi' | 'Bukan' | '';
  q3: 'Fungsi' | 'Bukan' | '';
  q4: 'Fungsi' | 'Bukan' | '';
}

export interface LkpdSubmission {
  id?: string;
  classId: string;
  className: string;
  studentName: string;
  submittedAt: string;
  case1: Case1Answer;
  case2: Case2Answer;
  case3: Case3CustomAnswer;
  vlt: VltAnswers;
  goldenRule: {
    noSingle: string; // Tidak boleh jomblo artinya...
    noAffair: string; // Tidak boleh mendua artinya...
  };
  score?: number | null;
  teacherFeedback?: string;
  gradedAt?: string;
}

export interface ClassRoster {
  id: string;
  name: string;
  students: string[];
  createdAt: string;
}
