export interface ModelMetric{readonly name:string;readonly durationMs:number;readonly attributes:Readonly<Record<string,string|number|boolean>>}
export type ModelMetricSink=(metric:ModelMetric)=>void;
export function modelTimer(model:string,task:string,sink?:ModelMetricSink){
  const started=performance.now();
  return (name:string,attributes:Readonly<Record<string,string|number|boolean>>={})=>sink?.({name,durationMs:performance.now()-started,attributes:{layer:"provider",model,task,...attributes}});
}
