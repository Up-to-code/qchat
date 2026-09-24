import "server-only";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { showcaseRetriever } from "./showcase-retriever";
import {classifyShowcaseTask,needsShowcaseCatalog,type ShowcaseTask} from "./showcase-model-config";

const catalog = [
  { id: "velocity-blue", name: "Velocity Pro 3", imageUrl:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900", colors: ["blue", "black"], sizes: ["9", "10", "11"], priceUsd: { blue: 189, black: 199 }, unavailable: ["black/9"] },
  { id: "aero-knit", name: "Aero Knit One", imageUrl:"https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/03421f93409523.5eb408a551d0a.jpg", colors: ["royal", "silver"], sizes: ["8", "9", "10"], priceUsd: 164 },
];

const AgentState = Annotation.Root({
  prompt: Annotation<string>(),
  hasImages:Annotation<boolean>(),
  task:Annotation<ShowcaseTask>(),
  needsCatalog: Annotation<boolean>(),
  catalogResult: Annotation<string>(),
  retrievalHits: Annotation<string>(),
});

/** A bounded LangGraph workflow: classify the request, then read only trusted catalog data. */
export const showcaseAgentGraph = new StateGraph(AgentState)
  .addNode("plan", (state) => ({ task:classifyShowcaseTask(state.prompt,state.hasImages),needsCatalog: needsShowcaseCatalog(state.prompt) }))
  .addNode("lookup_catalog", () => ({ catalogResult: JSON.stringify({ products: catalog }) }))
  .addNode("retrieve_knowledge", (state) => ({ retrievalHits: JSON.stringify(showcaseRetriever.search(state.prompt).map((hit)=>({...hit.record,score:Number(hit.score.toFixed(3))}))) }))
  .addEdge(START, "plan")
  .addConditionalEdges("plan", (state) => state.task==="image-generation"||state.task==="vision"?END:state.needsCatalog ? "lookup_catalog" : "retrieve_knowledge")
  .addEdge("lookup_catalog", "retrieve_knowledge")
  .addEdge("retrieve_knowledge", END)
  .compile();
