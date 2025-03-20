import { createContext, useState } from "react";

export const ProjectContext = createContext();

export function ProjectProvider({ children }) {
    const [volunteers, setVolunteers] = useState([]);

    return (
        <ProjectContext.Provider value={{ volunteers, setVolunteers }}>
            {children}
        </ProjectContext.Provider>
    );
}