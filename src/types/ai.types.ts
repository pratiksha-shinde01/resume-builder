export interface GenerateSummaryBody{
    experienceLevel: string;
    skills: string[];
    jobTitle: string;
    
}

export interface GenarateSkillsBody{
    experienceLevel: string;
    jobTitle: string;
   
}
export interface GenerateProjrctDescriptionBody{
  experienceLevel: string;
  jobTitle: string;
  techStack:string[];
}