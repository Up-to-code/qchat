"use client";
import { ArrowLeft,ArrowRight,ExternalLink,ShoppingBag } from "lucide-react";import { useEffect,useRef,useState } from "react";import type { QChatProductCardNode,QChatProductCollectionNode,QChatUINode } from "@qchat/core";import { useQChatConfig,useQChatGeneratedUI,useQChatLocale,useQChatSelector } from "../provider/qchat-provider";import { isAvailableCombination,resolveProductVariant } from "../product-variants/resolve-product-variant";
export function QChatGeneratedUI(){const {document,generating}=useQChatGeneratedUI();const {hostView,slots}=useQChatConfig();const {t}=useQChatLocale();if(hostView)return <section className="qchat-host-view" aria-label="Host interface">{hostView.render()}</section>;if(generating){const Loading=slots?.loading;if(Loading)return <Loading/>;return <div className="qchat-ui-loading" role="status" aria-label={t("loadingProducts")}><div className="qchat-loading-card" aria-hidden="true"><div className="qchat-loading-image"/><div className="qchat-loading-line"/><div className="qchat-loading-line short"/><div className="qchat-loading-options"><i/><i/><i/></div><div className="qchat-loading-button"/></div></div>}if(!document)return null;return <section className={`qchat-generated ${document.layout}`} aria-label="Generated interface">{document.children.map((node)=><Node key={node.id} node={node}/>)}</section>}
function Node({node}:{readonly node:QChatUINode}){if(node.type==="product-collection")return <ProductCollection node={node}/>;if(node.type==="product-card")return <ProductCard card={node}/>;if(node.type==="info-card")return <article className="qchat-info-card"><h3>{node.title}</h3><p>{node.description}</p>{node.facts&&<dl>{node.facts.map((fact)=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}{node.source&&<small>{node.source}</small>}</article>;return <div className={`qchat-status ${node.variant}`}><strong>{node.title}</strong>{node.description&&<p>{node.description}</p>}</div>}
function ProductCollection({node}:{readonly node:QChatProductCollectionNode}){
  const {locale,t}=useQChatLocale();
  const scroller=useRef<HTMLDivElement>(null);
  const [canPrev,setCanPrev]=useState(false);
  const [canNext,setCanNext]=useState(false);
  const update=()=>{const element=scroller.current;if(!element)return;const offset=Math.abs(element.scrollLeft);setCanPrev(offset>2);setCanNext(offset+element.clientWidth<element.scrollWidth-2)};
  const move=(direction:number)=>{const element=scroller.current;if(!element)return;element.scrollBy({left:(locale.direction==="rtl"?-1:1)*direction*element.clientWidth*.85,behavior:"smooth"})};
  useEffect(()=>{update();const element=scroller.current;if(!element)return;const observer=new ResizeObserver(update);observer.observe(element);return()=>observer.disconnect()},[node.items.length]);
  return <div className="qchat-collection"><div className="qchat-collection-header"><h3>{node.title}</h3>{node.direction==="horizontal"&&node.items.length>1&&<div className="qchat-collection-controls"><button type="button" aria-label={t("previousProducts")} disabled={!canPrev} onClick={()=>move(-1)}><ArrowLeft size={15}/></button><button type="button" aria-label={t("nextProducts")} disabled={!canNext} onClick={()=>move(1)}><ArrowRight size={15}/></button></div>}</div><div ref={scroller} className={node.direction} onScroll={update}>{node.items.map((card)=><ProductCard key={card.id} card={card}/>)}</div></div>;
}
function ProductCard({card}:{readonly card:QChatProductCardNode}){
  const {productVariants}=useQChatConfig();
  const {t}=useQChatLocale();
  const variants=productVariants?.[card.id];
  const selections=useQChatSelector((state)=>state.selections);
  const select=useQChatSelector((state)=>state.select);
  const dispatch=useQChatSelector((state)=>state.dispatchAction);
  const color=selections[`${card.id}:color`];
  const size=selections[`${card.id}:size`];
  const resolved=variants?resolveProductVariant(variants,color,size):undefined;
  const shownPrice=resolved?.display?.price??card.price;
  const formattedPrice=new Intl.NumberFormat(undefined,{style:"currency",currency:shownPrice.currency}).format(shownPrice.amount);
  const image=resolved?.display?.image??card.image;
  const chooseColor=(value:string)=>{
    select(`${card.id}:color`,value);
    if(variants&&size&&!isAvailableCombination(variants,value,size))select(`${card.id}:size`,"");
  };
  const addProduct=()=>{
    if(!card.primaryAction||variants&&!resolved?.exact)return;
    void dispatch({name:card.primaryAction.name,sourceNodeId:card.id,payload:{...card.primaryAction.payload,color:color??"",size:size??"",...(resolved?.exact?{variantId:resolved.exact.id}:{})}});
  };
  return <article className="qchat-product">
    {image&&<img src={image.src} alt={image.alt} referrerPolicy="no-referrer"/>}
    <div className="qchat-product-body">
      {card.tags&&<div className="qchat-tags">{card.tags.map((tag)=><span key={tag}>{tag}</span>)}</div>}
      <div className="qchat-product-heading"><h4>{card.title}</h4><strong aria-live="polite">{resolved?.isFromPrice?"From ":""}{formattedPrice}</strong></div>
      {card.description&&<p>{card.description}</p>}
      {card.colors&&<Choice label={t("color")} options={card.colors} selected={color} available={resolved?.availableColors} onSelect={chooseColor}/>}
      {card.sizes&&<Choice label={t("size")} options={card.sizes} selected={size} available={resolved?.availableSizes} onSelect={(value)=>select(`${card.id}:size`,value)}/>}
      {variants&&!resolved?.exact&&<span className="qchat-variant-hint">{t("chooseAvailable")}</span>}
      <div className="qchat-product-actions">
        {card.primaryAction&&<button type="button" disabled={Boolean(variants&&!resolved?.exact)} onClick={addProduct}><ShoppingBag size={15}/>{card.primaryAction.label}</button>}
        {card.secondaryAction&&<button type="button" className="secondary" onClick={()=>void dispatch({name:card.secondaryAction!.name,sourceNodeId:card.id,payload:card.secondaryAction!.payload})}>{card.secondaryAction.label}<ExternalLink size={14}/></button>}
      </div>
    </div>
  </article>;
}
function Choice({label,options,selected,available,onSelect}:{readonly label:string;readonly options:readonly {value:string;label:string;color?:string;disabled?:boolean}[];readonly selected?:string;readonly available?:ReadonlySet<string>;readonly onSelect:(value:string)=>void}){return <fieldset className="qchat-choice"><legend>{label}</legend><div>{options.map((option)=><button key={option.value} type="button" disabled={option.disabled||Boolean(available&&!available.has(option.value))} aria-pressed={selected===option.value} aria-label={`${label} ${option.label}`} onClick={()=>onSelect(option.value)}>{option.color&&<span style={{backgroundColor:option.color}}/>}{option.label}</button>)}</div></fieldset>}
