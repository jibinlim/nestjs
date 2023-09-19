export class UserDTO {
  id: number;
  email: string;
  name: string;
  password: string;
}

export class Change {
  currentemail: string;
  cngemail: string;
  currentpsw: string;
  cngpsw: string;
}

export class Validation{
  email: string;
  name: string;
}

export class Newtoken{
  newtoken: string;
  email: string;
  name: string;
}
