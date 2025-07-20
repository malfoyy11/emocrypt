import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Shield, Zap } from 'lucide-react';
import { encryptToEmoji, ENCRYPTION_ALGORITHMS, EncryptionAlgorithm } from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';

export function EncryptionCard() {
  const [message, setMessage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>('aes');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (!message.trim() || !secretKey.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both a message and secret key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const encrypted = encryptToEmoji(message, secretKey, algorithm);
      setResult(encrypted);
      toast({
        title: "Message Encrypted! 🔒",
        description: "Your message has been converted to an emoji"
      });
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Encrypted Emoji Copied!",
        description: "Share it securely - the message is hidden inside!"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const selectedAlgorithm = ENCRYPTION_ALGORITHMS.find(a => a.value === algorithm);

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/50 shadow-card animate-slide-up">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4 animate-glow-pulse">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Encrypt Message
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Convert your secret message into a single emoji
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="algorithm" className="text-sm font-medium">
            Encryption Algorithm
          </Label>
          <Select value={algorithm} onValueChange={(value) => setAlgorithm(value as EncryptionAlgorithm)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/50">
              {ENCRYPTION_ALGORITHMS.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  <div className="flex flex-col text-left">
                    <span className="font-medium">{algo.label}</span>
                    <span className="text-xs text-muted-foreground">{algo.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Secret Message
          </Label>
          <Textarea
            id="message"
            placeholder="Enter your secret message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-background/50 border-border/50 min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretKey" className="text-sm font-medium">
            Secret Key
          </Label>
          <Input
            id="secretKey"
            type="password"
            placeholder="Enter your secret key..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="bg-background/50 border-border/50"
          />
        </div>

        <Button 
          onClick={handleEncrypt} 
          disabled={isLoading}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Encrypting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Encrypt to Emoji
            </div>
          )}
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-gradient-secondary/10 rounded-lg border border-border/50 animate-fade-in">
            <h3 className="font-medium mb-3 text-center">Encrypted Result</h3>
            
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-6xl mb-2">{result}</div>
                <p className="text-xs text-muted-foreground mb-3">
                  Message encrypted inside the emoji! 🤫
                </p>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result)}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Encrypted Emoji
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}