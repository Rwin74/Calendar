import Calendar from "@/components/Calendar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            İş Ortaklığı Takvimi
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Toplantılar ve notlar için işbirlikçi takvim
          </p>
        </header>
        <Calendar />
      </div>
    </main>
  )
}
