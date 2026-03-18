import { Briefcase, Heart, Code, Globe } from 'lucide-react';

/**
 * AboutPage - personal information and bio
 */
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Chief IT Systems Architect at Vodafone, technology enthusiast, and father of 3
        </p>
      </div>

      {/* Professional Background */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-gray-900">Professional Background</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            As Chief IT Systems Architect at Vodafone, I focus on designing and implementing 
            cutting-edge technology solutions that drive innovation and business transformation 
            in the telecommunications industry.
          </p>
          <p>
            My work spans across AI agents, cloud architecture, network automation, and digital 
            transformation initiatives. I'm passionate about exploring how emerging technologies 
            can solve real-world problems and create value for customers and businesses.
          </p>
        </div>
      </div>

      {/* Expertise & Interests */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-gray-900">Areas of Expertise</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Technology</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• AI Agents & Automation</li>
              <li>• Cloud Architecture</li>
              <li>• Network Automation</li>
              <li>• Digital Transformation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Industry Focus</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Telecommunications</li>
              <li>• Enterprise IT Systems</li>
              <li>• API Standards (TM Forum)</li>
              <li>• Innovation & R&D</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content & Speaking */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-gray-900">Content & Speaking</h2>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            I regularly share insights through presentations at industry conferences, articles 
            on technology trends, and contributions to thought leadership in the telecom and 
            AI spaces. This portfolio showcases my work in:
          </p>
          <ul className="space-y-2 ml-4">
            <li>• Conference presentations and keynotes</li>
            <li>• Technical articles and blog posts</li>
            <li>• Video discussions and demos</li>
            <li>• Podcast appearances</li>
            <li>• Social media thought leadership</li>
          </ul>
        </div>
      </div>

      {/* Personal */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-gray-900">Beyond Work</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          When I'm not architecting technology solutions, I'm spending time with my three children, 
          exploring new technologies, and staying curious about how innovation can make the world 
          a better place. I believe in the power of continuous learning and sharing knowledge 
          with the community.
        </p>
      </div>
    </div>
  );
}
