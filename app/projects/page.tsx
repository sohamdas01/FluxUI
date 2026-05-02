import Header from "../_shared/Header";
import ProjectList from "../_shared/ProjectList";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-50">
        <Header />
      </div>
      <div className="px-10 md:px-24 lg:px-44 xl:px-56 mt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-gray-500 mt-1 text-sm">All your AI-generated UI designs in one place.</p>
        </div>
        <ProjectList />
      </div>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[-200px] right-[-200px] h-[500px] w-[500px] bg-pink-400/20 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}