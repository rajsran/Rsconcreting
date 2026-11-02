import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Our Projects',
  alternates: { canonical: '/projects' },
  description: 'Browse real projects completed by RS Concrete Creations & Landscaping across Melbourne\'s Western Suburbs.',
};

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <ProjectsClient />
    </div>
  );
}
