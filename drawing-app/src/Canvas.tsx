import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { socket } from "./socket"

// interface CanvasProps {
//     socket: any,
// }

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<any>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('')

    const [strokeStyle, setstrokeStyle] = useState('#000000');
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [shareData, setShareData] = useState(false);

    const [texts, setTexts] = useState("");

    const [shapes, setShapes] = useState<{
        shape: string,
        startX: number,
        startY: number,
        height: number,
        width: number,
        strokeStyle: string,
        strokeWidth: number
    }[]>([]);

    const [paths, setPaths] = useState<{
        name: string,
        strokeStyle: string,
        strokeWidth: number,
        points: { x: number, y: number }[]
    }[]>([]);


    const calcCoord = (event: any): any => { //Type cleanup
        const canvas = canvasRef.current;
        if (!canvas) {
            return null;
        }
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        return {
            x,
            y
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const canvascontext = canvas.getContext("2d");
        contextRef.current = canvascontext;
    }, [])

    useEffect(() => {
        if (!socket) return

        function setShapesFrontend(data: any) {
            console.log(data)
            setShapes(data)
        }
        function setPathsFrontend(data: any) {
            console.log(data)
            setPaths(data)
        }

        socket.on('shapes changed server', setShapesFrontend)
        socket.on('paths changed server', setPathsFrontend)

        return () => {
            socket.off('shapes changed server', setShapesFrontend);
            socket.off('shapes changed server', setPathsFrontend);
        }

    }, [socket])

    useEffect(() => {
        if (!socket) return

        socket.emit('paths changed client', paths)
        socket.emit('shapes changed client', shapes)

        socket.timeout(5000).emit('nigga bitch', "fuck you")

        // socket.emit('paths changed', paths)
    }, [shareData])


    useLayoutEffect(() => {
        const context = contextRef.current;
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height)

        shapes.forEach((item) => {
            context.lineWidth = item.strokeWidth;
            context.strokeStyle = item.strokeStyle;
            context.strokeRect(item.startX, item.startY, item.width, item.height);
        }
        )

        paths.forEach((item) => {
            context.lineWidth = item.strokeWidth;
            context.strokeStyle = item.strokeStyle;
            context.beginPath();
            context.moveTo(item.points[0].x, item.points[0].y)
            for (let pt = 1; pt < item.points.length; pt++) {
                let point = item.points[pt];
                context.lineTo(point.x, point.y)
            }
            context.stroke();
        })
    }, [shapes, paths]);

    // useLayoutEffect(() => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;

    //     const context = canvas.getContext("2d");
    //     if (!context) return;

    //     let requestId: number;

    //     const render = () => {
    //       // Clear the canvas
    //       context.clearRect(0, 0, canvas.width, canvas.height);

    //       // Draw each shape in the shapes state
    //     shapes.forEach( (item) => {
    //             context.lineWidth = item.strokeWidth;
    //             context.strokeStyle = item.strokeStyle;
    //             context.strokeRect(item.startX, item.startY, item.width, item.height);
    //         }
    //      )

    //     paths.forEach( (item) => {
    //         context.lineWidth = item.strokeWidth;
    //         context.strokeStyle = item.strokeStyle;
    //         context.beginPath();
    //         context.moveTo(item.points[0].x, item.points[0].y)
    //         for(let pt = 1; pt<item.points.length; pt++){
    //             let point = item.points[pt];
    //             context.lineTo(point.x, point.y)
    //         }
    //         context.stroke();
    //      } )

    //       // Request the next frame
    //       requestId = requestAnimationFrame(render);
    //     };

    //     // Start the animation loop
    //     render();

    //     // Cleanup the animation loop
    //     return () => cancelAnimationFrame(requestId);
    //   }, [shapes, paths]);

    // console.log("rerenders")

    const mouseDown = (event: any) => {
        const context = contextRef.current;
        if (!context) return;

        if (tool == 'circle') {
            // context.globalCompositeOperation="destination-out";
            // const {x, y} = calcCoord(event);
            // context.beginPath();
            // context.moveTo(x, y);
        }

        else if (tool == 'pen') {
            // setShareData(true);
            setIsDrawing(true);
            const { x, y } = calcCoord(event);
            setPaths(prev => [
                ...prev,
                {
                    name: "path",
                    strokeStyle: strokeStyle,
                    strokeWidth: strokeWidth,
                    points: [{ x: x, y: y }]
                }
            ])
        }

        else if (tool == "rectangle") {
            // setShareData(true);
            setIsDrawing(true);
            const { x, y } = calcCoord(event);
            setShapes(prev => [...prev,
            {
                shape: "rectangle",
                startX: x,
                startY: y,
                height: 0,
                width: 0,
                strokeStyle: strokeStyle,
                strokeWidth: strokeWidth
            }
            ])
        }
    }

    const mouseMove = (event: any) => {
        const context = contextRef.current;
        if (!context) return;

        if (tool == 'circle') {
            // const {x, y} = calcCoord(event);
            // context.lineTo(x, y);
            // context.stroke();

        }

        else if (tool == 'pen') {
            // setShareData(false);
            if (isDrawing) {
                setShareData(true);
                const { x, y } = calcCoord(event);

                const index = paths.length - 1;
                const temp = paths[index];

                temp.points.push({ x: x, y: y });
                const pathsCopy = [...paths]
                pathsCopy[index] = temp;
                setPaths(pathsCopy)
            }
        }

        else if (tool == 'rectangle') {
            if (isDrawing && shapes.length != 0) {
                setShareData(true);
                const { x, y } = calcCoord(event);
                const index = shapes.length - 1;
                const temp = shapes[index];
                const { startX, startY } = temp;
                temp.height = y - startY;
                temp.width = x - startX;

                const shapesCopy = [...shapes];
                shapesCopy[index] = temp;
                setShapes(shapesCopy);
            }
        }
    }

    const mouseUp = (event: any) => {
        setIsDrawing(false);
        setShareData(false);
    }

    const clearCanvas = () => {
        const context = contextRef.current;
        const canvas = canvasRef.current;
        if (!context || !canvas) return;
        // context.clearRect(0, 0, canvas.width, canvas.height);
        setPaths([]);
        setShapes([])
    }

    let filterTimeout: any;
    const throttle = (query: any) => {
        clearTimeout(filterTimeout)

        setTimeout(() => {
            mouseMove(query)
        }, 100)
    }

    return (
        <div>
            <canvas onMouseDown={mouseDown} onMouseMove={(e) => { throttle(e) }} onMouseUp={mouseUp} onMouseLeave={mouseUp} ref={canvasRef} style={{ border: "2px solid black" }} width="300px" height="300px" />
            <button onClick={clearCanvas} >Clear Canvas</button> <br />
            <input type="color" value={strokeStyle} onChange={(e) => setstrokeStyle(e.target.value)} /> <br />
            <input type="range" id="volume" name="volume" min="1" max="15" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} />
            <div>
                <input type="radio" value="rectangle" name="shape" onChange={e => setTool(e.target.value)} /> rectangle
                <input type="radio" value="circle" name="shape" onChange={e => setTool(e.target.value)} /> circle
                <input type="radio" value="pen" name="shape" onChange={e => setTool(e.target.value)} /> Pen
            </div>

            {/* <button onClick={runFunc} >erase</button> */}
            <h2>{texts}</h2>


        </div>
    )
}
