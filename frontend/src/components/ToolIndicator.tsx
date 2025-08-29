import { Tool, Zap, Calculator, Globe, Clock, Cloud, FileText, Package, MessageSquare } from 'lucide-react'

interface ToolIndicatorProps {
  content: string
}

const toolPatterns = [
  { name: 'Calculator', pattern: /(?:result|answer|equals?|calculation|computed)/i, icon: Calculator, color: 'text-green-600 dark:text-green-400' },
  { name: 'Algebra', pattern: /(?:solution|solved|equation|variable|x\s*=|roots?)/i, icon: Calculator, color: 'text-green-600 dark:text-green-400' },
  { name: 'Timezone', pattern: /(?:time|timezone|current time|local time|UTC|GMT)/i, icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'WebSearch', pattern: /(?:search|found|results?|website|URL|http)/i, icon: Globe, color: 'text-purple-600 dark:text-purple-400' },
  { name: 'Weather', pattern: /(?:weather|temperature|°C|°F|humidity|wind|forecast)/i, icon: Cloud, color: 'text-cyan-600 dark:text-cyan-400' },
  { name: 'AskKB', pattern: /(?:policy|return|warranty|shipping|FAQ|knowledge base)/i, icon: FileText, color: 'text-orange-600 dark:text-orange-400' },
  { name: 'CheckOrder', pattern: /(?:order|ORD\d+|status|delivery|customer)/i, icon: Package, color: 'text-indigo-600 dark:text-indigo-400' },
  { name: 'CreateTicket', pattern: /(?:ticket|issue|support|problem|damaged)/i, icon: MessageSquare, color: 'text-red-600 dark:text-red-400' },
]

export default function ToolIndicator({ content }: ToolIndicatorProps) {
  const detectedTools = toolPatterns.filter(tool => tool.pattern.test(content))
  
  if (detectedTools.length === 0) return null
  
  return (
    <div className="flex items-center gap-2 ml-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
      <Zap className="w-3 h-3" />
      <span>Tools used:</span>
      {detectedTools.map((tool, index) => {
        const Icon = tool.icon
        return (
          <span key={index} className={`flex items-center gap-1 ${tool.color}`}>
            <Icon className="w-3 h-3" />
            {tool.name}
            {index < detectedTools.length - 1 && <span className="text-gray-400">,</span>}
          </span>
        )
      })}
    </div>
  )
}




