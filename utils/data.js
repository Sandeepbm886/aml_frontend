export const CURRENCIES = ['Albanian lek', 'Dirham', 'Euro', 'Indian rupee', 'Mexican Peso', 'Moroccan dirham', 'Naira', 'Pakistani rupee', 'Swiss franc', 'Turkish lira', 'UK pounds', 'US dollar', 'Yen']

export const COUNTRIES = ['Albania', 'Austria', 'France', 'Germany', 'India', 'Italy', 'Japan', 'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Pakistan', 'Spain', 'Switzerland', 'Turkey', 'UAE', 'UK', 'USA']

export const PAYMENT_TYPES = ['ACH', 'Cash Deposit', 'Cash Withdrawal', 'Cheque', 'Credit card', 'Cross-border', 'Debit card']

export const RISK_CONFIG = {
    Low: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        bar: "bg-emerald-400",
        icon: "✓",
        iconBg: "bg-emerald-100 text-emerald-600",
        label: "Low Risk",
        description: "This transaction appears normal. No suspicious patterns detected.",
    },
    Medium: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "bg-amber-100 text-amber-700 border border-amber-200",
        bar: "bg-amber-400",
        icon: "⚠",
        iconBg: "bg-amber-100 text-amber-600",
        label: "Medium Risk",
        description: "Some unusual patterns detected. Manual review is recommended.",
    },
    High: {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-100 text-red-700 border border-red-200",
        bar: "bg-red-400",
        icon: "✕",
        iconBg: "bg-red-100 text-red-600",
        label: "High Risk",
        description: "Suspicious activity detected. This transaction should be flagged immediately.",
    },
}