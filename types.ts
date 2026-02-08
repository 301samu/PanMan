
export enum Rank {
  MWO = 'MWO (মাঃওঃঅঃ)',
  SWO = 'SWO (সিঃওঃঅঃ)',
  WO = 'WO (ওঃঅঃ)',
  Sgt = 'Sgt (সার্জেন্ট)',
  Cpl = 'Cpl (কর্পোর‌্যাল)',
  LAC = 'LAC (এলএসি)',
  AC = 'AC (এসি)'
}

export enum Trade {
  SecAsstGD = 'Sec Asst (GD) - সেক এসি (জিডি)',
  RadOp = 'Rad Op - র‌্যাডার অপাঃ',
  RadioFit = 'Radio Fit - রেডিও ফিটার',
  LogAsst = 'Log Asst - লগ এসিঃ',
  AdminAsst = 'Admin Asst - এডমিন এসিঃ',
  MTOF = 'MTOF - এমটিওএফ',
  ArmtFitt = 'Armt Fitt - আর্মা ফিঃ',
  EIFitt = 'E&I Fitt - ইএন্ডআই ফিঃ'
}

export enum Flight {
  Admin = 'Admin',
  Ops = 'Ops',
  Radio = 'Radio',
  MTOps = 'MT (Ops)',
  MTRI = 'MT (R&I)',
  Armt = 'Armt',
  Elect = 'Elect',
  Radar = 'Radar'
}

export enum Accom {
  AirmenMess = 'Airmen Mess',
  SgtMess = 'Sgt Mess',
  LOSQ = 'L/O (SQ)',
  LOOA = 'L/O (OA)',
  LOOAT = 'L/O (OAT)'
}

export interface Airman {
  id: string;
  bdNo: string;
  nidNo: string;
  totalChildren: number;
  rank: Rank;
  nameEn: string;
  nameBn: string;
  trade: Trade;
  flight: Flight;
  mobile: string;
  dob: string;
  doe: string;
  arrivalDate: string;
  serviceCategory: 'Above 15 Years' | 'Below 15 Years';
  heightFeet: number;
  heightInches: number;
  bloodGroup: string;
  religion: string;
  isMarried: boolean;
  spouseName?: string;
  accommodation: Accom;
  lOutDate?: string;
  accomAddress: string;
  status: 'active' | 'pending';
  createdAt: number;
  // Dynamic Deployment/Medical Status
  tdyLocation?: string;
  detLocation?: string;
  medCat?: string;
}
