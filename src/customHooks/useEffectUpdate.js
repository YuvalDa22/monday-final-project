import { useEffect, useRef } from "react";


export function useEffectUpdate(func, dependencies) {
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        func()
    }, dependencies)

}