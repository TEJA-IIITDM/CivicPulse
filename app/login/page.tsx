
import OfficialLogin from "@/components/OfficialLogin";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            CivicPulse
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Official infrastructure management login
          </p>
        </div>
        <OfficialLogin />
        <p className="mt-5 text-center text-xs text-slate-500">
          Authorized municipal officials only
        </p>
      </div>
    </main>
  );
}
