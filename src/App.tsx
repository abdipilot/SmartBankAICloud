import React, { useState } from 'react';
import { 
    AlertTriangle, Shield, Clock, Activity, TrendingUp, FileText, Download, 
    CheckCircle, Upload, Calendar, Building2, BarChart3, PlayCircle, Crosshair, 
    Users, Zap, Target, Search, AlertOctagon, ShieldCheck, Cpu, Monitor, Eye, 
    ZapOff, Fingerprint 
} from 'lucide-react';

// =================================================================
// TYPE DEFINITIONS
// =================================================================

// Existing Types (Abridged for brevity, full definition remains in file)
interface AnomalyLog { id: string; timestamp: string; severity: 'Critical' | 'High' | 'Low'; summary: string; userSystem: string; regTags: string[]; status: 'Open' | 'Closed' | 'In Progress'; }
interface KpiData { logsProcessed: string; processingTime: string; criticalAnomalies: number; pendingRemediation: number; nlpSummary: string; }
interface TrendDataPoint { day: string; count: number; }
interface RegulatoryReport { id: string; name: string; type: string; period: string; status: 'Generated' | 'In Progress' | 'Pending'; generatedDate: string; size: string; dueDate: string; }
interface SanctionMatch { id: string; customerName: string; matchScore: number; sourceList: string; riskLevel: 'High' | 'Medium' | 'Low'; status: 'New' | 'Review' | 'Closed'; }
interface RiskScoreSummary { totalCustomers: string; highRiskAlerts: number; sanctionMatches: number; screeningCoverage: number; }
interface TransactionAlert { id: string; timestamp: string; amount: number; account: string; fraudScore: number; ruleTrigger: string; status: 'Flagged' | 'Reviewed' | 'Cleared'; type: 'Transfer' | 'Loan App' | 'Mobile Charge' | 'Withdrawal'; }
interface FraudSummary { totalTransactions: string; flaggedAlerts: number; fraudRate: number; modelLatency: string; adaptiveLearningStatus: 'Active' | 'Training' | 'Paused'; }

// NEW eKYC TYPES
interface EKYCSummary {
    avgOnboardingTime: string;
    totalVerifications: string;
    successfulVerifications: number; // percentage
    fraudBlocks: number;
    ocrAccuracy: number; // percentage
}

interface VerificationCase {
    caseId: string;
    applicantName: string;
    status: 'Verified' | 'Pending' | 'Rejected' | 'Fraud Alert';
    faceMatchScore: number;
    docTamperScore: number;
    watchListHit: boolean;
    timestamp: string;
}

// =================================================================
// MOCK DATA (Existing Data preserved, new data added)
// =================================================================

const MOCK_KPI_DATA: KpiData = {
    logsProcessed: "1,250,000+",
    processingTime: "4.7s",
    criticalAnomalies: 2,
    pendingRemediation: 0,
    nlpSummary: "The AI model has observed that system activity was heavily focused on loan application services during business hours (10 AM - 3 PM) over the last 7 days. Critical anomalies remain low, but high-severity alerts related to unauthorized access attempts spiked on Thursday. Remediation backlog is clear, indicating prompt action by the security team."
};

const MOCK_TREND_DATA: TrendDataPoint[] = [
    { day: "Mon", count: 12 }, { day: "Tue", count: 18 }, { day: "Wed", count: 25 },
    { day: "Thu", count: 35 }, { day: "Fri", count: 15 }, { day: "Sat", count: 8 },
    { day: "Sun", count: 5 }
];

