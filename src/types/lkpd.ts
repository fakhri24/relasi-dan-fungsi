export interface ArrowRelation {
  from: string;
  to: string;
}

export interface Case1Answer {
  status: 'Fungsi' | 'Bukan';
  reason: string;
  arrows: ArrowRelation[];
  imageBase64?: string;
  imageUrl?: string;
}

export interface Case2Answer {
  status: 'Fungsi' | 'Bukan';
  violator: string;
  reason: string;
  arrows: ArrowRelation[];
  imageBase64?: string;
  imageUrl?: string;
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
  imageUrl?: string;
}

export interface VltAnswers {
  q1: 'Fungsi' | 'Bukan' | '';
  q2: 'Fungsi' | 'Bukan' | '';
  q3: 'Fungsi' | 'Bukan' | '';
  q4: 'Fungsi' | 'Bukan' | '';
}

export interface LkpdSubmission {
  id?: string;
  meeting?: 1;
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

export interface LinearPlotPoint {
  x: number; // jam (0 - 6)
  y: number; // ribu rupiah (0 - 80)
  label?: string;
}

export interface Lkpd2PhysicalLimits {
  ojol: {
    answer: 'Valid' | 'Mustahil' | '';
    reason: string;
    domainNotation: string;
  };
  baterai: {
    answer: 'Valid' | 'Mustahil' | '';
    reason: string;
    rangeNotation: string;
  };
  lift: {
    answer: 'Valid' | 'Mustahil' | '';
    reason: string;
    dataType: 'Diskrit' | 'Kontinu' | '';
  };
}

export interface Lkpd2SetNotations {
  q1Bracket: string; // misal "[0, 10]"
  q2Inequality: string; // misal "x >= 0"
  q3Interval?: string; // misal "(0, 100)" — selang terbuka/setengah terbuka (opsional untuk data lama)
}

export interface Lkpd2TableRow {
  x: number;
  cost: number | '';
  pointStr: string;
}

export interface Lkpd2LinearModel {
  varX: string; // Durasi sewa (jam)
  varY: string; // Total biaya (Rp)
  paramA: number | ''; // 10.000 (tarif/jam)
  paramB: number | ''; // 20.000 (buka segel)
  formulaText: string; // f(x) = 10.000x + 20.000
  tableRows: Lkpd2TableRow[];
}

export interface Lkpd2PlotData {
  points: LinearPlotPoint[];
  hasLine: boolean;
  imageBase64?: string;
  imageUrl?: string;
}

export interface Lkpd2Submission {
  id?: string;
  meeting: 2;
  classId: string;
  className: string;
  studentName: string;
  submittedAt: string;
  physicalLimits: Lkpd2PhysicalLimits;
  setNotations: Lkpd2SetNotations;
  linearModel: Lkpd2LinearModel;
  plotData: Lkpd2PlotData;
  goldenRule: {
    meaningOfB: string; // Arti fisis b (intercept)
    meaningOfA: string; // Arti fisis a (kemiringan/gradien)
  };
  score?: number | null;
  teacherFeedback?: string;
  gradedAt?: string;
}

export type AnyLkpdSubmission = LkpdSubmission | Lkpd2Submission;

export interface ClassRoster {
  id: string;
  name: string;
  students: string[];
  createdAt: string;
}

