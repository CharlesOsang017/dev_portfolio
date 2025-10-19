import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface User {
    _id: string,
    email: string,
    name: string,
    password: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
}
export interface Skill{
    _id: string;
    logo: string;
    title: string;
    description: string;
}

export interface Experience {
    _id: string;
    company: string;
    role: string;
    startDate: Date;
    endDate: Date;
    description: string[];
  }

  export interface Project {
    _id: string;
    title: string;
    technologies: string[];
    link?: string;
    image?: string | null;
  }

  export interface About {
    _id: string;
    heroImage?: string;
    workImage?: string;
    heroTitle: string;
    heroDescription: string;
    aboutDescription: string;
    projectsCompleted: number;
    yearsOfExperience: number;
  }