import React from 'react';
import { serializeDAG } from '../../../utils/serialize';
import { deserializeDAG } from '../../../utils/serialize';

interface SampleProject {
    name: string;
    jsonURL: string;
    id: string;
    description?: string;
}

interface TemplateToolProps {
    initialTemplates?: SampleProject[];
    onLoadDAG?: (dagData: Record<string, any>, project: SampleProject) => void;
    onRename?: (updated: SampleProject) => void;
    title?: string;
}

interface TemplateToolState {
    templates: SampleProject[];
    selectedTemplateId: string | null;
    isLoading: boolean;
    error?: string;
}

const TemplateTool: React.FC<TemplateToolProps> = ({
    initialTemplates = [], onLoadDAG, onRename, title = 'Sample Projects'
}) => {
    const [state, setState] = React.useState<TemplateToolState>({
        templates: [],
        selectedTemplateId: null,
        isLoading: false,
    });

    const handleRename = (id: string, newName: string) => {
        setState(prev => {
            const templates = prev.templates.map(t => t.id === id ? { ...t, name: newName } : t);
            const updated = templates.find(t => t.id === id)!;
            onRename?.(updated);
            return { ...prev, templates };
        })
    }

    const handleLoad = async (template: SampleProject) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: undefined }));
            const response = await fetch(template.jsonURL);
            const data = await response.json();
            onLoadDAG?.(data, template);
            setState(prev => ({
                ...prev,
                isLoading: false,
                selectedTemplateId: template.id,
            }));
        } 
        
        catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "Failed to load template.",
            }));
        }
    };

    return (
        <div className='templateTool' style={{width: '100%', position: 'relative'}}>
            <div className='catLabel text-neutral-900'>{title}</div>
            {state.templates.map(t => (
                <div key={t.id} className='templateItem'>
                    <div className='catLabel text-neutral-500'>{t.name}</div>
                </div>
            ))}
        </div>
    )
}