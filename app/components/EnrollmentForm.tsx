"use client";

import { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type EnrollmentFormProps = {
    record: any;
};

type EnrollmentFormData = {
    enrollmentType: string;
    campus: string;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    gender: string;
    grade: string;
    parent1First: string;
    parent1Last: string;
    parent1Email: string;
    parent1Phone: string;
    parent2First: string;
    parent2Last: string;
    parent2Email: string;
    parent2Phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    emergencyFirst: string;
    emergencyLast: string;
    emergencyRelation: string;
    emergencyPhone: string;
    pickupFirst: string;
    pickupLast: string;
    pickupRelation: string;
    pickupPhone: string;
    referred: string;
    referredBy: string;
    immersion: string;
    days: string[];
    paymentPlan: string;
    startDate: string;
    custody: string;
    signature: string; // we’ll save signature as base64 image
};

function getParentField(parent: any, entityId: string, name: string) {
    const entity = parent?.Value?.find((v: any) => v.EntityId === entityId);
    return entity?.Value?.find((f: any) => f.Name === name)?.Value || "";
}

export default function EnrollmentForm({ record }: EnrollmentFormProps) {
    const { control, register, handleSubmit, reset, setValue, watch, getValues } = useForm<EnrollmentFormData>();
    const [submitted, setSubmitted] = useState(false);
    const sigCanvas = useRef<SignatureCanvas>(null);

    const drawDefaultSignature = (text: string) => {
        const canvas = sigCanvas.current?.getCanvas();
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear before drawing
        
        const fontSize = Math.max(14, Math.floor(canvas.width / 20));
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = "#555"; // gray placeholder color
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    };

    useEffect(() => {
        if (record) {
            const student = record.Data.find((d: any) => d.EntityId === "fullname");
            const dob = record.Data.find((d: any) => d.EntityId === "dob");
            const gender = record.Data.find((d: any) => d.EntityId === "gender");

            const grade = record.Data.find((d: any) => d.EntityId === "custom-select:63e574d4c66dc");
            const parent = record.Data.filter((d: any) => d.EntityId === "parent");
            const parent1 = parent[0];
            const parent2 = parent[1];
            const emergency = record.Data.find((d: any) => d.EntityId === "emergency-contact");
            const pickup = record.Data.find((d: any) => d.EntityId === "emergency-contact");
            const parentName =
                `${getParentField(parent1, "fullname", "FirstName")} ${getParentField(parent1, "fullname", "LastName")}`.trim();

            if (parentName) {
                drawDefaultSignature(parentName);
                // store it as default signature value in the form
                const dataUrl = sigCanvas.current?.getCanvas().toDataURL("image/png");
                if (dataUrl) setValue("signature", dataUrl);
            }

            reset({
                firstName: student?.Value?.find((v: any) => v.Name === "FirstName")?.Value || "",
                middleName: student?.Value?.find((v: any) => v.Name === "MiddleName")?.Value || "",
                lastName: student?.Value?.find((v: any) => v.Name === "LastName")?.Value || "",
                dob: dob?.Value?.find((v: any) => v.Name === "DOB")?.Value || "",
                gender: gender?.Value?.find((v: any) => v.Name === "Gender")?.Value === 3 ? "Female" : "Male",
                grade: grade?.Value?.find((v: any) => v.Name === "CustomSelect")?.Value || "",
                parent1First: getParentField(parent1, "fullname", "FirstName") || "",
                parent1Last: getParentField(parent1, "fullname", "LastName") || "",
                parent1Email: getParentField(parent1, "email", "EmailAddress") || "",
                parent1Phone: getParentField(parent1, "phone", "PhoneNumber") || "",
                parent2First: getParentField(parent2, "fullname", "FirstName") || "",
                parent2Last: getParentField(parent2, "fullname", "LastName") || "",
                parent2Email: getParentField(parent2, "email", "EmailAddress") || "",
                parent2Phone: getParentField(parent2, "phone", "PhoneNumber") || "",

                address: getParentField(parent1, "address", "Address") || "",
                city: getParentField(parent1, "address", "City") || "",
                //state: getParentField(parent1, "address", "State") || "",
                state: 'California',
                zip: getParentField(parent1, "address", "Zip") || "",

                emergencyFirst: emergency?.Value?.find((v: any) => v.Name === "Name")?.Value?.split(" ")[0] || "",
                emergencyLast: emergency?.Value?.find((v: any) => v.Name === "Name")?.Value?.split(" ").slice(1).join(" ") || "",
                emergencyRelation: emergency?.Value?.find((v: any) => v.Name === "Relationship")?.Value || "",
                //emergencyRelation: 'Parent',
                emergencyPhone: emergency?.Value?.find((v: any) => v.Name === "PhoneNumberPrimary")?.Value || "",

                pickupFirst: pickup?.Value?.find((v: any) => v.Name === "Name")?.Value?.split(" ")[0] || "",
                pickupLast: pickup?.Value?.find((v: any) => v.Name === "Name")?.Value?.split(" ").slice(1).join(" ") || "",
                pickupRelation: pickup?.Value?.find((v: any) => v.Name === "Relationship")?.Value || "",
                //pickupRelation: 'Parent',
                pickupPhone: pickup?.Value?.find((v: any) => v.Name === "PhoneNumberPrimary")?.Value || "",
            });
        }
    }, [record, reset]);

    const clearSignature = () => {
        sigCanvas.current?.clear();

        const parentName = `${getParentField(record?.Data.find((d: any) => d.EntityId === "parent"), "fullname", "FirstName")} ${getParentField(record?.Data.find((d: any) => d.EntityId === "parent"), "fullname", "LastName")
            }`.trim();

        if (parentName) {
            drawDefaultSignature(parentName);
            const dataUrl = sigCanvas.current?.getCanvas().toDataURL("image/png");
            if (dataUrl) setValue("signature", dataUrl);
        } else {
            setValue("signature", "");
        }
    };

    const saveSignature = () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
            setValue("signature", dataUrl); // stores it in form data
        }
    };

    const onSubmit = (data: EnrollmentFormData) => {
        console.log(data);
        setSubmitted(true);
    };

    if (submitted) {
        // nothing
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white shadow rounded-2xl">
            {/* Intro Text */}
            <div className="mb-8 text-center">
                <div className="text-red-600 font-bold mb-2">REMINDER:</div>
                <div className="mb-2">
                    Welcome, thank you for your interest in enrolling your student(s) in Seashore Academy 2023-2024 academic year!
                </div>
            </div>

            <div className="w-full my-8">
                <div className="border text-center text-xl font-normal py-2 bg-white">
                    Student Information
                </div>
            </div>

            {/* Enrollment Type */}
            <div>
                <Label className="block mb-2">Enrollment Type <span className="text-red-600">*</span></Label>
                <RadioGroup
                    defaultValue="Re-Enrollment"
                    className="flex flex-row items-center gap-8"
                    {...register("enrollmentType")}
                >
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="Re-Enrollment" id="re" />
                        <span>Re-Enrollment</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="New Student" id="new" />
                        <span>New Student</span>
                    </label>
                </RadioGroup>
            </div>

            {/* Campus */}
            <div>
                <Label className="block mb-2">Campus Location <span className="text-red-600">*</span></Label>
                <Input {...register("campus")} defaultValue="Newport Beach" />
            </div>

            {/* Student Info */}
            <div>
                <Label className="block mb-2">
                    Student #1 Name <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input placeholder="First Name" {...register("firstName")} />
                        <div className="text-xs text-gray-400 mt-1">First Name</div>
                    </div>
                    <div>
                        <Input placeholder="Middle Name" {...register("middleName")} />
                        <div className="text-xs text-gray-400 mt-1">Middle Name</div>
                    </div>
                    <div>
                        <Input placeholder="Last Name" {...register("lastName")} />
                        <div className="text-xs text-gray-400 mt-1">Last Name</div>
                    </div>
                </div>
            </div>

            {/* Student #1 Date of Birth */}
            <div className="mt-6 max-w-xs">
                <Label className="block mb-2">
                    Student #1 Date of Birth <span className="text-red-600">*</span>
                </Label>
                <Input
                    type="date"
                    {...register("dob")}
                    className="mb-1 inline"
                />
                <div className="text-xs text-gray-400">dd-MMM-yyyy</div>
            </div>

            {/* Student #1 Gender */}
            <div className="mt-6">
                <Label className="block mb-2">
                    Student #1 Gender <span className="text-red-600">*</span>
                </Label>
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-row gap-4"
                        >
                            <label className="flex items-center gap-2">
                                <RadioGroupItem value="Male" id="male" />
                                <span>Male</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <RadioGroupItem value="Female" id="female" />
                                <span>Female</span>
                            </label>
                        </RadioGroup>
                    )}
                />
            </div>

            {/* Grade for 2023 - 2024 Academic Year */}
            <div className="mt-6 max-w-xs">
                <Label className="block mb-2">
                    Grade for 2023 - 2024 Academic Year<span className="text-red-600 text-xl">*</span>
                </Label>

                <select {...register("grade")} className="border p-2 rounded mt-2 w-full">
                    <option value="">Select Grade</option>
                    <option value="K">Kindergarten</option>
                    <option value="1st">1st Grade</option>
                    <option value="2nd">2nd Grade</option>
                    <option value="3rd">3rd Grade</option>
                    <option value="4th">4th Grade</option>
                    <option value="5th">5th Grade</option>
                    <option value="6th">6th Grade</option>
                    <option value="7th">7th Grade</option>
                    <option value="8th">8th Grade</option>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                </select>
            </div>

            {/* Parent Info */}
            <div className="w-full my-8">
                <div className="border text-center text-xl font-normal py-2 bg-white">
                    Parent / Guardian Information
                </div>
            </div>
            {/* Primary Parent */}
            <div className="mt-8">
                <Label className="block mb-2">
                    Primary Parent <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input placeholder="First Name" {...register("parent1First")} />
                        <div className="text-xs text-gray-400 mt-1">First Name</div>
                    </div>
                    <div>
                        <Input placeholder="Last Name" {...register("parent1Last")} />
                        <div className="text-xs text-gray-400 mt-1">Last Name</div>
                    </div>
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Primary Parent Email <span className="text-red-600">*</span>
                    </Label>
                    <Input placeholder="Email" {...register("parent1Email")} />
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Primary Parent Phone <span className="text-red-600">*</span>
                    </Label>
                    <Input placeholder="Phone" {...register("parent1Phone")} />
                </div>
            </div>

            {/* Secondary Parent */}
            <div className="mt-8">
                <Label className="block mb-2">
                    Secondary Parent <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input placeholder="First Name" {...register("parent2First")} />
                        <div className="text-xs text-gray-400 mt-1">First Name</div>
                    </div>
                    <div>
                        <Input placeholder="Last Name" {...register("parent2Last")} />
                        <div className="text-xs text-gray-400 mt-1">Last Name</div>
                    </div>
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Secondary Parent Email <span className="text-red-600">*</span>
                    </Label>
                    <Input placeholder="Email" {...register("parent2Email")} />
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Secondary Parent Phone <span className="text-red-600">*</span>
                    </Label>
                    <Input placeholder="Phone" {...register("parent2Phone")} />
                </div>
            </div>

            {/* Address */}
            <div className="mt-8">
                <Label className="block mb-2">
                    Address <span className="text-red-600">*</span>
                </Label>
                <Input placeholder="Street Address" {...register("address")} className="mb-4" />
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Input placeholder="City" {...register("city")} />
                        <div className="text-xs text-gray-400 mt-1">City</div>
                    </div>
                    <div>
                        <Input placeholder="State/Region/Province" {...register("state")} />
                        <div className="text-xs text-gray-400 mt-1">State/Region/Province</div>
                    </div>
                    <div>
                        <Input placeholder="Postal / Zip Code" {...register("zip")} />
                        <div className="text-xs text-gray-400 mt-1">Postal / Zip Code</div>
                    </div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="w-full my-8">
                <div className="border text-center text-xl font-normal py-2 bg-white">
                    Emergency Contact Information
                </div>
            </div>
            <div className="mt-8">
                <Label className="block mb-2">
                    Name <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input placeholder="First Name" {...register("emergencyFirst")} />
                        <div className="text-xs text-gray-400 mt-1">First Name</div>
                    </div>
                    <div>
                        <Input placeholder="Last Name" {...register("emergencyLast")} />
                        <div className="text-xs text-gray-400 mt-1">Last Name</div>
                    </div>
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Relationship to Student <span className="text-red-600">*</span>
                    </Label>
                    <Input placeholder="Relationship" {...register("emergencyRelation")} />
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Phone Number <span className="text-red-600">*</span>
                    </Label>
                    <Input placeholder="Phone" {...register("emergencyPhone")} />
                </div>
            </div>

            {/* Authorized Pickup */}
            <div className="w-full my-8">
                <div className="border text-center text-xl font-normal py-2 bg-white">
                    Authorized Pick Ups
                </div>
            </div>
            <div className="mt-8">
                <Label className="block mb-2">
                    Name
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Input placeholder="First Name" {...register("pickupFirst")} />
                        <div className="text-xs text-gray-400 mt-1">First Name</div>
                    </div>
                    <div>
                        <Input placeholder="Last Name" {...register("pickupLast")} />
                        <div className="text-xs text-gray-400 mt-1">Last Name</div>
                    </div>
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Relationship To Student
                    </Label>
                    <Input placeholder="Relationship" {...register("pickupRelation")} />
                </div>
                <div className="mt-4">
                    <Label className="block mb-1">
                        Phone Number
                    </Label>
                    <Input placeholder="Phone" {...register("pickupPhone")} />
                </div>
            </div>

            {/* Referral */}
            <div className="w-full my-8">
                <div className="border text-center text-xl font-normal py-2 bg-white">
                    Referral Information
                </div>
            </div>

            {/* Did someone refer you? */}
            <div className="mt-8">
                <Label className="block mb-2">
                    Did someone refer you? <span className="text-red-600">*</span>
                </Label>
                <RadioGroup defaultValue="No" className="flex flex-row gap-8" {...register("referred")}>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="Yes" id="refYes" />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="No" id="refNo" />
                        <span>No</span>
                    </label>
                </RadioGroup>
            </div>

            {/* If Yes, please list the name... */}
            <div className="mt-6 max-w-md">
                <Label className="block mb-2">
                    If Yes, please list the name of the person who referred you. Put NA if none. <span className="text-red-600">*</span>
                </Label>
                <Input placeholder="Na" {...register("referredBy")} />
            </div>

            {/* Immersion Program */}
            <div className="mt-8">
                <Label className="block mb-2">
                    Would you like to enroll in our Immersion program? <span className="text-red-600">*</span>
                </Label>
                <RadioGroup defaultValue="No" className="flex flex-row gap-8" {...register("immersion")}>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="Yes" id="immYes" />
                        <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="No" id="immNo" />
                        <span>No</span>
                    </label>
                </RadioGroup>
            </div>

            {/* Days of Enrollment */}
            <div className="mt-8">
                <Label className="block mb-2 font-semibold">
                    Days of Enrollment <span className="text-red-600">*</span>
                </Label>
                <div className="mb-2 text-sm text-gray-700">
                    The days requested will determine your total tuition fee. Once confirmed, you will be invoiced accordingly.
                </div>
                <div className="mb-2 text-sm text-gray-700">
                    Check all that apply.
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" value="Monday" {...register("days")} />
                        Monday (Entrepreneurship Days)
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" value="Tue-Wed-Thu" {...register("days")} checked />
                        Tuesday + Wednesday + Thursday (Core Classes)
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" value="Friday" {...register("days")} />
                        Friday (Entrepreneurship Days)
                    </label>
                </div>
            </div>

            {/* Payment Plan */}
            <div className="w-full my-8">
                <div className="text-xl font-semibold mb-2">Payment Plan</div>
                <div className="mb-2">
                    Seashore offers three payment plans. Please select one from the choices below and your invoices will be prepared accordingly.
                </div>
                <div className="mb-2 font-semibold">
                    Acceptable Payment: <span className="font-normal">Bank transfer through the Quickbooks invoice only. We no longer accept credit card or check payments for tuition fees.</span>
                </div>
                <div className="mb-2">
                    <span className="text-red-600 text-xl">*</span>
                </div>
                <RadioGroup className="flex flex-col gap-2" {...register("paymentPlan")}>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="A" id="planA" checked />
                        <span>Option A: Payment in full in one invoice upon enrollment</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="B" id="planB" />
                        <span>Option B: Payment in two installments</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="C" id="planC" />
                        <span>Option C: Payment in monthly installments</span>
                    </label>
                </RadioGroup>
            </div>

            {/* Preferred Start Date */}
            <div className="mt-6 max-w-xs">
                <Label className="block mb-2">
                    Preferred Start Date
                </Label>
                <Input type="date" {...register("startDate")} className="mb-1" />
                <div className="text-xs text-gray-400">Please indicate the date you would like your child to start.</div>
            </div>

            {/* Important Notes */}
            <div className="mt-8">
                <div className="font-bold mb-2">Important notes:</div>
                <div className="mb-2 font-bold">
                    Our Non-Refundable Enrollment/Facilities fee is $1600 per child or $2600 for 2 or more siblings.
                </div>
                <div className="mb-2 font-bold">
                    *Once your enrollment form is complete, you will receive an invoice for your student's Enrollment/Facilities fee, along with tuition*
                </div>
                <div className="mb-2">
                    By signing below, I understand that my student will be fully enrolled in Seashore Academy only after the enrollment fee is paid. I understand that I will be invoiced for my student's enrollment/facilities fee upon completion of their enrollment form.
                </div>
                <div className="mb-2">
                    By signing below,  I understand that the enrollment/facilities fee is NON-REFUNDABLE and NON-TRANSFERABLE. Regardless of whether my child(ren) attends (s) Seashore during the applicable academic year, I agree that no portion of the Enrollment/Facilities fee can be used for tuition or any other academy fees. Further, I agree that upon payment of the non-refundable enrollment/facilities fee, a spot has been reserved for my student(s) and I am now committed to the annual tuition for the 2023-2024 academic year.
                </div>
                <div>
                    I understand that the offer of enrollment, along with the facilities/enrollment fee invoice will expire within 5 business days.
                </div>
            </div>

            {/* Custody Agreement */}
            <div className="mt-8 max-w-xs">
                <Label className="block mb-2">
                    Custody Agreement<span className="text-red-600">*</span>
                </Label>
                <select defaultValue="True" {...register("custody")} className="border p-2 rounded w-full">
                    <option value="False">No</option>
                    <option value="True">Yes</option>
                </select>
                <div className="text-xs text-gray-400 mt-1">
                    Are there any pertinent issues regarding custody that we should be aware of for pick-ups and drop-offs?
                </div>
            </div>

            {/* Signature */}
            <div className="mt-8">
                <Label className="block mb-2">Signature<span className="text-red-600">*</span></Label>
                <div className="border rounded-xl p-2 bg-gray-50">
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ className: "w-full h-40 bg-white rounded" }}
                    />
                </div>
                {/* <div className="flex gap-3 mt-2">
                    <Button type="button" variant="secondary" onClick={clearSignature}>
                        Clear
                    </Button>
                    <Button type="button" onClick={saveSignature}>
                        Save Signature
                    </Button>
                </div> */}
                {/* Hidden input to hold signature data */}
                <input type="hidden" {...register("signature")} />
            </div>

            {/* <Button type="submit" className="mt-6 w-full">
                Submit Enrollment Form
            </Button> */}
        </form>
    );
}
