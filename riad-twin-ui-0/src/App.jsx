import Header from './features/dashboard/components/Header'
import StatsBar from './features/dashboard/components/StatsBar'
import RiadScene from './features/riad/components/RiadScene'
import ChatPanel from './features/chat/components/ChatPanel'

export default function App() {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 pt-0 lg:flex-row">
        <section className="relative min-h-[380px] flex-1 overflow-hidden rounded-2xl bg-sand-100 shadow-card">
          <RiadScene />
          <div className="pointer-events-none absolute left-3 right-3 top-3">
            <StatsBar />
          </div>
        </section>

        <aside className="h-[520px] w-full lg:h-auto lg:w-[400px]">
          <ChatPanel />
        </aside>
      </main>
    </div>
  )
}
