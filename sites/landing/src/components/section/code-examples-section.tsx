import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal, FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';

const codeExamples = [
    {
        title: "Define Your Data Model",
        description: "Create a User model with just a few lines of TypeScript",
        language: "typescript",
        filename: "User.doctype.ts",
        code: `export default $doctype<"zodula__User">({
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
});`
    },
    {
        title: "Create API Actions",
        description: "Build authentication and business logic with type-safe actions",
        language: "typescript",
        filename: "auth.ts",
        code: `import { z } from "zodula"

export const login = $action(async ctx => {
    const { email, password } = ctx.body
    if (!email || !password) {
        throw new Error("Email and password are required")
    }
    const { docs: users } = await $zodula.doctype("zodula__User").select().where("email", "=", email).where("is_active", "=", 1).unsafe(true).bypass(true)
    if (!users[0]) {
        throw new Error("User not found")
    }
    const user = users[0]
    const isPasswordValid = await Bun.password.verify(password, user.password as string)
    if (!isPasswordValid) {
        throw new Error("Invalid password")
    }
    const { docs: [existingSession] } = await $zodula.doctype("zodula__Session").select().where("user", "=", user.id).sort("expires_at", "desc").bypass(true)
    // validate if session is already exists and not expired
    if (!existingSession) {
        // create new session
        const createdSession = await $zodula.doctype("zodula__Session").insert({
            user: user.id,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
        }).bypass(true)
        // session id cookie
        ctx.set.cookie("zodula_sid", createdSession.id, {
            path: "/",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        })
        return ctx.json({
            session: createdSession,
            user: $zodula.utils.safe("zodula__User", user)
        })
    } else {
        const updatedSession = await $zodula.doctype("zodula__Session").update(existingSession.id, {
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
        }).bypass(true)
        return ctx.json({
            session: updatedSession,
            user: $zodula.utils.safe("zodula__User", user)
        })
    }
}, {
    body: z.object({
        email: z.string().email(),
        password: z.string()
    })
});`
    },
    {
        title: "Seed Data with Fixtures",
        description: "Define initial data for your application",
        language: "json",
        filename: "zodula__Role.fixture.json",
        code: `[
  {
    "id": "Anonymous",
    "name": "Anonymous",
    "description": "The person who is not logged in"
  },
  {
    "id": "Authenticated",
    "name": "Authenticated",
    "description": "The person who is logged in"
  },
  {
    "id": "System Admin",
    "name": "System Admin",
    "description": "The person who has all the permissions"
  },
  {
    "id": "Test",
    "name": "Test",
    "description": null
  }
]`
    },
    {
        title: "Database Migrations",
        description: "Version your database schema changes",
        language: "typescript",
        filename: "1759325688134_zodula_migration.ts",
        code: `export default $migration({
  up: async ({ db }) => {
    // UP Migration
    await db.schema
      .createTable("zodula__User")
      .addColumn({
        name: "id",
        type: "TEXT",
        notNull: true,
      })
      .addColumn({
        name: "name",
        type: "TEXT",
      })
      .addColumn({
        name: "email",
        type: "TEXT",
        notNull: true,
      })
      .addColumn({
        name: "password",
        type: "TEXT",
        notNull: true,
      })
      .addColumn({
        name: "is_active",
        type: "BOOLEAN",
      })
      .execute();
    await db.schema
      .alterTable("zodula__User")
      .makeColumnsUnique(["id"])
      .execute();
    await db.schema
      .alterTable("zodula__User")
      .makeColumnsUnique(["email"])
      .execute();
  },
  down: async ({ db }) => {
    // DOWN Migration
    await db.schema.dropTable("zodula__User");
  },
});`
    },
    {
        title: "Admin UI Pages",
        description: "Build admin interfaces with React components",
        language: "typescript",
        filename: "page.tsx",
        code: `import { Button, Input } from "zodula-ui"
import { SidebarLayout } from "../../src/layout/sidebar-layout"
import { NavbarLayout } from "../../src/layout/navbar-layout"
import { WorkspaceList } from "../../src/components/workspace/workspace-list"
import { WorkspaceView } from "../../src/components/workspace/workspace-view"
import { useWorkspace, useWorkspaceEdit, type WorkspaceWithChildren } from "../../src/components/workspace/use-workspace"
import { cn } from "../../src/lib/utils"
import { confirm } from "../../src/components/ui/popit"
import { useMemo } from "react"

export default function adminPage() {
    const { selectedWorkspace, reloadWorkspaces, reloadWorkspaceItems } = useWorkspace()
    const { editedWorkspaceItems, editedWorkspaces, isEditing, setIsEditing, saveEdit, discardEdit, hasChanges } = useWorkspaceEdit()
    
    const handleToggleEdit = async () => {
        if (isEditing) {
            await handleCancelEdit()
        } else {
            setIsEditing(true)
        }
    }

    return <NavbarLayout>
        <SidebarLayout
            defaultOpen={true}
            title={currentWorkspace?.name || ""}
            actionSection={<div className="zd:flex zd:items-center zd:gap-2">
                <Button onClick={handleToggleEdit} variant="subtle">
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
                <Button onClick={saveEdit} className={cn(isEditing ? "" : "zd:hidden")}>
                    Save
                </Button>
            </div>}
            sidebarContent={<WorkspaceList />}>
            <WorkspaceView />
        </SidebarLayout>
    </NavbarLayout>
}`
    }
];

