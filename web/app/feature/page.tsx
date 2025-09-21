'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Bell,
  Globe,
  Server,
  CheckCircle,
  TrendingUp,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const FeaturePage = () => {
  const features = [
    {
      icon: <Activity className="h-8 w-8 text-blue-500" />,
      title: 'Real-time Monitoring',
      description:
        'Monitor your websites and APIs in real-time with instant status updates and response time tracking.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: 'Advanced Analytics',
      description:
        'Get detailed insights with interactive charts, uptime statistics, and performance trends over time.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap className="h-8 w-8 text-indigo-500" />,
      title: 'Lightning Fast',
      description:
        'Built with performance in mind, get results in milliseconds with our optimized monitoring infrastructure.',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const stats = [
    { label: 'Uptime Guarantee', value: '99.9%', icon: <CheckCircle className="h-5 w-5" /> },
    { label: 'Response Time', value: '<100ms', icon: <Clock className="h-5 w-5" /> },
    { label: 'Global Locations', value: '15+', icon: <Globe className="h-5 w-5" /> },
    { label: 'Monitors Supported', value: '1000+', icon: <Server className="h-5 w-5" /> },
  ];

  const router = useRouter();

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              Elite Cron Plateform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-6">
              Powerful Features for
              <br />
              <span className="bg-gradient-to-r">Complete Monitoring</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Discover the comprehensive suite of tools designed to keep your services running
              smoothly and your users happy with real-time insights and proactive monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  router.push('/');
                }}
                size="lg"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Our comprehensive monitoring platform provides all the tools you need to ensure your
            services are always performing at their best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 backdrop-blur-sm hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-4`}
                >
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Monitoring?</h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust our platform to keep their services running
              smoothly. Start monitoring your applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-slate-100 cursor-pointer"
                onClick={()=> {
                  router.push('/');
                }}
              >
                Start Free
              </Button>
              <Button 
              onClick={()=> {
                window.open('https://github.com/AshutoshDM1/Aws-Cron', '_blank');
              }}
              size="lg" variant="link" className="border-white text-black bg-white cursor-pointer">
                Give a Star <Star className="w-3 h-3 text-yellow-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeaturePage;
