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