import fs from "fs";
import path from "path";
import Image from 'next/image';
import EnrollmentForm from "../../components/EnrollmentForm";

export default async function FormPage({ params }: { params: { id: string } }) {
    const filePath = path.join(process.cwd(), "public", "ProcessData_fixed.json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const records = JSON.parse(fileData);

    const record = records.find((r: any) => r._id === params.id);

    if (!record) {
        return <div className="p-6 text-red-600">Record not found</div>;
    }

    return (
        <main className="p-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-6">
                <Image src="/seashore-logo.jpg" alt="Seashore Academy" width={500} height={300} className="" />
                <h1 className="text-2xl font-bold">Seashore Academy Enrollment Form 2023-2024</h1>
            </div>            
            <EnrollmentForm record={record} />
        </main>
    );
}
