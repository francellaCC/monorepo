export interface IDrawAction {
    x: number;
    y: number
    color: string;
    brushSize: number;
    tool: string;
    lineId: string; // id de la línea a la que pertenece el punto
    isStart?: boolean; // opcional, true para el primer punto
}