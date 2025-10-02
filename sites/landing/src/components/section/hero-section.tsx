import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { FileText, Database, Zap, Layers, Monitor, CopyIcon, CopyCheckIcon, CheckIcon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '@xyflow/react/dist/style.css';

const labelStyle = {
    fill: '#f97316',
    fontWeight: 400,
    fontSize: 10,
};

const edgeStyle = {
    stroke: '#f97316',
    strokeWidth: 2,
};

// Custom Node Components
const CodeBlockNode = ({ data }: { data: any }) => (
    <div className="bg-black/90 backdrop-blur-xl text-orange-300 p-6 rounded-xl border border-orange-500/30 min-w-[450px] font-mono text-sm shadow-2xl">
        <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-orange-500" />
        <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-orange-400 ml-4">User.doctype.ts</span>
        </div>
        <div className="text-xs">
            <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                    background: 'transparent',
                    padding: 0,
                    margin: 0,
                    fontSize: '11px',
                    lineHeight: '1.4',
                }}
                codeTagProps={{
                    style: {
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    }
                }}
            >
                {`export default $doctype<"zodula__User">({
    name: {
        type: "Text",
        in_list_view: 1
    },
    email: {
        type: "Email",
        required: 1,
        unique: 1,
        in_list_view: 1
    },
    password: {
        type: "Password",
        required: 1,
        no_copy: 1
    },
    is_active: {
        type: "Check",
        default: "1",
        in_list_view: 1
    }
}, {
    label: "User",
    search_fields: "email\\nname\\nid"
})
.on("before_change", async ({ doc, old }) => {
    doc.password = await Bun.password.hash(doc.password as string);
});`}
            </SyntaxHighlighter>
        </div>
    </div>
);

const FeatureNode = ({ data }: { data: any }) => (
    <div className="bg-black/80 backdrop-blur-xl border border-orange-500/20 rounded-xl p-4 min-w-[200px] shadow-xl hover:bg-black/90 transition-all duration-300 group">
        <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-orange-500" />
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 ${data.iconBg} rounded-lg flex items-center justify-center text-white`}>
                {data.icon}
            </div>
            <div className="text-white text-sm">{data.title}</div>
        </div>
    </div>
);

const TaglineNode = ({ data }: { data: { title: string; subtitle: string; description: string } }) => (
    <div className="bg-transparent text-center">
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-4xl font-bold">
                <span>{data.title}</span>
                <span className="text-orange-400">{data.subtitle}</span>
            </div>
            <span className="text-muted-foreground text-xl">{data.description}</span>
        </div>
    </div>
);

const nodeTypes = {
    codeBlock: CodeBlockNode,
    feature: FeatureNode,
    tagline: TaglineNode,
};

// Component to handle resize and fit view
const FlowResizeHandler = () => {
    const { fitView } = useReactFlow();

    const handleResize = useCallback(() => {
        // Small delay to ensure the resize is complete
        setTimeout(() => {
            fitView({ padding: 0.3, duration: 300 });
        }, 100);
    }, [fitView]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    return null;
};

// Typing animation component
const TypingAnimation = ({ text, speed = 100 }: { text: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else {
            setIsComplete(true);
        }
    }, [currentIndex, text, speed]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm">$</span>
            <span className="text-white font-mono text-sm">
                {displayedText}
                {!isComplete && <span className="animate-pulse">|</span>}
            </span>
        </div>
    );
};

const initialNodes: Node[] = [
    {
        id: 'tagline',
        type: 'tagline',
        position: { x: 450, y: 100 },
        data: {
            title: 'Build Full Stack Apps',
            subtitle: '10x Faster',
            description: 'Less files, more productivity.',
        },
    },
    {
        id: 'doctype',
        type: 'codeBlock',
        position: { x: 200, y: 230 },
        data: {},
    },
    {
        id: 'openapi',
        type: 'feature',
        position: { x: 1000, y: 251 },
        data: {
            title: 'OpenAPI Docs',
            icon: <FileText size={18} />,
            iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600'
        },
    },
    {
        id: 'crud',
        type: 'feature',
        position: { x: 1000, y: 351 },
        data: {
            title: 'CRUD Operations',
            icon: <Layers size={18} />,
            iconBg: 'bg-gradient-to-r from-green-500 to-green-600'
        },
    },
    {
        id: 'triggers',
        type: 'feature',
        position: { x: 1000, y: 451 },
        data: {
            title: 'Event Triggers',
            icon: <Zap size={18} />,
            iconBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
        },
    },
    {
        id: 'database',
        type: 'feature',
        position: { x: 1000, y: 551 },
        data: {
            title: 'Database Schema',
            icon: <Database size={18} />,
            iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600'
        },
    },
    {
        id: 'ui',
        type: 'feature',
        position: { x: 1000, y: 651 },
        data: {
            title: 'Admin UI',
            icon: <Monitor size={18} />,
            iconBg: 'bg-gradient-to-r from-pink-500 to-pink-600'
        },
    },
];

const initialEdges: Edge[] = [
    {
        id: 'doctype-openapi',
        source: 'doctype',
        sourceHandle: 'right',
        target: 'openapi',
        targetHandle: 'left',
        animated: true,
        style: edgeStyle,
        labelStyle: labelStyle,
        type: 'smoothstep',
    },
    {
        id: 'doctype-crud',
        source: 'doctype',
        sourceHandle: 'right',
        target: 'crud',
        targetHandle: 'left',
        animated: true,
        style: edgeStyle,
        labelStyle: labelStyle,
        type: 'smoothstep',
    },
    {
        id: 'doctype-triggers',
        source: 'doctype',
        sourceHandle: 'right',
        target: 'triggers',
        targetHandle: 'left',
        animated: true,
        style: edgeStyle,
        labelStyle: labelStyle,
        type: 'smoothstep',
    },
    {
        id: 'doctype-database',
        source: 'doctype',
        sourceHandle: 'right',
        target: 'database',
        targetHandle: 'left',
        animated: true,
        style: edgeStyle,
        labelStyle: labelStyle,
        type: 'smoothstep',
    },
    {
        id: 'doctype-ui',
        source: 'doctype',
        sourceHandle: 'right',
        target: 'ui',
        targetHandle: 'left',
        animated: true,
        style: edgeStyle,
        labelStyle: labelStyle,
        type: 'smoothstep',
    },
];

export default function HeroSection() {
    const [nodes] = useState(initialNodes);
    const [edges] = useState(initialEdges);

    const [isCopied, setIsCopied] = useState(false);

    return (
        <section className="relative min-h-[calc(100vh+4px)] flex items-center">
            {/* Background Visualization */}
            <div className="absolute inset-0 z-10 pt-16">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    className="bg-transparent"
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    selectNodesOnDrag={false}
                >
                    <FlowResizeHandler />
                    <Background
                        color="#1f2937"
                        gap={30}
                        size={1}
                    />
                </ReactFlow>
            </div>
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full h-fit pt-4 gap-4 pt-20">
                <div className="bg-black/80 backdrop-blur-xl border border-orange-500/20 rounded-lg p-4 mb-4 flex items-center justify-center relative gap-6">
                    <TypingAnimation text="nailgun create my-app --branch v0" speed={50} />
                    <button className="cursor-pointer" onClick={() => {
                        window.navigator.clipboard.writeText("nailgun create my-app --branch v0");
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                    }} title="Copy to clipboard">
                        {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Hero Content */}
            <div className="absolute z-20 h-full w-full flex items-center justify-center">
            </div>
        </section>
    );
}
