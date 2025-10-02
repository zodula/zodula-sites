import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Handle, Position, useReactFlow, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { FileText, Database, Zap, Layers, Monitor, CopyIcon, CopyCheckIcon, CheckIcon, Trash2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '@xyflow/react/dist/style.css';

const labelStyle = {
    fill: 'var(--primary)',
    fontWeight: 400,
    fontSize: 10,
};

const edgeStyle = {
    stroke: 'var(--primary)',
    strokeWidth: 2,
};

const selectedEdgeStyle = {
    stroke: 'var(--primary)',
    strokeWidth: 4,
};

// Custom Node Components
const CodeBlockNode = ({ data }: { data: any }) => (
    <div className="bg-black/90 backdrop-blur-xl text-primary p-6 rounded-xl border border-primary/30 min-w-[450px] font-mono text-sm shadow-2xl">
        {/* All-directional handles - always present but only visible when editing */}
        <Handle type="source" position={Position.Top} id="top" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="source" position={Position.Right} id="right" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="source" position={Position.Left} id="left" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />

        <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-primary ml-4">User.doctype.ts</span>
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
    <div className="bg-black/80 backdrop-blur-xl border border-primary/30 rounded-xl p-4 min-w-[200px] shadow-xl hover:bg-black/90 transition-all duration-300 group">
        {/* All-directional handles - always present but only visible when editing */}
        <Handle type="target" position={Position.Top} id="top" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="target" position={Position.Right} id="right" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="target" position={Position.Bottom} id="bottom" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="target" position={Position.Left} id="left" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />

        <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 ${data.iconBg} rounded-lg flex items-center justify-center text-white`}>
                {data.icon}
            </div>
            <div className="text-foreground text-sm">{data.title}</div>
        </div>
    </div>
);

const TaglineNode = ({ data }: { data: { title: string; subtitle: string; description: string } }) => (
    <div className="bg-transparent text-center">
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-4xl font-bold">
                <span>{data.title}</span>
                <span className="text-primary">{data.subtitle}</span>
            </div>
            <span className="text-muted-foreground text-xl">{data.description}</span>
        </div>
    </div>
);

const CommandNode = ({ data }: { data: { command: string; isCopied: boolean; onCopy: () => void; isEditing: boolean } }) => (
    <div className="bg-black/80 backdrop-blur-xl border border-primary/30 rounded-lg p-4 flex items-center justify-center relative gap-6 z-30 pointer-events-auto">
        {/* All-directional handles - always present but only visible when editing */}
        <Handle type="target" position={Position.Top} id="top" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="target" position={Position.Right} id="right" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="target" position={Position.Bottom} id="bottom" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />
        <Handle type="target" position={Position.Left} id="left" className={`w-3 h-3 bg-primary ${!data.isEditing ? 'opacity-0' : ''}`} />

        <div className="flex items-center gap-2">
            <span className="text-white font-mono text-sm"><TypingAnimation speed={50} text={data.command} /></span>
        </div>
        <button
            className="p-3 hover:bg-primary/20 rounded-md transition-all duration-200 flex items-center justify-center text-primary hover:text-primary-foreground relative z-50 pointer-events-auto border border-primary/30 hover:border-primary/50"
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                data.onCopy();
            }}
            onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onMouseEnter={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onMouseLeave={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
            title="Copy to clipboard"
            type="button"
            style={{
                cursor: 'pointer',
                pointerEvents: 'auto'
            }}
        >
            {data.isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
        </button>
    </div>
);

const nodeTypes = {
    codeBlock: CodeBlockNode,
    feature: FeatureNode,
    tagline: TaglineNode,
    command: CommandNode,
};

// Component to handle resize and fit view
const FlowResizeHandler = ({ isPortrait }: { isPortrait: boolean }) => {
    const { fitView } = useReactFlow();

    const handleResize = useCallback(() => {
        // Small delay to ensure the resize is complete
        setTimeout(() => {
            fitView({ padding: isPortrait ? 0.1 : 0.3, duration: 300 });
        }, 100);
    }, [fitView, isPortrait]);

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

// Create nodes based on viewport orientation using utility functions
const createNodes = (isPortrait: boolean, isCopied: boolean, handleCopy: () => void, isEditing: boolean): Node[] => {
    if (isPortrait) {
        // Portrait layout from protrait.dsl
        return [
            {
                id: 'tagline-0',
                type: 'tagline',
                position: { x: 416, y: 9.25 },
                data: {
                    title: 'Build Full Stack Apps',
                    subtitle: '10x Faster',
                    description: 'Less files, more productivity.'
                }
            },
            {
                id: 'codeBlock-0',
                type: 'codeBlock',
                position: { x: 364, y: 162 },
                data: { isEditing }
            },
            {
                id: 'command-0',
                type: 'command',
                position: { x: 406, y: -96 },
                data: {
                    command: 'bunx nailgun create my-monorepo --branch v0',
                    isCopied,
                    onCopy: handleCopy,
                    isEditing
                }
            },
            {
                id: 'feature-0',
                type: 'feature',
                position: { x: 346.75, y: 728 },
                data: {
                    title: 'OpenAPI Docs',
                    icon: <FileText size={18} />,
                    iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                    isEditing
                }
            },
            {
                id: 'feature-1',
                type: 'feature',
                position: { x: 344, y: 870 },
                data: {
                    title: 'CRUD Operations',
                    icon: <Layers size={18} />,
                    iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
                    isEditing
                }
            },
            {
                id: 'feature-2',
                type: 'feature',
                position: { x: 660.25, y: 928 },
                data: {
                    title: 'Event Triggers',
                    icon: <Zap size={18} />,
                    iconBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
                    isEditing
                }
            },
            {
                id: 'feature-3',
                type: 'feature',
                position: { x: 344.5, y: 984 },
                data: {
                    title: 'Database Schema',
                    icon: <Database size={18} />,
                    iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
                    isEditing
                }
            },
            {
                id: 'feature-4',
                type: 'feature',
                position: { x: 670, y: 796 },
                data: {
                    title: 'Admin UI',
                    icon: <Monitor size={18} />,
                    iconBg: 'bg-gradient-to-r from-pink-500 to-pink-600',
                    isEditing
                }
            }
        ];
    } else {
        // Landscape layout from landscape.dsl
        return [
            {
                id: 'tagline-0',
                type: 'tagline',
                position: { x: 450, y: 50 },
                data: {
                    title: 'Build Full Stack Apps',
                    subtitle: '10x Faster',
                    description: 'Less files, more productivity.'
                }
            },
            {
                id: 'codeBlock-0',
                type: 'codeBlock',
                position: { x: 165.55, y: 250 },
                data: {}
            },
            {
                id: 'command-0',
                type: 'command',
                position: { x: 534.15, y: 150 },
                data: {
                    command: 'bunx nailgun create my-monorepo --branch v0',
                    isCopied,
                    onCopy: handleCopy
                }
            },
            {
                id: 'feature-0',
                type: 'feature',
                position: { x: 1000, y: 271 },
                data: {
                    title: 'OpenAPI Docs',
                    icon: <FileText size={18} />,
                    iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                    isEditing
                }
            },
            {
                id: 'feature-1',
                type: 'feature',
                position: { x: 1001.15, y: 371 },
                data: {
                    title: 'CRUD Operations',
                    icon: <Layers size={18} />,
                    iconBg: 'bg-gradient-to-r from-green-500 to-green-600',
                    isEditing
                }
            },
            {
                id: 'feature-2',
                type: 'feature',
                position: { x: 1001.15, y: 471 },
                data: {
                    title: 'Event Triggers',
                    icon: <Zap size={18} />,
                    iconBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
                    isEditing
                }
            },
            {
                id: 'feature-3',
                type: 'feature',
                position: { x: 1000, y: 571 },
                data: {
                    title: 'Database Schema',
                    icon: <Database size={18} />,
                    iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
                    isEditing
                }
            },
            {
                id: 'feature-4',
                type: 'feature',
                position: { x: 1000, y: 671 },
                data: {
                    title: 'Admin UI',
                    icon: <Monitor size={18} />,
                    iconBg: 'bg-gradient-to-r from-pink-500 to-pink-600',
                    isEditing
                }
            }
        ];
    }
};

// Create edges based on viewport orientation using hardcoded connections
const createEdges = (isPortrait: boolean): Edge[] => {
    if (isPortrait) {
        // Portrait connections from protrait.dsl
        return [
            {
                id: 'command-0-feature-0',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-0',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-1',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-1',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-2',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-2',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-3',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-3',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-4',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-4',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-0',
                source: 'codeBlock-0',
                sourceHandle: 'bottom',
                target: 'feature-0',
                targetHandle: 'right',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-4',
                source: 'codeBlock-0',
                sourceHandle: 'bottom',
                target: 'feature-4',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-1',
                source: 'codeBlock-0',
                sourceHandle: 'bottom',
                target: 'feature-1',
                targetHandle: 'right',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-2',
                source: 'codeBlock-0',
                sourceHandle: 'bottom',
                target: 'feature-2',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-3',
                source: 'codeBlock-0',
                sourceHandle: 'bottom',
                target: 'feature-3',
                targetHandle: 'right',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            }
        ];
    } else {
        // Landscape connections from landscape.dsl
        return [
            {
                id: 'command-0-feature-0',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-0',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-1',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-1',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-2',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-2',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-3',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-3',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'command-0-feature-4',
                source: 'command-0',
                sourceHandle: 'right',
                target: 'feature-4',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-0',
                source: 'codeBlock-0',
                sourceHandle: 'right',
                target: 'feature-0',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-1',
                source: 'codeBlock-0',
                sourceHandle: 'right',
                target: 'feature-1',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-2',
                source: 'codeBlock-0',
                sourceHandle: 'right',
                target: 'feature-2',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-3',
                source: 'codeBlock-0',
                sourceHandle: 'right',
                target: 'feature-3',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            },
            {
                id: 'codeBlock-0-feature-4',
                source: 'codeBlock-0',
                sourceHandle: 'right',
                target: 'feature-4',
                targetHandle: 'left',
                animated: true,
                style: edgeStyle,
                labelStyle: labelStyle,
                type: 'smoothstep',
            }
        ];
    }
};

// DSL Generation and Parsing
const generateDsl = (nodes: Node[], edges: Edge[]): string => {
    const dslLines = ['# Hero Section Layout DSL', ''];

    // Add nodes
    dslLines.push('# Nodes');
    nodes.forEach(node => {
        dslLines.push(`${node.type} ${node.id} at (${node.position.x}, ${node.position.y})`);
    });

    dslLines.push('');
    dslLines.push('# Connections');
    dslLines.push('# Syntax: connect sourceId -> targetId [fromHandle] [toHandle]');
    dslLines.push('# Example: connect codeBlock-0 -> command-0 bottom left');
    edges.forEach(edge => {
        const fromHandle = edge.sourceHandle || 'right';
        const toHandle = edge.targetHandle || 'left';
        dslLines.push(`connect ${edge.source} -> ${edge.target} ${fromHandle} ${toHandle}`);
    });

    dslLines.push('');
    dslLines.push('# To remove a connection, delete the line above');
    dslLines.push('# To add a connection, add a new line with: connect sourceId -> targetId [fromHandle] [toHandle]');

    return dslLines.join('\n');
};


export default function HeroSection() {
    const [isPortrait, setIsPortrait] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [isLocalhost, setIsLocalhost] = useState(false);

    const handleCopy = () => {

        window.navigator.clipboard.writeText("bunx nailgun create my-monorepo --branch v0");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Detect localhost and viewport orientation
    useEffect(() => {
        const checkLocalhost = () => {
            setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        };

        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkLocalhost();
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    // Initialize nodes and edges with hardcoded layouts
    useEffect(() => {
        const newNodes = createNodes(isPortrait, isCopied, handleCopy, isEditing);
        const newEdges = createEdges(isPortrait);
        setNodes(newNodes);
        setEdges(newEdges);
    }, [isPortrait, isCopied, isEditing]);

    // Disable editing mode when not on localhost
    useEffect(() => {
        if (!isLocalhost && isEditing) {
            setIsEditing(false);
        }
    }, [isLocalhost, isEditing]);

    // Update edge styles when selection changes (without resetting positions)
    useEffect(() => {
        if (selectedEdgeId) {
            setEdges((currentEdges) =>
                currentEdges.map(edge => ({
                    ...edge,
                    style: edge.id === selectedEdgeId ? selectedEdgeStyle : edgeStyle
                }))
            );
        } else {
            setEdges((currentEdges) =>
                currentEdges.map(edge => ({
                    ...edge,
                    style: edgeStyle
                }))
            );
        }
    }, [selectedEdgeId]);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        console.log('onNodesChange called with:', changes);
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        if (isEditing) {
            setSelectedEdgeId(edge.id);
        }
    }, [isEditing]);

    const handleEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        if (isEditing) {
            setSelectedEdgeId(edge.id);
        }
    }, [isEditing]);

    const handlePaneClick = useCallback(() => {
        if (isEditing) {
            setSelectedEdgeId(null);
        }
    }, [isEditing]);

    return (
        <section className="relative min-h-[calc(100vh+4px)] flex items-center">
            {/* Background Visualization */}
            <div className={`absolute inset-0 z-10`}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={(connection) => {
                        if (isEditing) {
                            const newEdge = {
                                id: `${connection.source}-${connection.target}`,
                                source: connection.source!,
                                target: connection.target!,
                                sourceHandle: connection.sourceHandle || 'right',
                                targetHandle: connection.targetHandle || 'left',
                                animated: true,
                                style: edgeStyle,
                                labelStyle: labelStyle,
                                type: 'smoothstep',
                            };
                            setEdges((eds) => [...eds, newEdge]);
                        }
                    }}
                    onEdgeClick={handleEdgeClick}
                    onEdgeContextMenu={handleEdgeContextMenu}
                    onPaneClick={handlePaneClick}
                    fitView
                    fitViewOptions={{ padding: isPortrait ? 0.1 : 0.3 }}
                    className="bg-transparent"
                    nodesDraggable={isLocalhost && isEditing}
                    nodesConnectable={isLocalhost && isEditing}
                    elementsSelectable={isLocalhost && isEditing}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    panOnScroll={false}
                    selectNodesOnDrag={false}
                    deleteKeyCode={isLocalhost && isEditing ? 'Delete' : null}
                    nodesFocusable={false}
                    edgesFocusable={false}
                    preventScrolling={false}
                    zoomOnPinch={false}
                    zoomOnDoubleClick={false}
                >
                    <FlowResizeHandler isPortrait={isPortrait} />
                    <Background
                        color="#1f2937"
                        gap={30}
                        size={1}
                    />
                </ReactFlow>
            </div>

            {/* Hero Content */}
        </section>
    );
}
