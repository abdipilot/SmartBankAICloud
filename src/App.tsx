import React, { useState } from 'react';
import { AlertTriangle, Shield, Clock, Activity, TrendingUp, FileText, Download, CheckCircle, Upload, Calendar, Building2, BarChart3, PlayCircle } from 'lucide-react';

// =================================================================
// TYPE DEFINITIONS
// =================================================================

interface AnomalyLog {
    id: string;
    timestamp: string;
    severity: 'Critical' | 'High' | 'Low';
    summary: string;
    userSystem: string;
    regTags: string[];
    status: 'Open' | 'Closed' | 'In Progress';
}

interface KpiData {
    logsProcessed: string;
    processingTime: string;
    criticalAnomalies: number;
    pendingRemediation: number;
    nlpSummary: string;
}

interface TrendDataPoint {
    day: string;
    count: number;
}

interface RegulatoryReport {
    id: string;
    name: string;
    type: string;
    period: string;
    status: 'Generated' | 'In Progress' | 'Pending';
    generatedDate: string;
    size: string;
    dueDate: string;
}

// =================================================================
// MOCK DATA
// =================================================================

const MOCK_KPI_DATA: KpiData = {
    logsProcessed: "1,250,000+",
    processingTime: "4.7s",
    criticalAnomalies: 2,
    pendingRemediation: 0,
    nlpSummary: "The AI model has observed that system activity was heavily focused on loan application services during business hours (9 AM - 5 PM). One critical access elevation violation (User Role Elevation) was detected in the Core Banking System, violating the Segregation of Duties (SoD) policy. A subsequent, related Bulk Data Access event occurred 45 minutes later, posing a potential data exfiltration risk. All other monitored systems remain at a normal baseline risk level.",
};

const MOCK_ANOMALIES: AnomalyLog[] = [
    {
        id: "AALA-10-001",
        timestamp: "2025-10-06 03:15:22",
        severity: "Critical",
        summary: "User Role Elevation (Auditor → Admin)",
        userSystem: "jdoe on Core Banking API",
        regTags: ["SOX", "Segregation of Duties (SoD)"],
        status: "Open"
    },
    {
        id: "AALA-10-002",
        timestamp: "2025-10-06 04:00:00",
        severity: "High",
        summary: "Bulk Data Access (10,000+ records)",
        userSystem: "admin_service on MORTGAGE_DB",
        regTags: ["GDPR", "PCI-DSS"],
        status: "Open"
    },
    {
        id: "AALA-10-003",
        timestamp: "2025-10-05 19:30:15",
        severity: "Low",
        summary: "Failed Login Attempts (5x)",
        userSystem: "Unknown IP",
        regTags: ["Internal Security Policy"],
        status: "Closed"
    },
];

const MOCK_TREND_DATA: TrendDataPoint[] = [
    { day: "Oct 2", count: 1 },
    { day: "Oct 3", count: 1 },
    { day: "Oct 4", count: 2 },
    { day: "Oct 5", count: 8 }, 
    { day: "Oct 6", count: 12 }, 
];

const MOCK_REPORTS: RegulatoryReport[] = [
    {
        id: "RPT-2025-Q3-001",
        name: "Central Bank Liquidity Report",
        type: "Liquidity Coverage Ratio (LCR)",
        period: "Q3 2025",
        status: "Generated",
        generatedDate: "2025-10-01",
        size: "2.4 MB",
        dueDate: "2025-10-15"
    },
    {
        id: "RPT-2025-Q3-002",
        name: "Anti-Money Laundering (AML) Report",
        type: "Suspicious Activity Report",
        period: "Q3 2025",
        status: "Generated",
        generatedDate: "2025-09-28",
        size: "1.8 MB",
        dueDate: "2025-10-10"
    },
    {
        id: "RPT-2025-Q4-001",
        name: "Capital Adequacy Report",
        type: "Basel III Compliance",
        period: "Q4 2025",
        status: "In Progress",
        generatedDate: "2025-10-06",
        size: "3.1 MB",
        dueDate: "2025-11-15"
    },
    {
        id: "RPT-2025-Q4-002",
        name: "Stress Testing Report",
        type: "CCAR Submission",
        period: "Q4 2025",
        status: "Pending",
        generatedDate: "-",
        size: "-",
        dueDate: "2025-11-30"
    }
];

// =================================================================
// AUDIT LOG ANALYZER TAB
// =================================================================

