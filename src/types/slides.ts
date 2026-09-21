export interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
}

export interface ProjectTopic {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  domainContext: string;
  rangeContext: string;
  ruleExplanation: string;
  formulaLatex: string;
  defaultInput: number;
  inputUnit: string;
  calculateOutput: (input: number) => { cost: number; breakdown: string; stepDetail: string };
  graphPoints: { x: number; y: number }[];
}
