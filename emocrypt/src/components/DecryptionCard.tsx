import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Unlock, Eye } from 'lucide-react';
import { decryptFromEmoji, ENCRYPTION_ALGORITHMS, type EncryptionAlgorithm } from '@/lib/encryption';
import { useToast } from '@/hooks/use-toast';

export function DecryptionCard() {
  const [emoji, setEmoji] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [algorithm, setAlgorithm] = useState<EncryptionAlgorithm>('aes');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDecrypt = async () => {
    if (!emoji.trim() || !secretKey.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both emoji and secret key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const decrypted = decryptFromEmoji(emoji, secretKey, algorithm);
      setResult(decrypted);
      toast({
        title: "Message Decrypted! 🔓",
        description: "Your secret message has been revealed"
      });
    } catch (error) {
      toast({
        title: "Decryption Failed",
        description: error instanceof Error ? error.message : "Invalid emoji or secret key",
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
        title: "Message Copied!",
        description: "Successfully copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/50 shadow-card animate-slide-up">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center mb-4 animate-glow-pulse">
          <Unlock className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
          Decrypt Emoji
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Paste the encrypted emoji and enter the secret key
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emoji" className="text-sm font-medium">
            Encrypted Emoji
          </Label>
          <Input
            id="emoji"
            placeholder="📱 Paste the encrypted emoji here..."
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="bg-background/50 border-border/50 text-center text-2xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretKey" className="text-sm font-medium">
            Secret Key
          </Label>
          <Input
            id="secretKey"
            placeholder="Enter your secret key..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="bg-background/50 border-border/50"
            type="password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="algorithm" className="text-sm font-medium">
            Encryption Algorithm
          </Label>
          <Select value={algorithm} onValueChange={(value: EncryptionAlgorithm) => setAlgorithm(value)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              {ENCRYPTION_ALGORITHMS.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{algo.label}</span>
                    <span className="text-xs text-muted-foreground">{algo.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleDecrypt} 
          disabled={isLoading}
          className="w-full bg-gradient-secondary hover:opacity-90 transition-opacity font-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Decrypting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Decrypt Message
            </div>
          )}
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-gradient-primary/10 rounded-lg border border-border/50 animate-fade-in">
            <h3 className="font-medium mb-3 text-center">Decrypted Message</h3>
            
            <div className="space-y-3">
              <div className="bg-background/50 p-3 rounded text-center">
                <p className="text-foreground break-words">{result}</p>
              </div>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(result)}
                className="w-full text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Message
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}