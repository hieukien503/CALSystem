import React from 'react';

interface CommandSuggestionProps {
    commands: {
        keywords: string;
        rules: string[];
    }[];
}

class CommandSuggestion extends React.Component<CommandSuggestionProps, {}> {
    constructor(props: CommandSuggestionProps) {
        super(props);
    }

    render = (): React.ReactNode => {
        return (
            <div></div>
        )
    }
};