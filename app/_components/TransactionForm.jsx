"use client"

import React from 'react'
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { COUNTRIES, CURRENCIES, PAYMENT_TYPES, RISK_CONFIG } from "@/utils/data"
import ResultCard from './ResultCard'

/* ─── reusable field label ─────────────────────── */
const FieldLabel = ({ children }) => (
    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">
        {children}
    </label>
)

/* ─── error message ────────────────────────────── */
const FieldError = ({ message }) =>
    message ? <p className="mt-1 text-[11px] text-red-400/80">{message}</p> : null

const TransactionForm = ({ onSuccess }) => {
    const [result, setResult] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState(null)

    const inputCls = (hasError) =>
        `w-full bg-white/[0.06] border text-white/85 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-indigo-500/60 focus-visible:border-indigo-500/40 transition-colors ${
            hasError
                ? "border-red-500/40 bg-red-500/5"
                : "border-white/[0.08] hover:border-white/[0.14]"
        }`

    const triggerCls = (hasError) =>
        `w-full bg-white/[0.06] border text-white/85 hover:bg-white/[0.09] focus:ring-1 focus:ring-indigo-500/60 transition-colors ${
            hasError
                ? "border-red-500/40"
                : "border-white/[0.08] hover:border-white/[0.14]"
        }`

    // shared classes for every SelectContent + SelectItem
    const contentCls = "bg-[#1c2136] border border-white/[0.09] !text-white shadow-xl shadow-black/40"
    const itemCls    = "cursor-pointer"

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        setResult(null)
        setApiError(null)
        setIsLoading(true)
        const payload = { ...data, Amount: Number(data.Amount) }
        try {
            const res = await axios.post("http://127.0.0.1:8000/predict", payload)
            setResult(res.data)
            onSuccess?.()
        } catch (error) {
            console.error("API Error:", error)
            setApiError("Failed to reach the prediction service. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-1">

            {/* Section heading */}
            <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-white/90 tracking-tight">Analyze Transaction</h2>
                <p className="text-[12px] text-white/35 mt-1 leading-relaxed">
                    Enter transaction details to assess fraud risk in real time.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Amount */}
                <div>
                    <FieldLabel>Transaction Amount</FieldLabel>
                    <div className="relative">
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className={`${inputCls(errors.Amount)} pl-7`}
                            {...register("Amount", {
                                required: "Amount is required",
                                min: { value: 0.01, message: "Must be greater than 0" },
                                max: { value: 10_000_000, message: "Cannot exceed 10,000,000" },
                            })}
                        />
                    </div>
                    <FieldError message={errors.Amount?.message} />
                </div>

                {/* Divider */}
                <div className="border-t border-white/[0.06]" />

                {/* Payment Currency & Received Currency */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Payment Currency", name: "Payment_currency" },
                        { label: "Received Currency", name: "Received_currency" },
                    ].map(({ label, name }) => (
                        <div key={name}>
                            <FieldLabel>{label}</FieldLabel>
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: "Required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className={triggerCls(errors[name])}>
                                            <SelectValue placeholder="Currency" />
                                        </SelectTrigger>
                                        <SelectContent
                                            position="popper"
                                            className={contentCls}
                                        >
                                            {CURRENCIES.map((c) => (
                                                <SelectItem
                                                    key={c} value={c}
                                                    className={itemCls}
                                                >
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError message={errors[name]?.message} />
                        </div>
                    ))}
                </div>

                {/* Sender Country & Receiver Country */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Sender Country", name: "Sender_bank_location" },
                        { label: "Receiver Country", name: "Receiver_bank_location" },
                    ].map(({ label, name }) => (
                        <div key={name}>
                            <FieldLabel>{label}</FieldLabel>
                            <Controller
                                name={name}
                                control={control}
                                rules={{ required: "Required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className={triggerCls(errors[name])}>
                                            <SelectValue placeholder="Country" />
                                        </SelectTrigger>
                                        <SelectContent
                                            position="popper"
                                            className={contentCls}
                                        >
                                            {COUNTRIES.map((cName) => (
                                                <SelectItem
                                                    key={cName} value={cName}
                                                    className={itemCls}
                                                >
                                                    {cName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <FieldError message={errors[name]?.message} />
                        </div>
                    ))}
                </div>

                {/* Payment Type */}
                <div>
                    <FieldLabel>Payment Type</FieldLabel>
                    <Controller
                        name="Payment_type"
                        control={control}
                        rules={{ required: "Payment type is required" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <SelectTrigger className={triggerCls(errors.Payment_type)}>
                                    <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent
                                    position="popper"
                                    className={contentCls}
                                >
                                    {PAYMENT_TYPES.map((type) => (
                                        <SelectItem
                                            key={type} value={type}
                                            className={itemCls}
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <FieldError message={errors.Payment_type?.message} />
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all border-0"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Analyzing…
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            
                            Analyze Transaction
                        </span>
                    )}
                </Button>

            </form>

            {/* API error */}
            {apiError && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                    {apiError}
                </div>
            )}

            {/* Result card */}
            {result && (
                <div className="mt-4">
                    <ResultCard result={result} RISK_CONFIG={RISK_CONFIG} />
                </div>
            )}
        </div>
    )
}

export default TransactionForm
