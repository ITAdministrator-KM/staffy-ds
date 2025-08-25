You are an expert full-stack developer assistant.  
Scaffold and build a fully functional web + mobile app called **Staffy** for internal staff management.  
Use **React (with Tailwind)** for frontend, **Firebase Authentication** for login & password reset, **Firestore** for data storage, and **Firebase Data Connect** for GraphQL + connectors.  

Follow these steps carefully in the given order:  

---

🏗️ Step 1: Scaffold App Structure  
- Create folder structure:  
  - `/components`  
  - `/pages` (Dashboard, Staff Profile, Leave, Documents, Account Settings, Admin Panel)  
  - `/services` (firebase.js, drive.js)  
  - `/graphql` (schema.graphql, connectors)  
- Initialize Firebase config for Authentication and Firestore.  

---

👥 Step 2: Define User Roles and Access  
Implement **role-based access** using Firebase Authentication + Firestore custom claims:  
1. **Admin**  
2. **Staff**  
3. **Division CC**  
4. **Divisional Head**  
5. **HOD**  

Each role only sees the modules assigned to them (defined later in dashboards).  

---

🧾 Step 3: Build Staff Profile Form  
Form fields:  
- Name  
- NIC  
- Designation  
- Date of Birth  
- Mobile Number  
- Appointment Date  
- Email  
- Working History (repeatable entries: name & place)  
- Profile Image Upload (with "Borrow Image" feature)  

Inventory Checklist:  
- PC/Laptop  
- LGN Account  
- Printer (with name)  
- Router  
- UPS  

Store data in Firestore under `/staffProfiles/{uid}`.  

---

🗓️ Step 4: Build Leave Application Form  
Form fields:  
- Name  
- Leave Type  
- Designation  
- Number of leave days  
- Leave start date  
- Leave resume date  
- Reason for leave  
- Acting Officer (only from own division)  
- Recommend Officer (dropdown: Division CC / Division Head)  
- Approve Officer (dropdown: Division Head / HOD)  

Logic:  
- On submission, route leave request to selected officers.  
- Officers see pending requests in their dashboard.  
- Store leave requests in Firestore `/leaveRequests/{id}`.  

---

📦 Step 5: Build Apply Leave Modal Form  
- Same fields as Step 4.  
- Open as modal instead of page.  
- After submit → forward to selected Recommend and Approve officers.  
- Officers see status updates in their dashboard.  

---

📁 Step 6: Document Management Module  
- Connect to Google Drive via Drive API `POST /upload`.  
- Upload file to **user’s personal Drive**.  
- Store metadata in Firestore only:  
  - File Name  
  - Drive File ID  
  - Drive Link  
- Enforce secure access: user can only view their own Drive metadata.  

---

🔐 Step 7: Account Settings  
- Reset or recover password using Firebase Authentication.  

---

📊 Step 8: Role-Based Dashboards  

👉 Staff Dashboard  
- Stats (personal summary only)  
- Personal Details (update + profile image upload)  
- Leave (apply + view status filter by date/type)  
- Documents (Google Drive integration)  
- Account Settings  

👉 Division CC Dashboard  
- All Staff features +  
- Recommend Leave (view & recommend for division only → auto-forward to approving officer)  
- Staff Directory (search, filter, print staff list in division; modal view with profile pic & details)  

👉 Division Head Dashboard  
- All Division CC features +  
- Approve Leave (approve recommended leaves in division only)  

👉 HOD / Admin Dashboard  
- Stats (entire system)  
- Approve Leave (all divisions)  
- Staff Directory (all divisions with search/print/modal profile details)  
- Admin Panel (create divisions, create officer accounts for CC/Head/HOD)  
- Documents (all features as Staff)  
- Account Settings  

---

🧠 Step 9: Generate GraphQL Schema  
Create `schema.graphql` with types:  

```graphql
type Staff {
  id: ID!
  name: String!
  nic: String!
  designation: String!
  dateOfBirth: String!
  mobileNumber: String!
  appointmentDate: String!
  email: String!
  workingHistory: [WorkingHistoryEntry!]!
  profileImageUrl: String
  inventory: Inventory
}

type WorkingHistoryEntry {
  place: String!
  role: String!
}

type Inventory {
  pcLaptop: Boolean
  lgnAccount: Boolean
  printer: String
  router: Boolean
  ups: Boolean
}

type LeaveRequest {
  id: ID!
  staffId: ID!
  name: String!
  designation: String!
  leaveType: String!
  numberOfDays: Int!
  startDate: String!
  resumeDate: String!
  reason: String!
  actingOfficer: String!
  recommendOfficer: String!
  approveOfficer: String!
  status: String!
}

---------------------------------
Step 10: Generate Connector YAMLs
Create connector files for Firebase Data Connect:

staffConnector.yaml
resources:
  - name: Staff
    operations:
      - get
      - update
      - list

leaveConnector.yaml

resources:
  - name: LeaveRequest
    operations:
      - submit
      - recommend
      - approve
      - listByDivision

Deliverable:
A functional React + Firebase + Firestore + Google Drive integrated Staffy app with role-based dashboards, biodata, leave management, documents, and admin features.
Make sure all authentication, routing, and role-based access controls are properly implemented.