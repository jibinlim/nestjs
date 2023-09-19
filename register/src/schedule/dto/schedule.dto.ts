export class ScheduleDTO {
  id: number;
  title: string;
  description: string;
  category: string;
  userid: number;
}

export class ScheduleInput {
    email: string;
    date: string;
    title:string;
    description: string;
    category:string;
}

export class ScheduleFind {
    email: string;
    date: string;
}

export class ScheduleUpdate {
    id: number;
    title:string;
    description: string;
    category:string;
}

export class ScheduleDelete {
    id: number;
    email: string;
}