const MOCK_ANOMALY_LOGS: AnomalyLog[] = [
    { id: 'A001', timestamp: '2025-10-06 14:30', severity: 'Critical', summary: 'Unauthorized attempt to modify database schema.', userSystem: 'Internal API', regTags: ['GDPR', 'PCI-DSS'], status: 'Open' },
    { id: 'A002', timestamp: '2025-10-06 10:15', severity: 'High', summary: 'Large file transfer detected outside normal hours.', userSystem: 'Remote Access', regTags: ['NIST', 'SOX'], status: 'In Progress' },
    { id: 'A003', timestamp: '2025-10-05 08:00', severity: 'Low', summary: 'Configuration drift detected on firewall rule set.', userSystem: 'Network Monitor', regTags: ['HIPAA'], status: 'Closed' },
];

const MOCK_REPORTS: RegulatoryReport[] = [
    { id: 'R01', name: 'FINRA Rule 4530 Report', type: 'Daily', period: 'Q3 2025', status: 'Generated', generatedDate: '2025-09-30', size: '5.2 MB', dueDate: '2025-10-15' },
    { id: 'R02', name: 'AML SAR Filing (Batch 3)', type: 'Monthly', period: 'Aug 2025', status: 'Pending', generatedDate: '2025-10-01', size: '1.1 GB', dueDate: '2025-10-31' },
    { id: 'R03', name: 'OCC 15 CFR Part 900', type: 'Quarterly', period: 'Q3 2025', status: 'In Progress', generatedDate: '2025-10-05', size: '1.5 MB', dueDate: '2025-11-10' },
];

const MOCK_RISK_SUMMARY: RiskScoreSummary = {
    totalCustomers: "450,120",
    highRiskAlerts: 15,
    sanctionMatches: 3,
    screeningCoverage: 98,
};

const MOCK_SANCTION_MATCHES: SanctionMatch[] = [
    { id: 'M101', customerName: 'Alexei V. Kirov', matchScore: 92, sourceList: 'OFAC SDN', riskLevel: 'High', status: 'New' },
    { id: 'M102', customerName: 'Zoe P. Chen', matchScore: 78, sourceList: 'EU Consolidated', riskLevel: 'Medium', status: 'Review' },
    { id: 'M103', customerName: 'David H. Smith', matchScore: 61, sourceList: 'PEPS List', riskLevel: 'Low', status: 'Closed' },
    { id: 'M104', customerName: 'Maria R. Sanchez', matchScore: 88, sourceList: 'UN Security Council', riskLevel: 'High', status: 'New' },
    { id: 'M105', customerName: 'Tariq A. Al-Jazi', matchScore: 85, sourceList: 'OFAC SSI', riskLevel: 'Medium', status: 'New' },
];

const MOCK_FRAUD_SUMMARY: FraudSummary = {
    totalTransactions: "3,200,000",
    flaggedAlerts: 45,
    fraudRate: 0.012, // 0.012%
    modelLatency: "25ms",
    adaptiveLearningStatus: 'Active',
};

const MOCK_TRANSACTION_ALERTS: TransactionAlert[] = [
    { id: 'T901', timestamp: '2025-10-07 11:45', amount: 50000.00, account: '****1234', fraudScore: 98, ruleTrigger: 'Large International Transfer', status: 'Flagged', type: 'Transfer' },
    { id: 'T902', timestamp: '2025-10-07 10:30', amount: 1500.00, account: '****5678', fraudScore: 75, ruleTrigger: 'Duplicate Mobile Charge Pattern', status: 'Flagged', type: 'Mobile Charge' },
    { id: 'T903', timestamp: '2025-10-07 09:10', amount: 250000.00, account: '****9012', fraudScore: 62, ruleTrigger: 'New Geo-Location Access', status: 'Reviewed', type: 'Withdrawal' },
    { id: 'T904', timestamp: '2025-10-06 17:05', amount: 0.00, account: '****3456', fraudScore: 95, ruleTrigger: 'Incomplete Loan Application Data', status: 'Flagged', type: 'Loan App' },
    { id: 'T905', timestamp: '2025-10-06 14:00', amount: 50.00, account: '****7890', fraudScore: 10, ruleTrigger: 'Low-Value Pattern Deviation', status: 'Cleared', type: 'Mobile Charge' },
];

