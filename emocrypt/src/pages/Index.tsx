import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EncryptionCard } from '@/components/EncryptionCard';
import { DecryptionCard } from '@/components/DecryptionCard';
import { FeatureCard } from '@/components/FeatureCard';
import { Shield, Unlock, Zap, Eye, Sparkles, Globe } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('encrypt');

  const features = [
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'Multiple encryption algorithms including AES, Caesar cipher, and more for maximum security.',
      gradient: 'primary' as const
    },
    {
      icon: Sparkles,
      title: 'Emoji Steganography',
      description: 'Hide your messages in plain sight using our advanced emoji mapping technology.',
      gradient: 'secondary' as const
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant encryption and decryption with optimized algorithms for real-time communication.',
      gradient: 'primary' as const
    },
    {
      icon: Globe,
      title: 'Universal Compatibility',
      description: 'Works across all platforms and devices. Share encrypted emojis anywhere, anytime.',
      gradient: 'secondary' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-glow-pulse">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EmojiCrypt
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your secret messages into innocent-looking emojis. 
            Military-grade encryption disguised as everyday communication.
          </p>
        </div>

        {/* Main Tool */}
        <div className="flex justify-center mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/50 backdrop-blur">
              <TabsTrigger 
                value="encrypt" 
                className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Encrypt
              </TabsTrigger>
              <TabsTrigger 
                value="decrypt"
                className="data-[state=active]:bg-gradient-secondary data-[state=active]:text-white"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Decrypt
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="encrypt" className="mt-0">
              <EncryptionCard />
            </TabsContent>
            
            <TabsContent value="decrypt" className="mt-0">
              <DecryptionCard />
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-secondary bg-clip-text text-transparent">
            Why Choose EmojiCrypt?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center bg-card/30 backdrop-blur rounded-lg p-8 border border-border/50">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold">Choose Algorithm</h3>
              <p className="text-sm text-muted-foreground">
                Select from multiple encryption methods including AES, Caesar cipher, and more.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold">Encrypt & Share</h3>
              <p className="text-sm text-muted-foreground">
                Enter your message and secret key to generate a single emoji containing your encrypted data.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold">Decrypt Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Recipients use the emoji and metadata to reveal the original message instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
