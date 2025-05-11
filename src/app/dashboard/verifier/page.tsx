// import DashBoardLayout from "../DashboardLayout"
// import PendingVerifications, { type PendingVerification } from "../../components/verifier-dashboard/pending-verification"
// import DocumentsToReview, { type Document } from "../../components/verifier-dashboard/document-review"
// import VerificationHistory, { type VerificationHistoryItem } from "../../components/verifier-dashboard/verification-history"
// import Alerts, { type Alert } from "../../components/verifier-dashboard/alert"
// import PerformanceMetrics, { type Metrics } from "../../components/verifier-dashboard/performance-metrics"
// import Announcements, { type Announcement } from "../../components/verifier-dashboard/annoucement"

// // Sample data
// const pendingVerifications: PendingVerification[] = [
//   {
//     id: 1,
//     property: "Luxury 3BR Flat - Ikeja",
//     submitted: "April 26",
//     ownerWalletShort: "0x223...56F9",
//     ownerWalletFull: "Ikeja",
//   },
//   {
//     id: 2,
//     property: "Office Space - VI",
//     submitted: "April 25",
//     ownerWalletShort: "0x892...D8F1",
//     ownerWalletFull: "VI",
//   },
//   {
//     id: 3,
//     property: "Mini Flat - Yaba",
//     submitted: "April 24",
//     ownerWalletShort: "0xC15...A74B",
//     ownerWalletFull: "Yaba",
//   },
//   {
//     id: 4,
//     property: "Land Plot - Ajah",
//     submitted: "April 23",
//     ownerWalletShort: "0xF10...4D09",
//     ownerWalletFull: "Ajah",
//   },
// ]

// const documentsToReview: Document[] = [
//   {
//     id: 1,
//     title: 'Title Deed - "888 Duplex, Lekki Phase 1"',
//   },
//   {
//     id: 2,
//     title: 'Zoning Certificate - "Shop in Ikeja"',
//   },
//   {
//     id: 3,
//     title: 'Proof of Ownership - "Land Plot, Sangotedo"',
//   },
// ]

// const verificationHistory: VerificationHistoryItem[] = [
//   {
//     id: 1,
//     property: "Luxury Apartment",
//     location: "VI",
//     status: "verified",
//     date: "April 20",
//   },
//   {
//     id: 2,
//     property: "Land Plot",
//     location: "Badagry",
//     status: "flagged",
//     date: "April 18",
//   },
//   {
//     id: 3,
//     property: "2BR Yaba Flat",
//     location: "Yaba",
//     status: "returned",
//     date: "April 15",
//     note: "Returned for Edits",
//   },
//   {
//     id: 4,
//     property: "Commercial Space",
//     location: "Lekki",
//     status: "verified",
//     date: "April 10",
//   },
// ]

// const alertsData: Alert[] = [
//   {
//     id: 1,
//     type: "danger",
//     message: "Mini Flat in Surulere - Flagged for document mismatch",
//   },
//   {
//     id: 2,
//     type: "warning",
//     message: "Land in Ajah - Suspicious Ownership Investigation",
//   },
//   {
//     id: 3,
//     type: "info",
//     message: "Warehouse in Apapa - Update Ownership",
//   },
// ]

// const performanceMetrics: Metrics = {
//   propertiesVerified: 23,
//   propertiesFlagged: 4,
//   avgVerificationTime: "2.5h",
//   trustScore: "92%",
// }

// const announcements: Announcement[] = [
//   {
//     id: 1,
//     icon: "new",
//     title: "New Smart Validator Tool!",
//     message: "Try out our AI-based document verification tool now available in your dashboard.",
//   },
//   {
//     id: 2,
//     icon: "policy",
//     title: "Verification Policy Updates",
//     message: "All pending verifications must be completed within 3 business days starting May 1st, 2025.",
//   },
//   {
//     id: 3,
//     icon: "trophy",
//     title: "Top Verifiers Recognition Program",
//     message: "Earn badges and bonuses by maintaining 95%+ Trust Scores across verifications.",
//   },
// ]

// const VerifierDashboard = () => {
//   return (
//     <DashBoardLayout>
//       <div
//         className="welcome-section text-center mb-8 rounded-lg p-6"
//         style={{
//           background: "radial-gradient(50% 206.8% at 50% 50%, rgba(10, 88, 116, 0.7) 0%, rgba(32, 23, 38, 0.7) 56.91%)",
//         }}
//       >
//         <h1 className="font-poppins font-semibold text-3xl md:text-4xl leading-[170%] mb-2">
//           Welcome Back, Dammie! <span className="text-yellow-400">👋</span>
//         </h1>
//         <p className="font-vietnam font-normal text-base leading-[170%] tracking-[1%] text-[hsl(var(--foreground)/0.7)]">
//           Help us maintain trust by securely verifying properties
//         </p>
//       </div>

//       <PendingVerifications verifications={pendingVerifications} />
//       <DocumentsToReview documents={documentsToReview} />
//       <VerificationHistory history={verificationHistory} />
//       <Alerts alerts={alertsData} />
//       <PerformanceMetrics metrics={performanceMetrics} />
//       <Announcements announcements={announcements} />
//     </DashBoardLayout>
//   )
// }

// export default VerifierDashboard
