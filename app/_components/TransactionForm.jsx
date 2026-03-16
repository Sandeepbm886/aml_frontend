"use client"

import React from 'react'
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
const TransactionForm = ({onSuccess}) => {
    const [result, setResult] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState(null)
    const triggerCls = (hasError) =>
        `w-full bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-400 ${hasError ? "border-red-500" : ""}`

    const inputCls = (hasError) =>
        `w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400 ${hasError ? "border-red-500" : ""}`

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

        const payload = {
            ...data,
            Amount: Number(data.Amount),
        }

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
        <div className="flex justify-center items-start min-h-screen  py-5">
            <Card className="w-120 bg-white border-gray-200 text-gray-900">
                <CardHeader>
                    <CardTitle className="text-gray-900">Transaction analysis</CardTitle>
                    <p className="text-sm text-gray-500">
                        Enter details to flag suspicious activity
                    </p>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Amount */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Transaction Amount
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className={inputCls(errors.Amount)}
                                {...register("Amount", {
                                    required: "Amount is required",
                                    min: { value: 0.01, message: "Amount must be greater than 0" },
                                    max: { value: 10_000_000, message: "Amount cannot exceed 10,000,000" },
                                })}
                            />
                            {errors.Amount && (
                                <p className="text-xs text-red-400">{errors.Amount.message}</p>
                            )}
                        </div>

                        {/* Payment Currency & Received Currency */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Payment Currency", name: "Payment_currency" },
                                { label: "Received Currency", name: "Received_currency" },
                            ].map(({ label, name }) => (
                                <div key={name} className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                        {label}
                                    </label>
                                    <Controller
                                        name={name}
                                        control={control}
                                        rules={{ required: "Required" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                                <SelectTrigger className={triggerCls(errors[name])}>
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                                <SelectContent position="popper"
                                                    className="w-[--radix-select-trigger-width] bg-white border-gray-200 text-gray-900">
                                                    {CURRENCIES.map((name) => (
                                                        <SelectItem key={name} value={name}
                                                            className="focus:bg-gray-100 focus:text-gray-900">
                                                            {name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors[name] && (
                                        <p className="text-xs text-red-400">{errors[name].message}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Sender Country & Receiver Country */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Sender Country", name: "Sender_bank_location" },
                                { label: "Receiver Country", name: "Receiver_bank_location" },
                            ].map(({ label, name }) => (
                                <div key={name} className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                        {label}
                                    </label>
                                    <Controller
                                        name={name}
                                        control={control}
                                        rules={{ required: "Required" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                                <SelectTrigger className={triggerCls(errors[name])}>
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent position="popper"
                                                    className="w-[--radix-select-trigger-width] bg-white border-gray-200 text-gray-900">
                                                    {COUNTRIES.map((cName) => (
                                                        <SelectItem key={cName} value={cName}
                                                            className="focus:bg-gray-100 focus:text-gray-900">
                                                            {cName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors[name] && (
                                        <p className="text-xs text-red-400">{errors[name].message}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Payment Type */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Payment Type
                            </label>
                            <Controller
                                name="Payment_type"
                                control={control}
                                rules={{ required: "Payment type is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className={triggerCls(errors.Payment_type)}>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent position="popper"
                                            className="w-[--radix-select-trigger-width] bg-white border-gray-200 text-gray-900">
                                            {PAYMENT_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}
                                                    className="focus:bg-gray-100 focus:text-gray-900">
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.Payment_type && (
                                <p className="text-xs text-red-400">{errors.Payment_type.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gray-900 hover:bg-gray-700 text-white disabled:opacity-60"
                        >
                            {isLoading ? "Analyzing…" : "Analyze Transaction"}
                        </Button>

                    </form>

                    {/* API error */}
                    {apiError && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                            {apiError}
                        </div>
                    )}

                    {/* Result summary card */}
                    {result && <ResultCard result={result} RISK_CONFIG={RISK_CONFIG} />}

                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionForm