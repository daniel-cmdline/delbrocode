'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Upload, Palette } from 'lucide-react';

interface CodeEditorProps {
  onSubmit: (code: string, language: string) => void;
  onRun: (code: string, language: string) => void;
  loading?: boolean;
  initialCode?: Record<string, string>;
  problemId?: string;
  onCodeChange?: (code: string, language: string) => void;
  onPasteAutoSubmit?: () => void;
}

const LANGUAGE_CONFIGS = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    template: `function solution(input) {
    // Your code here
    return "";
}

// Read input
const input = require('fs').readFileSync(0, 'utf8').trim();
console.log(solution(input));`
  },
  python: {
    id: 'python',
    name: 'Python',
    template: `def solution(input_str):
    # Your code here
    return ""

# Read input
input_str = input().strip()
print(solution(input_str))`
  },
  java: {
    id: 'java',
    name: 'Java',
    template: `import java.util.*;

public class Solution {
    public static String solution(String input) {
        // Your code here
        return "";
    }
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        System.out.println(solution(input));
    }
}`
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    template: `#include <iostream>
#include <string>
using namespace std;

string solution(string input) {
    // Your code here
    return "";
}

int main() {
    string input;
    getline(cin, input);
    cout << solution(input) << endl;
    return 0;
}`
  }
};

const THEME_CONFIGS = [
  { id: 'vs-dark', name: 'Dark', description: 'Default dark theme' },
  { id: 'vs-light', name: 'Light', description: 'Default light theme' },
  { id: 'hc-black', name: 'High Contrast', description: 'High contrast dark' },
  { id: 'hc-white', name: 'High Contrast Light', description: 'High contrast light' },
];

export function CodeEditor({ onSubmit, onRun, loading, initialCode, problemId, onCodeChange, onPasteAutoSubmit }: CodeEditorProps) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(initialCode?.[language] || LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS].template);
  const [theme, setTheme] = useState('vs-dark');
  const editorRef = useRef<any>(null);
  const [userEdited, setUserEdited] = useState(false);
  const monaco = useMonaco();

  useEffect(() => {
    if (!userEdited && initialCode?.[language]) {
      setCode(initialCode[language]);
    } else if (!userEdited) {
      setCode(LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS].template);
    }
    // eslint-disable-next-line
  }, [language, initialCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts when monaco is available
    if (monaco) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onSubmit(code, language);
      });
      
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
        onRun(code, language);
      });
    }

   // Listen for paste events
   if (typeof window !== 'undefined' && typeof onPasteAutoSubmit === 'function') {
     const domNode = editor.getDomNode();
     if (domNode) {
       const handlePaste = (e: ClipboardEvent) => {
         onPasteAutoSubmit();
       };
       domNode.addEventListener('paste', handlePaste);
       // Clean up
       editor.onDidDispose(() => {
         domNode.removeEventListener('paste', handlePaste);
       });
     }
   }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-24">
              <Palette className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              {THEME_CONFIGS.map((themeConfig) => (
                <SelectItem key={themeConfig.id} value={themeConfig.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{themeConfig.name}</span>
                    <span className="text-xs text-muted-foreground">{themeConfig.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            onClick={() => onRun(code, language)}
            disabled={loading}
          >
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button
            onClick={() => onSubmit(code, language)}
            disabled={loading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => {
            setCode(value || '');
            setUserEdited(true);
            if (typeof value === 'string' && typeof language === 'string' && typeof onCodeChange === 'function') {
              onCodeChange(value, language);
            }
          }}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            contextmenu: false
          }}
        />
      </div>
    </div>
  );
}