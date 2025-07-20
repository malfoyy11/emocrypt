import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: 'primary' | 'secondary';
}

export function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  const gradientClass = gradient === 'primary' ? 'bg-gradient-primary' : 'bg-gradient-secondary';
  
  return (
    <Card className="bg-card/30 backdrop-blur border-border/50 shadow-card hover:shadow-neon transition-all duration-300 hover:scale-105">
      <CardHeader className="text-center pb-3">
        <div className={`mx-auto w-12 h-12 ${gradientClass} rounded-full flex items-center justify-center mb-3`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-center text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}