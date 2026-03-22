import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Overview } from '@/pages/Overview'
import { Tasks } from '@/pages/Tasks'
import { TaskDetail } from '@/pages/TaskDetail'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Overview />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/agents" element={<Overview />} />
          <Route path="/metrics" element={<Overview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