const fileTree = [
    {
        name: "monorepo",
        type: "folder",
        expanded: true,
        children: [
            {
                name: "apps",
                type: "folder",
                expanded: true,
                children: [
                    {
                        name: "zodula",
                        type: "folder",
                        expanded: true,
                        children: [
                            {
                                name: "doctype",
                                type: "folder",
                                expanded: true,
                                children: [
                                    {
                                        name: "core",
                                        type: "folder",
                                        expanded: true,
                                        children: [
                                            { name: "User.doctype.ts", type: "file" }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: "actions",
                                type: "folder",
                                expanded: true,
                                children: [
                                    { name: "auth.ts", type: "file" }
                                ]
                            },
                            {
                                name: "fixtures",
                                type: "folder",
                                expanded: true,
                                children: [
                                    { name: "zodula__Role.fixture.json", type: "file" }
                                ]
                            },
                            {
                                name: "migrations",
                                type: "folder",
                                expanded: true,
                                children: [
                                    { name: "1759325688134_zodula_migration.ts", type: "file" }
                                ]
                            },
                            {
                                name: "ui",
                                type: "folder",
                                expanded: true,
                                children: [
                                    {
                                        name: "pages",
                                        type: "folder",
                                        expanded: true,
                                        children: [
                                            {
                                                name: "admin",
                                                type: "folder",
                                                expanded: true,
                                                children: [
                                                    { name: "page.tsx", type: "file" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

// File Tree Component
function FileTreeItem({ item, level = 0, onFileClick, activeFile }: { item: any, level?: number, onFileClick: (filename: string) => void, activeFile: string }) {
    const [expanded, setExpanded] = useState(item.expanded || false);
    
    const handleClick = () => {
        if (item.type === 'folder') {
            setExpanded(!expanded);
        } else {
            onFileClick(item.name);
        }
    };

    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
            return <FileText className="w-4 h-4 text-blue-400" />;
        }
        if (filename.endsWith('.json')) {
            return <FileText className="w-4 h-4 text-yellow-400" />;
        }
        if (filename.endsWith('.doctype.ts')) {
            return <FileText className="w-4 h-4 text-purple-400" />;
        }
        if (filename.endsWith('.fixture.json')) {
            return <FileText className="w-4 h-4 text-green-400" />;
        }
        if (filename.endsWith('migration.ts')) {
            return <FileText className="w-4 h-4 text-orange-400" />;
        }
        if (filename.endsWith('package.json')) {
            return <FileText className="w-4 h-4 text-red-400" />;
        }
        return <FileText className="w-4 h-4 text-gray-400" />;
    };

    const isActive = activeFile === item.name;

    return (
        <div>
            <div
                className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[#2a2d2e] rounded text-sm ${
                    isActive ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
                }`}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={handleClick}
            >
                {item.type === 'folder' && (
                    <div className="mr-1">
                        {expanded ? (
                            <ChevronDown className="w-4 h-4 text-[#cccccc]" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-[#cccccc]" />
                        )}
                    </div>
                )}
                {item.type === 'file' && <div className="w-4 mr-1" />}
                <div className="mr-2">
                    {item.type === 'folder' ? (
                        <Folder className="w-4 h-4 text-[#cccccc]" />
                    ) : (
                        getFileIcon(item.name)
                    )}
                </div>
                <span className="truncate">{item.name}</span>
            </div>
            {item.type === 'folder' && expanded && item.children && (
                <div>
                    {item.children.map((child: any, index: number) => (
                        <FileTreeItem
                            key={index}
                            item={child}
                            level={level + 1}
                            onFileClick={onFileClick}
                            activeFile={activeFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CodeExamplesSection() {
    const [activeTab, setActiveTab] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [activeFile, setActiveFile] = useState("User.doctype.ts");

    const copyToClipboard = async (code: string, index: number) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleFileClick = (filename: string) => {
        const fileIndex = codeExamples.findIndex(example => example.filename === filename);
        if (fileIndex !== -1) {
            setActiveTab(fileIndex);
            setActiveFile(filename);
        }
    };

    return (
        <section id="examples" className="py-0 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-2xl font-bold text-primary mb-4">
                        See Zodula in Action
                    </h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                        From data model to production-ready backend in minutes, not hours.
                    </p>
                </div>

                {/* Code Examples - VS Code Layout */}
                <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden border border-[#3c3c3c]">
                    <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
                        {/* Left Sidebar - File Tree */}
                        <div className="lg:w-80 bg-[#252526] border-b lg:border-b-0 lg:border-r border-[#3c3c3c]">
                            <div className="p-3">
                                <div className="flex items-center mb-3">
                                    <h3 className="text-sm font-semibold text-[#cccccc] uppercase tracking-wide">
                                        Explorer
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    {fileTree.map((item, index) => (
                                        <FileTreeItem
                                            key={index}
                                            item={item}
                                            onFileClick={handleFileClick}
                                            activeFile={activeFile}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="flex-1 flex flex-col">
                            {/* Code Content - Monaco Editor Style */}
                            <div className="flex-1 bg-[#1e1e1e]">
                                {/* Monaco Editor Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d30] border-b border-[#3c3c3c]">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#27ca3f]"></div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <Terminal className="w-4 h-4 text-[#cccccc]" />
                                            <span className="text-sm text-[#cccccc] font-medium">
                                                {codeExamples[activeTab]?.filename}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(codeExamples[activeTab]?.code ?? '', activeTab)}
                                        className="p-1.5 hover:bg-[#3c3c3c] rounded transition-colors group"
                                        title="Copy code"
                                    >
                                        {copiedIndex === activeTab ? (
                                            <Check className="w-4 h-4 text-[#4caf50]" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[#cccccc] group-hover:text-white" />
                                        )}
                                    </button>
                                </div>

                                {/* Monaco Editor Content */}
                                <div className="relative h-full min-h-[300px] lg:min-h-[400px] bg-[#1e1e1e]">
                                    <div className="h-full overflow-auto">
                                        <SyntaxHighlighter
                                            language={codeExamples[activeTab]?.language ?? ''}
                                            style={vscDarkPlus}
                                            customStyle={{
                                                background: '#1e1e1e',
                                                borderRadius: '0',
                                                padding: '16px 20px',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                margin: '0',
                                                fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Mono", "Roboto Mono", Consolas, "Courier New", monospace',
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Mono", "Roboto Mono", Consolas, "Courier New", monospace',
                                                    fontSize: '14px',
                                                    lineHeight: '1.5',
                                                }
                                            }}
                                            showLineNumbers={true}
                                            lineNumberStyle={{
                                                color: '#858585',
                                                fontSize: '12px',
                                                paddingRight: '16px',
                                                userSelect: 'none',
                                                minWidth: '40px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            {codeExamples[activeTab]?.code ?? ''}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
