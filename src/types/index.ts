export type Student = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_no: string;
};

export type Faculty = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
};

export type Course = {
  id: number;
  name: string;
  code: string;
  credits: number;
};

export type Attendance = {
  id: number;
  student_id: number;
  course_id: number;
  date: string;
  status: string;
};

export type Result = {
  id: number;
  student_id: number;
  course_id: number;
  marks: number;
};

export type Fee = {
  id: number;
  student_id: number;
  amount: number;
  status: string;
};
