export interface RegisterBodyInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatedPassword: string;

  isBusinessAccount?: boolean;
  companyName?: string;
  companyWebsite?: string;
}