// NEW eKYC MOCK DATA
const MOCK_EKYC_SUMMARY: EKYCSummary = {
    avgOnboardingTime: "28s", // Target achieved!
    totalVerifications: "8,912",
    successfulVerifications: 95.8,
    fraudBlocks: 21,
    ocrAccuracy: 99.7,
};

const MOCK_VERIFICATION_CASES: VerificationCase[] = [
    { caseId: 'K701', applicantName: 'Jane M. Doe', status: 'Verified', faceMatchScore: 98.2, docTamperScore: 2.1, watchListHit: false, timestamp: '2025-10-07 15:01' },
    { caseId: 'K702', applicantName: 'John A. Smith', status: 'Fraud Alert', faceMatchScore: 65.5, docTamperScore: 89.0, watchListHit: true, timestamp: '2025-10-07 14:55' },
    { caseId: 'K703', applicantName: 'Chen L. Wei', status: 'Pending', faceMatchScore: 88.0, docTamperScore: 10.5, watchListHit: false, timestamp: '2025-10-07 14:48' },
    { caseId: 'K704', applicantName: 'Robert P. Jones', status: 'Verified', faceMatchScore: 95.1, docTamperScore: 1.5, watchListHit: false, timestamp: '2025-10-07 14:30' },
    { caseId: 'K705', applicantName: 'Maria T. Garcia', status: 'Rejected', faceMatchScore: 92.0, docTamperScore: 5.0, watchListHit: true, timestamp: '2025-10-07 14:05' },
];

// =================================================================
// AML, AUDIT, FRAUD COMPONENTS (Abridged for brevity)
// =================================================================

const RiskScoringWidget: React.FC<{ coverage: number, highRiskCount: number }> = ({ coverage, highRiskCount }) => {
    const percentColor = highRiskCount > 10 ? 'text-red-400' : 'text-amber-400';
    return (
        <div className="flex items-center justify-between p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-700/50">
            <div className="flex flex-col">
                <p className="text-xl font-bold text-slate-100 mb-1">AI Risk Score</p>
                <p className="text-slate-400 text-sm">Real-time risk aggregation</p>
                <div className="mt-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-cyan-400" />
                    <span className="text-2xl font-extrabold text-white">
                        {highRiskCount} <span className="text-sm font-medium text-slate-400">High-Risk Alerts</span>
                    </span>
                </div>
            </div>

            {/* Radial Progress Simulation */}
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-700" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                    <circle 
                        className={percentColor}
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (coverage / 100))}
                        strokeLinecap="round"
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="48" 
                        cy="48" 
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className={`text-xl font-bold ${percentColor}`}>{coverage}%</span>
                </div>
            </div>
        </div>
    );
};

const AMLScreeningDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Crosshair className="w-8 h-8 text-red-500" />
                AML & Sanctions AI Screener
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400" /> Total Customers</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_RISK_SUMMARY.totalCustomers}</p>
                    <p className="text-xs text-green-400 mt-1">Screened against 15+ lists.</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Pending Sanction Matches</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_RISK_SUMMARY.sanctionMatches}</p>
                    <p className="text-xs text-slate-400 mt-1">Requires immediate manual review.</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Zap className="w-4 h-4 text-red-400" /> Name Match AI Speed</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{'<'} 100ms</p>
                    <p className="text-xs text-green-400 mt-1">Real-time processing for new clients.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-semibold text-white mb-4">AI Risk Scoring Dashboard</h3>
                    <RiskScoringWidget 
                        coverage={MOCK_RISK_SUMMARY.screeningCoverage} 
                        highRiskCount={MOCK_RISK_SUMMARY.highRiskAlerts} 
                    />
                </div>
                <div className="lg:col-span-2 p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-700/50">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
                        Recent AI Match Alerts
                        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                            <Search className="w-4 h-4" /> Run New Scan
                        </button>
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead>
                                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="py-3 px-4">Customer Name</th>
                                    <th className="py-3 px-4">Match Score</th>
                                    <th className="py-3 px-4">Source List</th>
                                    <th className="py-3 px-4">Risk</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {MOCK_SANCTION_MATCHES.map((match) => (
                                    <tr key={match.id} className="text-sm text-white/90 hover:bg-slate-800 transition-colors">
                                        <td className="py-3 px-4 font-medium">{match.customerName}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-bold ${match.matchScore >= 90 ? 'text-red-500' : match.matchScore >= 75 ? 'text-amber-500' : 'text-green-500'}`}>
                                                {match.matchScore}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">{match.sourceList}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                match.riskLevel === 'High' ? 'bg-red-900 text-red-300' : 
                                                match.riskLevel === 'Medium' ? 'bg-amber-900 text-amber-300' : 
                                                'bg-green-900 text-green-300'
                                            }`}>
                                                {match.riskLevel}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                match.status === 'New' ? 'bg-cyan-900 text-cyan-300' : 
                                                match.status === 'Review' ? 'bg-indigo-900 text-indigo-300' : 
                                                'bg-slate-700 text-slate-300'
                                            }`}>
                                                {match.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FraudDetectionDashboard: React.FC = () => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-red-500';
        if (score >= 70) return 'text-amber-500';
        return 'text-green-500';
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <AlertOctagon className="w-8 h-8 text-yellow-500" />
                AI Fraud Detection & Transaction Monitoring
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-yellow-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Monitor className="w-4 h-4 text-yellow-400" /> Transactions Monitored</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_FRAUD_SUMMARY.totalTransactions}</p>
                    <p className="text-xs text-green-400 mt-1">Real-time stream analysis.</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-yellow-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Flagged Alerts (24h)</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_FRAUD_SUMMARY.flaggedAlerts}</p>
                    <p className="text-xs text-slate-400 mt-1">Requires immediate manual review.</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-yellow-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" /> Model Latency</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_FRAUD_SUMMARY.modelLatency}</p>
                    <p className="text-xs text-green-400 mt-1">Pre-clearing transaction verification.</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-yellow-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-400" /> Adaptive Learning</p>
                    <p className={`text-3xl font-extrabold mt-2 ${MOCK_FRAUD_SUMMARY.adaptiveLearningStatus === 'Active' ? 'text-green-500' : 'text-amber-500'}`}>{MOCK_FRAUD_SUMMARY.adaptiveLearningStatus}</p>
                    <p className="text-xs text-slate-400 mt-1">Updating behavior profiles.</p>
                </div>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-yellow-500/30">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
                    Real-Time Fraud Alerts
                    <button className="text-sm text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Validate Model Behavior
                    </button>
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <th className="py-3 px-4">Transaction ID / Account</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Fraud Score</th>
                                <th className="py-3 px-4">Trigger Rule</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {MOCK_TRANSACTION_ALERTS.map((alert) => (
                                <tr key={alert.id} className="text-sm text-white/90 hover:bg-slate-800 transition-colors">
                                    <td className="py-3 px-4 font-medium">
                                        <p className="text-slate-200">{alert.id}</p>
                                        <p className="text-xs text-slate-400">{alert.account}</p>
                                    </td>
                                    <td className="py-3 px-4 font-medium text-green-400">${alert.amount.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-slate-400">{alert.type}</td>
                                    <td className="py-3 px-4">
                                        <span className={`font-bold ${getScoreColor(alert.fraudScore)}`}>
                                            {alert.fraudScore}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-300">{alert.ruleTrigger}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            alert.status === 'Flagged' ? 'bg-red-900 text-red-300' : 
                                            alert.status === 'Reviewed' ? 'bg-amber-900 text-amber-300' : 
                                            'bg-green-900 text-green-300'
                                        }`}>
                                            {alert.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// NEW eKYC COMPONENT
// =================================================================

const EKYCDashboard: React.FC = () => {
    // Helper function for coloring the status
    const getStatusStyle = (status: VerificationCase['status']) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-900 text-green-300';
            case 'Fraud Alert':
                return 'bg-red-900 text-red-300';
            case 'Rejected':
                return 'bg-amber-900 text-amber-300';
            case 'Pending':
            default:
                return 'bg-blue-900 text-blue-300';
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-emerald-500" />
                AI-Powered eKYC & Document Verification
            </h2>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 p-6 bg-slate-900 rounded-xl shadow-xl border border-emerald-500/30 flex flex-col justify-center">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Average Onboarding Time</p>
                    <p className="text-4xl font-extrabold text-white mt-2 flex items-baseline">
                        {MOCK_EKYC_SUMMARY.avgOnboardingTime}
                        <span className="text-sm font-medium text-emerald-400 ml-2">(Target: 30s)</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Reduced from 3 days to under 30 seconds.</p>
                </div>

                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-emerald-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Success Rate</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_EKYC_SUMMARY.successfulVerifications}%</p>
                    <p className="text-xs text-green-400 mt-1">Total verifications: {MOCK_EKYC_SUMMARY.totalVerifications}.</p>
                </div>
                
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-emerald-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /> OCR Accuracy</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_EKYC_SUMMARY.ocrAccuracy}%</p>
                    <p className="text-xs text-slate-400 mt-1">Key data extraction precision.</p>
                </div>
                
                <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-emerald-500/30">
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><ZapOff className="w-4 h-4 text-red-400" /> Fraud Blocks (7d)</p>
                    <p className="text-3xl font-extrabold text-white mt-2">{MOCK_EKYC_SUMMARY.fraudBlocks}</p>
                    <p className="text-xs text-red-400 mt-1">Document forgery and face spoofing.</p>
                </div>
            </div>

            {/* Verification Cases Table */}
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-emerald-500/30">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
                    Recent Verification & Document Analysis
                    <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                        <Fingerprint className="w-4 h-4" /> Review Manual Cases
                    </button>
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                                <th className="py-3 px-4">Case ID / Applicant</th>
                                <th className="py-3 px-4">Face Match Score</th>
                                <th className="py-3 px-4">Doc Tamper Score</th>
                                <th className="py-3 px-4">Watchlist Hit</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {MOCK_VERIFICATION_CASES.map((caseItem) => (
                                <tr key={caseItem.caseId} className="text-sm text-white/90 hover:bg-slate-800 transition-colors">
                                    <td className="py-3 px-4 font-medium">
                                        <p className="text-slate-200">{caseItem.applicantName}</p>
                                        <p className="text-xs text-slate-400">{caseItem.caseId} @ {caseItem.timestamp.split(' ')[1]}</p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`font-bold ${caseItem.faceMatchScore < 80 ? 'text-red-500' : 'text-cyan-400'}`}>
                                            {caseItem.faceMatchScore.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`font-bold ${caseItem.docTamperScore > 50 ? 'text-red-500' : 'text-green-400'}`}>
                                            {caseItem.docTamperScore.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            caseItem.watchListHit ? 'bg-red-900 text-red-300' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                            {caseItem.watchListHit ? 'HIT' : 'CLEARED'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(caseItem.status)}`}>
                                            {caseItem.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// OTHER COMPONENTS (Audit Log, Reporting) - Kept for completeness
// =================================================================

const AuditLogAnalyzer: React.FC = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            AI Audit Log Analyzer Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> Logs Processed</p>
                <p className="text-3xl font-extrabold text-white mt-2">{MOCK_KPI_DATA.logsProcessed}</p>
                <p className="text-xs text-green-400 mt-1">No data loss detected.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /> Processing Time</p>
                <p className="text-3xl font-extrabold text-white mt-2">{MOCK_KPI_DATA.processingTime}</p>
                <p className="text-xs text-slate-400 mt-1">99th percentile latency.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Critical Anomalies</p>
                <p className="text-3xl font-extrabold text-white mt-2">{MOCK_KPI_DATA.criticalAnomalies}</p>
                <p className="text-xs text-red-400 mt-1">Requires immediate attention.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Pending Remediation</p>
                <p className="text-3xl font-extrabold text-white mt-2">{MOCK_KPI_DATA.pendingRemediation}</p>
                <p className="text-xs text-slate-400 mt-1">Remediation backlog status.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30 space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2"><PlayCircle className="w-5 h-5 text-green-400" /> NLP Insight Summary</h3>
                <p className="text-slate-300 leading-relaxed">{MOCK_KPI_DATA.nlpSummary}</p>
                <div className="flex justify-between items-center text-sm pt-2">
                    <span className="text-slate-500">Last updated: 5 minutes ago</span>
                    <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium">
                        <TrendingUp className="w-4 h-4" /> View Full Report
                    </button>
                </div>
            </div>
            <div className="lg:col-span-1 p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-purple-400" /> Weekly Anomaly Trend</h3>
                <div className="flex justify-between items-end h-32">
                    {MOCK_TREND_DATA.map((data) => (
                        <div key={data.day} className="flex flex-col items-center">
                            <div 
                                className="w-4 bg-cyan-500/80 rounded-t-lg transition-all duration-300 hover:bg-cyan-400"
                                style={{ height: `${(data.count / 40) * 100}%` }}
                            ></div>
                            <span className="text-xs text-slate-400 mt-1">{data.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-blue-500/30">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Anomaly Logs</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <th className="py-3 px-4">ID / Timestamp</th>
                            <th className="py-3 px-4">Severity</th>
                            <th className="py-3 px-4">Summary</th>
                            <th className="py-3 px-4">System</th>
                            <th className="py-3 px-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {MOCK_ANOMALY_LOGS.map((log) => (
                            <tr key={log.id} className="text-sm text-white/90 hover:bg-slate-800 transition-colors">
                                <td className="py-3 px-4">
                                    <p className="font-medium text-slate-200">{log.id}</p>
                                    <p className="text-xs text-slate-400">{log.timestamp}</p>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                        log.severity === 'Critical' ? 'bg-red-900 text-red-300' : 
                                        log.severity === 'High' ? 'bg-amber-900 text-amber-300' : 
                                        'bg-green-900 text-green-300'
                                    }`}>
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{log.summary}</td>
                                <td className="py-3 px-4 text-slate-400">{log.userSystem}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        log.status === 'Open' ? 'bg-blue-900 text-blue-300' : 
                                        log.status === 'In Progress' ? 'bg-purple-900 text-purple-300' : 
                                        'bg-green-900 text-green-300'
                                    }`}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const RegulatoryReporting: React.FC = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-500" />
            Regulatory Reporting Assistant Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-purple-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-400" /> Jurisdiction</p>
                <p className="text-3xl font-extrabold text-white mt-2">Global</p>
                <p className="text-xs text-green-400 mt-1">Coverage: 45 jurisdictions.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-purple-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan-400" /> Upcoming Due Dates</p>
                <p className="text-3xl font-extrabold text-white mt-2">3</p>
                <p className="text-xs text-slate-400 mt-1">In the next 30 days.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-purple-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Reports Generated</p>
                <p className="text-3xl font-extrabold text-white mt-2">12</p>
                <p className="text-xs text-green-400 mt-1">Successfully submitted this quarter.</p>
            </div>
            <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-purple-500/30">
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Total Time Saved</p>
                <p className="text-3xl font-extrabold text-white mt-2">250 hrs</p>
                <p className="text-xs text-slate-400 mt-1">Annualized manual effort reduction.</p>
            </div>
        </div>
        <div className="p-6 bg-slate-900 rounded-xl shadow-xl border border-purple-500/30">
            <h3 className="text-xl font-semibold text-white mb-4">Pending & Recent Regulatory Filings</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                    <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <th className="py-3 px-4">Report Name</th>
                            <th className="py-3 px-4">Period / Type</th>
                            <th className="py-3 px-4">Due Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {MOCK_REPORTS.map((report) => (
                            <tr key={report.id} className="text-sm text-white/90 hover:bg-slate-800 transition-colors">
                                <td className="py-3 px-4 font-medium">{report.name}</td>
                                <td className="py-3 px-4 text-slate-400">
                                    <p>{report.period}</p>
                                    <p className="text-xs font-mono">{report.type}</p>
                                </td>
                                <td className="py-3 px-4 text-amber-400 font-medium">{report.dueDate}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        report.status === 'Generated' ? 'bg-green-900 text-green-300' : 
                                        report.status === 'In Progress' ? 'bg-purple-900 text-purple-300' : 
                                        'bg-amber-900 text-amber-300'
                                    }`}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 space-x-2">
                                    <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs">
                                        <Download className="w-4 h-4" /> Download
                                    </button>
                                    <button className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-xs mt-1">
                                        <Upload className="w-4 h-4" /> Submit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


