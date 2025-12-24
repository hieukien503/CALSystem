import React from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ProjectQueriesProps {
    projectQueries: {
        loadProject: {
            refetch: (projectId?: string) => Promise<any>;
            isLoading: boolean;
            error: any;
        };

        saveProject: {
            mutateAsync: (payload: any, projectId?: string) => Promise<void>;
            isLoading: boolean;
            error: any;
        };

        checkTitleExists: {
            mutateAsync: (title: string) => Promise<boolean>;
        };
    };
}

export function withProjectQueries<P extends ProjectQueriesProps>(Component: React.ComponentType<P>) {
    return function WrappedComponent(props: Omit<P, keyof ProjectQueriesProps>) {
        const queryClient = useQueryClient();
        const [currentProjectId, setCurrentProjectId] = React.useState((props as any).id);
    
        React.useEffect(() => {
            setCurrentProjectId((props as any).id);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [(props as any).id]);
        
        const loadProject = useQuery({
            queryKey: ['project', currentProjectId],
            queryFn: async () => {
                const token = sessionStorage.getItem("token");
                const user = JSON.parse(sessionStorage.getItem("user") || "null");
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/projects/${currentProjectId}/${user?._id || "null"}`, { 
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (!res.ok) throw new Error("Failed to load project");
                return res.json();
            },
            enabled: false,
        });

        const loadProjectRefetch = React.useCallback(async (newProjectId?: string): Promise<any> => {
            const idToUse = newProjectId || currentProjectId;
            
            if (newProjectId && newProjectId !== currentProjectId) {
                setCurrentProjectId(newProjectId);
            }
            
            // Use queryClient.fetchQuery to fetch data for specific project
            const data = await queryClient.fetchQuery({
                queryKey: ['project', idToUse],
                queryFn: async () => {
                    const token = sessionStorage.getItem("token");
                    const user = JSON.parse(sessionStorage.getItem("user") || "null");
                    const res = await fetch(
                        `${process.env.REACT_APP_API_URL}/api/projects/${idToUse}/${user?._id || "null"}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (!res.ok) throw new Error("Failed to load project");
                    return res.json();
                }
            });
            
            return data; // Return data directly
        }, [currentProjectId, queryClient]);

        const saveProject = useMutation({
            mutationFn: async (payload: any) => {
                const token = sessionStorage.getItem("token");
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/projects/${currentProjectId}/`, {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!res.ok) throw new Error("Failed to save project");
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['project', currentProjectId] });
            }
        });

        const checkTitleExists = useMutation({
            mutationFn: async (title: string) => {
                const token = sessionStorage.getItem("token");
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/projects/exists?title=${encodeURIComponent(title)}`, { 
                        headers: { 
                            Authorization: `Bearer ${token}` }
                        }
                    );

                const data = await res.json();
                return data.exists;
            }
        });

        return (
            <Component
                {...(props as P)}
                projectQueries={{
                    loadProject: {
                        refetch: loadProjectRefetch,
                        isLoading: loadProject.isLoading,
                        error: loadProject.error,
                    },
                    saveProject: {
                        mutateAsync: saveProject.mutateAsync,
                        isLoading: saveProject.isPending,
                        error: saveProject.error,
                    },
                    checkTitleExists: {
                        mutateAsync: checkTitleExists.mutateAsync,
                    },
                }}
            />
        );
    };
}