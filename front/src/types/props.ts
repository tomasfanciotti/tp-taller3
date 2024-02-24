import { User } from "./auth";

export interface UserProps {
  user: User;
}

export interface PetProps {
  name: string;
  type: string;
  id?: number;
  owner_id?: number;
  birthdate: Date;
}

export interface PetPropsResponse {
  name: string;
  type: string;
  id?: number;
  owner_id?: string;
  birth_date: string;
  register_date: string;
  img_url?: string;
}

export interface Comment {
  "date_added": string;
  "information": string;
  "owner": string;
}
export interface Treatment {
  "applied_to": number;
  "comments": Array<Comment>;
  "date_end": string;
  "date_start": string;
  "id": string;
  "next_dose": string;
  "type": string;
  description: string;
}

export type ResponseForm = {
  fullname: string;
  city: string;
  phoneNumber: number;
  registration_number: number;
  register_date: string;
}

export type UserRequestProps = {
  fullname: string,
  email: string,
  city: string,
  id: string,
  phoneNumber: number,
  birthday: string,
  register_date: string,
  telegram_id: number,
  registration_number: number;
}

export type Application = {
  applied_to: number,
  date: string,
  name: string,
  treatment_id?: string,
  type: string,
  id: string,
}
