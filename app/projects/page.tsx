import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Our Projects | Groundmakers Concrete & Landscaping',
  description: 'Browse real projects completed by Groundmakers across Melbourne\'s Western Suburbs.',
};

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <ProjectsClient />
    </div>
  );
}
