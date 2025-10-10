import React, { useState } from "react";

interface Tool {
    key: string;
    label: string;
    title: string;
    onClick: () => void;
}

interface ToolCategory {
    name: string;
    tools: Tool[];
}

interface AnimationToolProps {
    width: number;
    height: number;
    //toolCategories: ToolCategory[];
}
interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
}

const AnimationTool: React.FC<AnimationToolProps> = ({ width, height }) => {
    const [timeline, setTimeline] = useState<TimelineItem[]>([
        { object: "Object 1", start: 0, end: 2, action: "Function" },
        { object: "Object 2", start: 2, end: 3, action: "Function" }
    ]);


    return (
        <div className="p-2 gap-2"
            style={{
                width,
                height,
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                backgroundColor: "#f9f9f9"
            }}
        >
            {/* Timeline */}
            <div>
                <div className="text-left mb-2 font-bold">Animation</div>

                <div style={{ display: "grid", gridTemplateColumns: "80px repeat(4, 1fr)", gap: "4px" }}>
                    <div>Second</div>
                    <div
                        style={{
                            textAlign: "left"
                        }}
                    >0</div>
                    <div
                        style={{
                            textAlign: "left"
                        }}
                    >1</div>
                    <div
                        style={{
                            textAlign: "left"
                        }}
                    >2</div>
                    <div
                        style={{
                            textAlign: "left"
                        }}
                    >3</div>

                    {timeline.map((item, idx) => (
                        <React.Fragment key={idx}>
                            <div
                                style={{
                                    gridRow: `${idx + 2}`,
                                    gridColumn: `1`,
                                    textAlign: "center"
                                }}
                            >{item.object}</div>
                            <div
                                style={{
                                    gridRow: `${idx + 2}`,
                                    gridColumn: `${item.start + 2} / ${item.end + 2}`,
                                    background: "white",
                                    border: "1px solid black",
                                    textAlign: "center"
                                }}
                            >
                                {item.action}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Export / Play buttons */}
            <div className="d-flex justify-content-evenly items-center mb-4">

                {/*style={{ gap: "16px", marginBottom: "16px" }}>*/}
                <button className="p-1"
                    style={{
                        background: "white",
                        border: "1px solid black",
                        textAlign: "center"
                    }}
                >Export</button>
                <button className="p-1"
                    style={{
                        background: "white",
                        border: "1px solid black",
                        textAlign: "center"
                    }}
                >▶ Play</button>
            </div>

            {/* Action Palette based on toolCategories */}
            <div>
                <div className="text-left mb-2 font-bold">Action</div>
            {/*    <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Action</div>*/}
            {/*    {toolCategories.map((category) => (*/}
            {/*        <div key={category.name} style={{ marginBottom: "12px" }}>*/}
            {/*            <div className="catLabel text-neutral-900">{category.name}</div>*/}
            {/*            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>*/}
            {/*                {category.tools.map((tool) => (*/}
            {/*                    <div*/}
            {/*                        key={tool.key}*/}
            {/*                        title={tool.title}*/}
            {/*                        onClick={tool.onClick}*/}
            {/*                        style={{*/}
            {/*                            width: "80px",*/}
            {/*                            height: "60px",*/}
            {/*                            background: "gray",*/}
            {/*                            color: "white",*/}
            {/*                            display: "flex",*/}
            {/*                            justifyContent: "center",*/}
            {/*                            alignItems: "center",*/}
            {/*                            cursor: "pointer",*/}
            {/*                            borderRadius: "6px",*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        {tool.label}*/}
            {/*                    </div>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            </div>
        </div>
    );
};

export { AnimationTool };
