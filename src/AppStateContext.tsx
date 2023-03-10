import React from "react"
import { v4 as uuid } from 'uuid'
import { DragItem } from "./DragItem"
import { moveItem } from "./moveItem"
import { findItemIndexById } from "./utils/findItemIndexById"

const AppStateContext = React.createContext<AppStateContextProps>({} as AppStateContextProps)

const appData: AppState = {
    lists: [
        {
            id: "0",
            text: "To Do",
            tasks: [{ id: "c0", text: "Generate app scaffold" }]
        },
        {
            id: "1",
            text: "In Progress",
            tasks: [{ id: "c2", text: "Learn Typescript" }]
        },
        {
            id: "2",
            text: "Done",
            tasks: [{ id: "c3", text: "Begin to use static typing" }]
        }
    ]
}

interface Task {
    id: string
    text: string
}
interface List {
    id: string
    text: string
    tasks: Task[]
}

interface AppStateContextProps {
    state: AppState
    dispatch: React.Dispatch<Action>
}


// it's union type 
type Action = 
    | {
        type: "ADD_LIST"
        payload: string
    }
    | {
        type: "ADD_TASK"
        payload: { text: string; taskId: string }
    }
    | {
        type: "MOVE_LIST"
        payload: {
            dragIndex: number
            hoverIndex: number
        }
    }
    | {
        type: "SET_DRAGGED_ITEM"
        payload: DragItem | undefined
    }

const appStateReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case "ADD_LIST": {
            return {
                ...state,
                lists: [
                    ...state.lists,
                    { id: uuid(), text: action.payload, tasks: [] }
                ]
            }
        }
        case "ADD_TASK": {
            const targetLaneIndex = findItemIndexById(
                state.lists,
                action.payload.taskId
            )
            state.lists[targetLaneIndex].tasks.push({
                id: uuid(),
                text: action.payload.text
            })
            return {
                ...state,
            }
        }
        case "MOVE_LIST": {
            const { dragIndex, hoverIndex } = action.payload
            state.lists = moveItem(state.lists, dragIndex, hoverIndex)
            return {
                ...state
            }
        }
        case "SET_DRAGGED_ITEM": {
            return {
                ...state
            }
        }
        default: {
            return state
        }
    }
}

export interface AppState {
    lists: List[]
}
export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [state, dispatch] = React.useReducer(appStateReducer, appData)

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}

export const useAppState = () => {
    return React.useContext(AppStateContext)
}