const AuditLogAnalyzer: React.FC = () => {
    const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
    
    const filteredAnomalies = selectedSeverity === 'All' 
        ? MOCK_ANOMALIES 
        : MOCK_ANOMALIES.filter(a => a.severity === selectedSeverity);

    const maxCount = Math.max(...MOCK_TREND_DATA.map(d => d.count));

    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'Critical': return 'from-red-500 to-red-600';
            case 'High': return 'from-orange-500 to-orange-600';
            case 'Low': return 'from-emerald-500 to-emerald-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch(severity) {
            case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="w-10 h-10 text-blue-400" />
                        <div className="bg-blue-500/10 px-3 py-1 rounded-full">
                            <span className="text-xs text-blue-400 font-semibold">TOTAL</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-100 mb-1">{MOCK_KPI_DATA.logsProcessed}</div>
                    <div className="text-sm text-slate-400">Logs Processed</div>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all shadow-lg shadow-red-500/10">
                    <div className="flex items-center justify-between mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-400" />
                        <div className="bg-red-500/20 px-3 py-1 rounded-full animate-pulse">
                            <span className="text-xs text-red-300 font-semibold">ALERT</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-red-400 mb-1">{MOCK_KPI_DATA.criticalAnomalies}</div>
                    <div className="text-sm text-red-300/70">Critical Anomalies</div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-10 h-10 text-cyan-400" />
                        <div className="bg-cyan-500/10 px-3 py-1 rounded-full">
                            <span className="text-xs text-cyan-400 font-semibold">SPEED</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-100 mb-1">{MOCK_KPI_DATA.processingTime}</div>
                    <div className="text-sm text-slate-400">Processing Time</div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-10 h-10 text-emerald-400" />
                        <div className="bg-emerald-500/10 px-3 py-1 rounded-full">
                            <span className="text-xs text-emerald-400 font-semibold">STATUS</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-100 mb-1">{MOCK_KPI_DATA.pendingRemediation}</div>
                    <div className="text-sm text-slate-400">Pending Remediation</div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-purple-500/10 backdrop-blur border border-blue-500/20 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl flex-shrink-0">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">AI-Generated Risk Narrative</h3>
                        <p className="text-slate-300 leading-relaxed">{MOCK_KPI_DATA.nlpSummary}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-100 mb-6">Anomaly Detection Trend</h3>
                    <div className="h-64 flex items-end justify-around gap-4">
                        {MOCK_TREND_DATA.map((point) => {
                            const heightPercent = (point.count / maxCount) * 100;
                            const isHigh = point.count >= 8;
                            return (
                                <div key={point.day} className="flex-1 flex flex-col items-center gap-3">
                                    <div className="text-sm font-bold text-slate-300">{point.count}</div>
                                    <div 
                                        className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer ${
                                            isHigh 
                                                ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-lg shadow-red-500/50' 
                                                : 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-500/30'
                                        }`}
                                        style={{ height: `${heightPercent}%` }}
                                    />
                                    <div className="text-xs text-slate-400 font-medium">{point.day}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-100 mb-6">Severity Distribution</h3>
                    <div className="space-y-4">
                        {['Critical', 'High', 'Low'].map(severity => {
                            const count = MOCK_ANOMALIES.filter(a => a.severity === severity).length;
                            const percentage = (count / MOCK_ANOMALIES.length) * 100;
                            return (
                                <div key={severity}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-300">{severity}</span>
                                        <span className="text-sm font-bold text-slate-100">{count}</span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${getSeverityColor(severity)} transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-100">Detailed Anomaly Report</h3>
                    <div className="flex items-center gap-3">
                        <select 
                            value={selectedSeverity}
                            onChange={(e) => setSelectedSeverity(e.target.value)}
                            className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                            <option>All</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Low</option>
                        </select>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {filteredAnomalies.map((anomaly) => (
                        <div 
                            key={anomaly.id}
                            className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getSeverityBadge(anomaly.severity)}`}>
                                        {anomaly.severity}
                                    </span>
                                    <span className="text-slate-400 text-sm font-mono">{anomaly.id}</span>
                                </div>
                                <span className="text-slate-400 text-sm">{anomaly.timestamp}</span>
                            </div>
                            
                            <h4 className="text-slate-100 font-semibold mb-2">{anomaly.summary}</h4>
                            <p className="text-slate-400 text-sm mb-3">{anomaly.userSystem}</p>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 flex-wrap">
                                    {anomaly.regTags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => alert(`Investigating ${anomaly.id}...`)}
                                    disabled={anomaly.status === 'Closed'}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        anomaly.status === 'Closed'
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                                    }`}
                                >
                                    {anomaly.status === 'Closed' ? 'Closed' : 'Investigate'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// =================================================================
// REGULATORY REPORTING TAB
// =================================================================

const RegulatoryReporting: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert('Report generated successfully! Processing 250,000 transactions in 3.2 minutes.');
        }, 2000);
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Generated': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'In Progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Pending': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Generated': return <CheckCircle className="w-4 h-4" />;
            case 'In Progress': return <Clock className="w-4 h-4" />;
            case 'Pending': return <Calendar className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <FileText className="w-10 h-10 text-blue-400" />
                        <div className="bg-blue-500/10 px-3 py-1 rounded-full">
                            <span className="text-xs text-blue-400 font-semibold">TOTAL</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-100 mb-1">12</div>
                    <div className="text-sm text-slate-400">Reports This Quarter</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all shadow-lg shadow-emerald-500/10">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                        <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
                            <span className="text-xs text-emerald-300 font-semibold">DONE</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">2</div>
                    <div className="text-sm text-emerald-300/70">Generated Reports</div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-10 h-10 text-cyan-400" />
                        <div className="bg-cyan-500/10 px-3 py-1 rounded-full">
                            <span className="text-xs text-cyan-400 font-semibold">SPEED</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-100 mb-1">3.2 min</div>
                    <div className="text-sm text-slate-400">Avg Generation Time</div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="w-10 h-10 text-purple-400" />
                        <div className="bg-purple-500/10 px-3 py-1 rounded-full">
                            <span className="text-xs text-purple-400 font-semibold">DATA</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-100 mb-1">2.5M+</div>
                    <div className="text-sm text-slate-400">Transactions Processed</div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10 backdrop-blur border border-purple-500/20 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">AI-Powered Regulatory Reporting</h3>
                        <p className="text-slate-300 leading-relaxed">
                            Our AI system automatically parses transaction and ledger data to generate compliance-ready regulatory reports. 
                            Reduce reporting time from weeks to minutes while ensuring accuracy and regulatory compliance. 
                            Support for Central Bank, Basel III, AML, CCAR, and custom reporting frameworks.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-100 mb-6">Generate New Report</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
                            <select 
                                value={selectedReport}
                                onChange={(e) => setSelectedReport(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Select Report Type</option>
                                <option value="lcr">Liquidity Coverage Ratio (LCR)</option>
                                <option value="aml">Anti-Money Laundering (AML)</option>
                                <option value="basel">Basel III Capital Adequacy</option>
                                <option value="ccar">CCAR Stress Testing</option>
                                <option value="kyc">KYC Compliance Report</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Reporting Period</label>
                            <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
                                <option>Q4 2025</option>
                                <option>Q3 2025</option>
                                <option>Q2 2025</option>
                                <option>Q1 2025</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Data Source</label>
                            <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                <span>Core Banking System</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            disabled={!selectedReport || isGenerating}
                            className={`w-full py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                !selectedReport || isGenerating
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                            }`}
                        >
                            {isGenerating ? (
                                <>
                                    <Clock className="w-4 h-4 animate-spin" />
                                    Generating Report...
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="w-4 h-4" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-100 mb-6">Recent Reports</h3>
                    
                    <div className="space-y-3">
                        {MOCK_REPORTS.map((report) => (
                            <div 
                                key={report.id}
                                className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 ${getStatusColor(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                {report.status}
                                            </span>
                                            <span className="text-slate-400 text-xs font-mono">{report.id}</span>
                                        </div>
                                        <h4 className="text-slate-100 font-semibold text-lg">{report.name}</h4>
                                        <p className="text-slate-400 text-sm mt-1">{report.type}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                                    <div className="flex gap-6 text-sm">
                                        <div>
                                            <span className="text-slate-400">Period:</span>
                                            <span className="text-slate-200 ml-2 font-medium">{report.period}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Due:</span>
                                            <span className="text-slate-200 ml-2 font-medium">{report.dueDate}</span>
                                        </div>
                                        {report.size !== '-' && (
                                            <div>
                                                <span className="text-slate-400">Size:</span>
                                                <span className="text-slate-200 ml-2 font-medium">{report.size}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {report.status === 'Generated' && (
                                        <button
                                            onClick={() => alert(`Downloading ${report.name}...`)}
                                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// MAIN DASHBOARD WITH TABS
// =================================================================

const AALA_Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'audit' | 'reporting'>('audit');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg shadow-blue-500/20">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    AI Banking Compliance Suite
                                </h1>
                                <p className="text-slate-400 text-sm mt-1">Enterprise Risk & Regulatory Management Platform</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400">Last Updated</div>
                            <div className="text-slate-200 font-mono">2025-10-06 04:05:00 UTC</div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'audit'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <Shield className="w-5 h-5" />
                            AI Audit Log Analyzer
                        </button>
                        <button
                            onClick={() => setActiveTab('reporting')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === 'reporting'
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                        >
                            <FileText className="w-5 h-5" />
                            Regulatory Reporting Assistant
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'audit' ? <AuditLogAnalyzer /> : <RegulatoryReporting />}
            </div>
        </div>
    );
};

export default AALA_Dashboard;
