import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Staff Profile Interface
export interface StaffProfile {
  id?: string;
  userId: string;
  name: string;
  nic: string;
  designation: string;
  dateOfBirth: Date;
  mobileNumber: string;
  appointmentDate: Date;
  email: string;
  workingHistory: Array<{
    name: string;
    place: string;
    duration: string;
  }>;
  profileImageUrl?: string;
  inventory: {
    pcLaptop: boolean;
    lgnAccount: boolean;
    printer: {
      assigned: boolean;
      name?: string;
    };
    router: boolean;
    ups: boolean;
  };
  division?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leave Request Interface
export interface LeaveRequest {
  id?: string;
  staffId: string;
  staffName: string;
  staffDesignation: string;
  leaveType: 'casual' | 'medical' | 'vacation' | 'maternity' | 'emergency';
  numberOfDays: number;
  startDate: Date;
  resumeDate: Date;
  reason: string;
  actingOfficer: string;
  recommendOfficer: string;
  approveOfficer: string;
  status: 'pending' | 'recommended' | 'approved' | 'rejected';
  recommendedAt?: Date;
  approvedAt?: Date;
  recommendationNotes?: string;
  approvalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Division Interface
export interface Division {
  id?: string;
  name: string;
  description: string;
  headId?: string;
  ccId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Document Interface
export interface DocumentRecord {
  id?: string;
  userId: string;
  fileName: string;
  driveFileId: string;
  driveLink: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export class FirestoreService {
  // Staff Profile Operations
  static async createStaffProfile(profile: Omit<StaffProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'staffProfiles'), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateStaffProfile(id: string, updates: Partial<StaffProfile>): Promise<void> {
    await updateDoc(doc(db, 'staffProfiles', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async getStaffProfile(id: string): Promise<StaffProfile | null> {
    const docSnap = await getDoc(doc(db, 'staffProfiles', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as StaffProfile : null;
  }

  static async getStaffProfileByUserId(userId: string): Promise<StaffProfile | null> {
    const q = query(collection(db, 'staffProfiles'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as StaffProfile;
  }

  static async getAllStaffProfiles(): Promise<StaffProfile[]> {
    const querySnapshot = await getDocs(collection(db, 'staffProfiles'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffProfile));
  }

  static async getStaffByDivision(division: string): Promise<StaffProfile[]> {
    const q = query(collection(db, 'staffProfiles'), where('division', '==', division));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffProfile));
  }

  // Leave Request Operations
  static async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'leaveRequests'), {
      ...request,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateLeaveRequest(id: string, updates: Partial<LeaveRequest>): Promise<void> {
    await updateDoc(doc(db, 'leaveRequests', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async getLeaveRequest(id: string): Promise<LeaveRequest | null> {
    const docSnap = await getDoc(doc(db, 'leaveRequests', id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as LeaveRequest : null;
  }

  static async getLeaveRequestsByStaff(staffId: string): Promise<LeaveRequest[]> {
    const q = query(
      collection(db, 'leaveRequests'), 
      where('staffId', '==', staffId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
  }

  static async getLeaveRequestsForApproval(officerId: string): Promise<LeaveRequest[]> {
    const q = query(
      collection(db, 'leaveRequests'),
      where('recommendOfficer', '==', officerId),
      where('status', '==', 'pending')
    );
    const q2 = query(
      collection(db, 'leaveRequests'),
      where('approveOfficer', '==', officerId),
      where('status', '==', 'recommended')
    );
    
    const [recommendSnapshot, approveSnapshot] = await Promise.all([
      getDocs(q),
      getDocs(q2)
    ]);
    
    const recommendRequests = recommendSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
    const approveRequests = approveSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
    
    return [...recommendRequests, ...approveRequests];
  }

  // Division Operations
  static async createDivision(division: Omit<Division, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'divisions'), {
      ...division,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateDivision(id: string, updates: Partial<Division>): Promise<void> {
    await updateDoc(doc(db, 'divisions', id), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async deleteDivision(id: string): Promise<void> {
    await deleteDoc(doc(db, 'divisions', id));
  }

  static async getAllDivisions(): Promise<Division[]> {
    const querySnapshot = await getDocs(collection(db, 'divisions'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Division));
  }

  // Document Operations
  static async createDocumentRecord(document: Omit<DocumentRecord, 'id' | 'uploadedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'documents'), {
      ...document,
      uploadedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async getDocumentsByUser(userId: string): Promise<DocumentRecord[]> {
    const q = query(
      collection(db, 'documents'), 
      where('userId', '==', userId),
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocumentRecord));
  }

  static async deleteDocument(id: string): Promise<void> {
    await deleteDoc(doc(db, 'documents', id));
  }

  // Real-time listeners
  static subscribeToStaffProfiles(callback: (profiles: StaffProfile[]) => void) {
    return onSnapshot(collection(db, 'staffProfiles'), (snapshot) => {
      const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffProfile));
      callback(profiles);
    });
  }

  static subscribeToLeaveRequests(callback: (requests: LeaveRequest[]) => void) {
    return onSnapshot(
      query(collection(db, 'leaveRequests'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
        callback(requests);
      }
    );
  }

  static subscribeToUserLeaveRequests(userId: string, callback: (requests: LeaveRequest[]) => void) {
    const q = query(
      collection(db, 'leaveRequests'),
      where('staffId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest));
      callback(requests);
    });
  }

  // Stats Operations
  static async getStats() {
    const [staffSnapshot, leaveSnapshot, divisionSnapshot] = await Promise.all([
      getDocs(collection(db, 'staffProfiles')),
      getDocs(collection(db, 'leaveRequests')),
      getDocs(collection(db, 'divisions'))
    ]);

    const allLeaves = leaveSnapshot.docs.map(doc => doc.data() as LeaveRequest);
    const activeLeaves = allLeaves.filter(leave => {
      const resumeDate = leave.resumeDate instanceof Timestamp ? leave.resumeDate.toDate() : new Date(leave.resumeDate);
      return leave.status === 'approved' && resumeDate > new Date();
    });
    const pendingApprovals = allLeaves.filter(leave => leave.status === 'pending' || leave.status === 'recommended');

    return {
      totalStaff: staffSnapshot.size,
      activeLeaves: activeLeaves.length,
      pendingApprovals: pendingApprovals.length,
      totalDivisions: divisionSnapshot.size
    };
  }
}