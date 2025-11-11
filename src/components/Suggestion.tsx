import React, { useState } from 'react';
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ReactDOM from 'react-dom';

interface CommandListProps {
    keywordIdx: number;
    keyword: string;
    commands: { instruction: string; description: string }[];
    onUpdateSuggestionIdx: (idx: {keywordIdx: number, commandIdx: number}) => void;
    onSelect: (command: { instruction: string; description: string; }) => void;
    onExit: () => void;
}

const CommandList: React.FC<CommandListProps> = ({ keywordIdx, keyword, commands, onUpdateSuggestionIdx, onSelect, onExit }) => {
    const [focusIdx, setFocusIdx] = useState<number>(0);
    const containerRef = React.useRef<HTMLDivElement>(null); // Add this
    const commandItemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    React.useEffect(() => { 
        const handleKeyDown = (e: KeyboardEvent) => { 
            e.stopPropagation(); 
            if (e.key === 'ArrowDown') { 
                e.preventDefault(); 
                const newIdx = (focusIdx + 1) % commands.length; 
                setFocusIdx(newIdx); onUpdateSuggestionIdx({ keywordIdx: keywordIdx, commandIdx: newIdx }); 
                if (newIdx === 0 && containerRef.current) { 
                    containerRef.current.scrollTop = 0; 
                } 
                
                else { 
                    commandItemRefs.current[newIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } 
            
            else if (e.key === 'ArrowUp') { 
                e.preventDefault(); 
                const newIdx = (focusIdx - 1 + commands.length) % commands.length; 
                setFocusIdx(newIdx); onUpdateSuggestionIdx({ keywordIdx: keywordIdx, commandIdx: newIdx }); 
                if (newIdx === 0 && containerRef.current) {
                    containerRef.current.scrollTop = 0;
                } 
                
                else { 
                    commandItemRefs.current[newIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
                } 
            } 
            
            else if (e.key === 'Enter') { 
                e.preventDefault(); 
                onSelect(commands[focusIdx]); 
                onUpdateSuggestionIdx({ keywordIdx: keywordIdx, commandIdx: -1 }); 
            } 
            
            else if (e.key === 'ArrowLeft' || e.key === 'Escape') { 
                e.preventDefault(); 
                onExit();
            } 
        } 
        
        document.addEventListener('keydown', handleKeyDown, true); 
        return () => document.removeEventListener('keydown', handleKeyDown, true); 
    }, [focusIdx, onUpdateSuggestionIdx, onSelect]);
    return (
        <>
            <div className='catLabel text-neutral-900 keyword'>{keyword}</div>
            <div ref={containerRef} className="commandListContainer" style={{ maxHeight: "200px", overflowY: "auto" }}
            >
                {commands.map((cmd, i) => {
                    return (
                        <div key={`${keyword}${i}`} className={`commandItem${i === focusIdx ? ' bg-blue-100' : ''}`} onClick={() => onSelect(cmd)} style={{border: '1px solid #dcdcdc'}}
                            onFocus={() => {
                                setFocusIdx(i);
                                onUpdateSuggestionIdx({keywordIdx: keywordIdx, commandIdx: focusIdx})
                            }}
                            onMouseEnter={(e) => {
                                setFocusIdx(i);
                                onUpdateSuggestionIdx({ keywordIdx: keywordIdx, commandIdx: focusIdx });
                            }}
                            ref={(el) => { commandItemRefs.current[i] = el }}
                        >
                            <div className="catLabel text-neutral-700" style={{margin: '0px'}}>{cmd.instruction}</div>
                            <div className="catLabel text-neutral-350" style={{margin: '0px', padding: '2px 12px', fontSize: '12px'}}>{cmd.description}</div>
                        </div>
                    )
                    
                })}
            </div>
        </>
    )
}

interface SuggestionListProps {
    position: { top: number; left: number }
    onUpdateSuggestionIdx: (idx: {keywordIdx: number, commandIdx: number}) => void;
    suggestedItems: { keyword: string; commands: { instruction: string; description: string; }[] }[]
    onSelectCommand: (command: { instruction: string; description: string; }) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({ position, onUpdateSuggestionIdx, suggestedItems, onSelectCommand }) => {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const commandListRef = React.useRef<HTMLDivElement>(null); // Add this
    const [focusIdx, setFocusIdx] = useState<number>(0);
    const [commandIdx, setCommandIdx] = useState<number>(-1);
    const [commandTop, setCommandTop] = useState<number>(0);
    const keywordItemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isVisible) return;
            e.stopPropagation();
            if (commandIdx === -1) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const newIdx = (focusIdx + 1) % suggestedItems.length;
                    setFocusIdx(newIdx);
                    onUpdateSuggestionIdx({ keywordIdx: newIdx, commandIdx: -1 });
                    keywordItemRefs.current[newIdx]?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                } 
                
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const newIdx = (focusIdx - 1 + suggestedItems.length) % suggestedItems.length;
                    setFocusIdx(newIdx);
                    onUpdateSuggestionIdx({ keywordIdx: newIdx, commandIdx: -1 });
                    keywordItemRefs.current[newIdx]?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                } 
                
                else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                    e.preventDefault();
                    setCommandIdx(0);
                    onUpdateSuggestionIdx({ keywordIdx: focusIdx, commandIdx: 0 });
                } 
                
                else if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsVisible(false);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [isVisible, focusIdx, commandIdx, suggestedItems, onUpdateSuggestionIdx, onSelectCommand]);

    // --- Handle click outside ---
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current && 
                !containerRef.current.contains(event.target as Node) &&
                commandListRef.current &&
                !commandListRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isVisible) return null; // Hide completely if clicked outside
    const listElement = (
        <>
            <div ref={containerRef} className="keywordList" style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                minWidth: "200px",
                background: "white",
                border: "1px solid #ccc",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                zIndex: 9999,
            }}
            >
                <ul className="keywordItem">
                    {suggestedItems.map((item, index) => (
                        <div
                            key={item.keyword}
                            ref={(el) => { keywordItemRefs.current[index] = el }}
                            tabIndex={0}
                            onFocus={() => {
                                setFocusIdx(index);
                                onUpdateSuggestionIdx({keywordIdx: index, commandIdx: -1})
                            }}
                            onMouseEnter={(e) => {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                const containerRect = containerRef.current?.getBoundingClientRect();
                                if (containerRect) {
                                    setCommandTop(rect.top - containerRect.top); // position relative to container
                                }

                                setFocusIdx(index);
                                setCommandIdx(0);
                                onUpdateSuggestionIdx({ keywordIdx: index, commandIdx: 0 });
                            }}
                            onClick={() => {
                                setCommandIdx(0)
                                onUpdateSuggestionIdx({keywordIdx: index, commandIdx: 0})
                            }}
                            className={`catLabel text-neutral-900 ${
                                focusIdx === index ? 'bg-blue-100' : ''
                            }`}
                        >
                            {item.keyword}
                            <ArrowRightIcon></ArrowRightIcon>
                        </div>
                    ))}
                </ul>
            </div>
            {commandIdx !== -1 && (
                <div ref={commandListRef} className="commandList" style={{position: 'absolute', top: position.top + commandTop, left: position.left + 200}}>
                    <CommandList
                        keyword={suggestedItems[focusIdx].keyword}
                        commands={suggestedItems[focusIdx].commands}
                        onSelect={onSelectCommand}
                        keywordIdx={focusIdx}
                        onUpdateSuggestionIdx={onUpdateSuggestionIdx}
                        onExit={() => {
                            setCommandIdx(-1);
                            onUpdateSuggestionIdx({keywordIdx: focusIdx, commandIdx: -1})
                        }}
                    />
                </div>
            )}
        </>  
    )

    return ReactDOM.createPortal(listElement, document.body);
}

export default SuggestionList