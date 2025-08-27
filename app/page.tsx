import fs from "fs";
import path from "path";
import { DataTable } from "./components/DataTable";

export default async function HomePage() {
  const processPath = path.join(process.cwd(), "public", "ProcessData_fixed.json");
  const gradesPath = path.join(process.cwd(), "public", "GradeLevels_fixed.json");

  const processData = JSON.parse(fs.readFileSync(processPath, "utf-8"));
  const gradeLevels = JSON.parse(fs.readFileSync(gradesPath, "utf-8"));

  // Ensure we always get an array
  const gradeList = Array.isArray(gradeLevels) ? gradeLevels : gradeLevels.data || [];

  // Build lookup map { gradeId: gradeName }
  const gradeLevelMap: Record<string, string> = {};
  gradeList.forEach((g: any) => {
    gradeLevelMap[g._id] = g.Name;
  });

  // Map records with StudentName + friendly GradeLevel
  const data = processData
    .map((r: any) => {
      const student = r.Data && r.Data.find((d: any) => d.EntityId === "fullname");

      const first = student?.Value?.find((v: any) => v.Name === "FirstName")?.Value || "";
      const middle = student?.Value?.find((v: any) => v.Name === "MiddleName")?.Value || "";
      const last = student?.Value?.find((v: any) => v.Name === "LastName")?.Value || "";

      return {
        ...r,
        StudentName: [first, middle, last].filter(Boolean).join(" "),
        GradeLevel: gradeLevelMap[r.GradeLevelId] || r.GradeLevelId, // ✅ use friendly name
      };
    })
    .sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seashore Academy</h1>
      <DataTable data={data} />
    </main>
  );
}