// =================================================================
// MAIN DASHBOARD COMPONENT (Updated for 5 tabs)
// =================================================================

const AALA_Dashboard: React.FC = () => {
    // UPDATED: Added 'ekyc' as a possible tab state
    const [activeTab, setActiveTab] = useState<'audit' | 'reporting' | 'aml' | 'fraud' | 'ekyc'>('audit');

    const renderContent = () => {
        switch (activeTab) {
            case 'audit':
                return <AuditLogAnalyzer />;
            case 'reporting':
                return <RegulatoryReporting />;
            case 'aml':
                return <AMLScreeningDashboard />; 
            case 'fraud':
                return <FraudDetectionDashboard />;
            case 'ekyc':
                return <EKYCDashboard />; // NEW TAB CONTENT
            default:
                return <AuditLogAnalyzer />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans">
            <div className="bg-slate-900 shadow-xl border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-3xl font-extrabold text-white mb-6 tracking-tight">SmartBank AI Compliance Suite</h1>

                    {/* Navigation Tabs (UPDATED for 5 tabs) */}
                    <div className="flex space-x-4 border-b-2 border-slate-700/50 pb-0.5 overflow-x-auto">
                        
                        {/* 1. AI Audit Log Analyzer Tab */}
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                                activeTab === 'audit'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <Shield className="w-5 h-5" />
                            AI Audit Log Analyzer
                        </button>
                        
                        {/* 2. Regulatory Reporting Assistant Tab */}
                        <button
                            onClick={() => setActiveTab('reporting')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                                activeTab === 'reporting'
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <FileText className="w-5 h-5" />
                            Regulatory Reporting Assistant
                        </button>

                        {/* 3. AML & Sanctions AI Screener Tab */}
                        <button
                            onClick={() => setActiveTab('aml')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                                activeTab === 'aml'
                                    ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <Crosshair className="w-5 h-5" />
                            AML & Sanctions AI Screener
                        </button>

                         {/* 4. AI Fraud Detection & Transaction Monitoring Tab */}
                        <button
                            onClick={() => setActiveTab('fraud')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                                activeTab === 'fraud'
                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <AlertOctagon className="w-5 h-5" />
                            AI Fraud Detection
                        </button>
                        
                        {/* 5. AI-Powered eKYC & Document Verification Tab (NEW) */}
                        <button
                            onClick={() => setActiveTab('ekyc')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-semibold transition-all ${
                                activeTab === 'ekyc'
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <CheckCircle className="w-5 h-5" />
                            AI eKYC Verification
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {renderContent()}
            </div>
        </div>
    );
};

export default AALA_Dashboard;
