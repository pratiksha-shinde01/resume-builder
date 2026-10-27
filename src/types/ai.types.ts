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
      projectTitle:string;

}

export interface GenerateExperianceDescriptionBody{
  experienceLevel: string;
  techStack:string[];
  yearsOfExperience:number;
  jobRole:string
}

export interface ImproveContentBody{
  content: string;
}