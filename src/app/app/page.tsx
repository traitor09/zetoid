import { AIDigestWidget } from '@/components/AIDigestWidget';
import { AddTask } from '@/components/AddTask';
import { TaskList } from '@/components/TaskList';
import { getTasksAction } from '@/server/actions';

export const revalidate = 0; // Dynamic server component

export default async function DashboardPage() {
  const tasks = await getTasksAction();

  return (
    <div className="space-y-6">
      {/* AI Daily Digest Briefing Card */}
      <AIDigestWidget />

      {/* Natural Language Add Bar */}
      <AddTask />

      {/* Task List Component */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Tasks Dashboard
          </h2>
        </div>
        <TaskList initialTasks={tasks} />
      </div>
    </div>
  );
}
