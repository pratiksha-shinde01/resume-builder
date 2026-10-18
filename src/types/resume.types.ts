import { Types } from "mongoose";

export interface IpersonalInfo {
    fullname: string;
    email: string;
    mobile: string;
    location: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
}

export interface IworkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
}

export interface Iproject {
    title: string;
    description: string;
    techstack: string[];
    githubUrl?: string;
    LiveUrl?: string;
}

export interface Ieducation {
    institution: string;
    degree: string;
    startDate: string;
    endDate?: string;
   
}

export interface IResume {
    _id?: string;
    user_id: Types.ObjectId;
    title: string;
    summary: string;
    personalInfo: IpersonalInfo;
    workExperience: IworkExperience[];
    projects: Iproject[];
    skills: string[];
    education: Ieducation[];
    certifications?: string[];
    createdAt?: Date;
    updatedAt?: Date;

}