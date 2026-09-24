import * as _orpc_contract from '@orpc/contract';
import * as _orpc_shared from '@orpc/shared';
import { z } from 'zod';

declare const qChatEventSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"text.delta">;
    delta: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "text.delta";
    delta: string;
}, {
    type: "text.delta";
    delta: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"reasoning.status">;
    label: z.ZodString;
    elapsedMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "reasoning.status";
    label: string;
    elapsedMs?: number | undefined;
}, {
    type: "reasoning.status";
    label: string;
    elapsedMs?: number | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"tool.start">;
    toolCallId: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "tool.start";
    toolCallId: string;
    name: string;
}, {
    type: "tool.start";
    toolCallId: string;
    name: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"tool.result">;
    toolCallId: z.ZodString;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "tool.result";
    toolCallId: string;
    summary: string;
}, {
    type: "tool.result";
    toolCallId: string;
    summary: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"tool.error">;
    toolCallId: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "tool.error";
    toolCallId: string;
}, {
    message: string;
    type: "tool.error";
    toolCallId: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"ui.start">;
}, "strip", z.ZodTypeAny, {
    type: "ui.start";
}, {
    type: "ui.start";
}>, z.ZodObject<{
    type: z.ZodLiteral<"ui.delta">;
    delta: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "ui.delta";
    delta: string;
}, {
    type: "ui.delta";
    delta: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"ui.complete">;
    document: z.ZodObject<{
        version: z.ZodLiteral<"1">;
        id: z.ZodString;
        layout: z.ZodEnum<["container", "scroll"]>;
        children: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"product-collection">;
            id: z.ZodString;
            direction: z.ZodEnum<["horizontal", "vertical"]>;
            title: z.ZodOptional<z.ZodString>;
            items: z.ZodArray<z.ZodObject<{
                type: z.ZodLiteral<"product-card">;
                id: z.ZodString;
                title: z.ZodString;
                description: z.ZodOptional<z.ZodString>;
                image: z.ZodOptional<z.ZodObject<{
                    src: z.ZodEffects<z.ZodString, string, string>;
                    alt: z.ZodString;
                }, "strict", z.ZodTypeAny, {
                    src: string;
                    alt: string;
                }, {
                    src: string;
                    alt: string;
                }>>;
                price: z.ZodObject<{
                    amount: z.ZodNumber;
                    currency: z.ZodEffects<z.ZodString, string, string>;
                }, "strict", z.ZodTypeAny, {
                    amount: number;
                    currency: string;
                }, {
                    amount: number;
                    currency: string;
                }>;
                tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                colors: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    color: z.ZodOptional<z.ZodString>;
                    disabled: z.ZodOptional<z.ZodBoolean>;
                }, "strict", z.ZodTypeAny, {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }, {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }>, "many">>;
                sizes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                    color: z.ZodOptional<z.ZodString>;
                    disabled: z.ZodOptional<z.ZodBoolean>;
                }, "strict", z.ZodTypeAny, {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }, {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }>, "many">>;
                primaryAction: z.ZodOptional<z.ZodObject<{
                    label: z.ZodString;
                    name: z.ZodEnum<["product.select", "product.add", "product.open"]>;
                    payload: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                }, "strict", z.ZodTypeAny, {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                }, {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                }>>;
                secondaryAction: z.ZodOptional<z.ZodObject<{
                    label: z.ZodString;
                    name: z.ZodEnum<["product.select", "product.add", "product.open"]>;
                    payload: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                }, "strict", z.ZodTypeAny, {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                }, {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                }>>;
            }, "strict", z.ZodTypeAny, {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }, {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            type: "product-collection";
            id: string;
            direction: "horizontal" | "vertical";
            items: {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }[];
            title?: string | undefined;
        }, {
            type: "product-collection";
            id: string;
            direction: "horizontal" | "vertical";
            items: {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }[];
            title?: string | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"product-card">;
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            image: z.ZodOptional<z.ZodObject<{
                src: z.ZodEffects<z.ZodString, string, string>;
                alt: z.ZodString;
            }, "strict", z.ZodTypeAny, {
                src: string;
                alt: string;
            }, {
                src: string;
                alt: string;
            }>>;
            price: z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodEffects<z.ZodString, string, string>;
            }, "strict", z.ZodTypeAny, {
                amount: number;
                currency: string;
            }, {
                amount: number;
                currency: string;
            }>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            colors: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
                color: z.ZodOptional<z.ZodString>;
                disabled: z.ZodOptional<z.ZodBoolean>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }, {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }>, "many">>;
            sizes: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
                color: z.ZodOptional<z.ZodString>;
                disabled: z.ZodOptional<z.ZodBoolean>;
            }, "strict", z.ZodTypeAny, {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }, {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }>, "many">>;
            primaryAction: z.ZodOptional<z.ZodObject<{
                label: z.ZodString;
                name: z.ZodEnum<["product.select", "product.add", "product.open"]>;
                payload: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            }, "strict", z.ZodTypeAny, {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            }, {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            }>>;
            secondaryAction: z.ZodOptional<z.ZodObject<{
                label: z.ZodString;
                name: z.ZodEnum<["product.select", "product.add", "product.open"]>;
                payload: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            }, "strict", z.ZodTypeAny, {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            }, {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            }>>;
        }, "strict", z.ZodTypeAny, {
            type: "product-card";
            id: string;
            title: string;
            price: {
                amount: number;
                currency: string;
            };
            description?: string | undefined;
            image?: {
                src: string;
                alt: string;
            } | undefined;
            tags?: string[] | undefined;
            colors?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            sizes?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            primaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
            secondaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
        }, {
            type: "product-card";
            id: string;
            title: string;
            price: {
                amount: number;
                currency: string;
            };
            description?: string | undefined;
            image?: {
                src: string;
                alt: string;
            } | undefined;
            tags?: string[] | undefined;
            colors?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            sizes?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            primaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
            secondaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"status">;
            id: z.ZodString;
            variant: z.ZodEnum<["empty", "unavailable", "error"]>;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
        }, "strict", z.ZodTypeAny, {
            type: "status";
            id: string;
            title: string;
            variant: "empty" | "unavailable" | "error";
            description?: string | undefined;
        }, {
            type: "status";
            id: string;
            title: string;
            variant: "empty" | "unavailable" | "error";
            description?: string | undefined;
        }>]>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        version: "1";
        layout: "container" | "scroll";
        children: ({
            type: "product-card";
            id: string;
            title: string;
            price: {
                amount: number;
                currency: string;
            };
            description?: string | undefined;
            image?: {
                src: string;
                alt: string;
            } | undefined;
            tags?: string[] | undefined;
            colors?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            sizes?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            primaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
            secondaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
        } | {
            type: "product-collection";
            id: string;
            direction: "horizontal" | "vertical";
            items: {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }[];
            title?: string | undefined;
        } | {
            type: "status";
            id: string;
            title: string;
            variant: "empty" | "unavailable" | "error";
            description?: string | undefined;
        })[];
    }, {
        id: string;
        version: "1";
        layout: "container" | "scroll";
        children: ({
            type: "product-card";
            id: string;
            title: string;
            price: {
                amount: number;
                currency: string;
            };
            description?: string | undefined;
            image?: {
                src: string;
                alt: string;
            } | undefined;
            tags?: string[] | undefined;
            colors?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            sizes?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            primaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
            secondaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
        } | {
            type: "product-collection";
            id: string;
            direction: "horizontal" | "vertical";
            items: {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }[];
            title?: string | undefined;
        } | {
            type: "status";
            id: string;
            title: string;
            variant: "empty" | "unavailable" | "error";
            description?: string | undefined;
        })[];
    }>;
}, "strip", z.ZodTypeAny, {
    type: "ui.complete";
    document: {
        id: string;
        version: "1";
        layout: "container" | "scroll";
        children: ({
            type: "product-card";
            id: string;
            title: string;
            price: {
                amount: number;
                currency: string;
            };
            description?: string | undefined;
            image?: {
                src: string;
                alt: string;
            } | undefined;
            tags?: string[] | undefined;
            colors?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            sizes?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            primaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
            secondaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
        } | {
            type: "product-collection";
            id: string;
            direction: "horizontal" | "vertical";
            items: {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }[];
            title?: string | undefined;
        } | {
            type: "status";
            id: string;
            title: string;
            variant: "empty" | "unavailable" | "error";
            description?: string | undefined;
        })[];
    };
}, {
    type: "ui.complete";
    document: {
        id: string;
        version: "1";
        layout: "container" | "scroll";
        children: ({
            type: "product-card";
            id: string;
            title: string;
            price: {
                amount: number;
                currency: string;
            };
            description?: string | undefined;
            image?: {
                src: string;
                alt: string;
            } | undefined;
            tags?: string[] | undefined;
            colors?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            sizes?: {
                value: string;
                label: string;
                color?: string | undefined;
                disabled?: boolean | undefined;
            }[] | undefined;
            primaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
            secondaryAction?: {
                name: "product.select" | "product.add" | "product.open";
                payload: Record<string, string | number | boolean>;
                label: string;
            } | undefined;
        } | {
            type: "product-collection";
            id: string;
            direction: "horizontal" | "vertical";
            items: {
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            }[];
            title?: string | undefined;
        } | {
            type: "status";
            id: string;
            title: string;
            variant: "empty" | "unavailable" | "error";
            description?: string | undefined;
        })[];
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"usage">;
    usage: z.ZodObject<{
        inputTokens: z.ZodOptional<z.ZodNumber>;
        outputTokens: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
    }, {
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "usage";
    usage: {
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
    };
}, {
    type: "usage";
    usage: {
        inputTokens?: number | undefined;
        outputTokens?: number | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"performance">;
    record: z.ZodObject<{
        name: z.ZodString;
        durationMs: z.ZodNumber;
        runId: z.ZodString;
        timestamp: z.ZodString;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    }, "strip", z.ZodTypeAny, {
        runId: string;
        name: string;
        durationMs: number;
        timestamp: string;
        attributes?: Record<string, string | number | boolean> | undefined;
    }, {
        runId: string;
        name: string;
        durationMs: number;
        timestamp: string;
        attributes?: Record<string, string | number | boolean> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "performance";
    record: {
        runId: string;
        name: string;
        durationMs: number;
        timestamp: string;
        attributes?: Record<string, string | number | boolean> | undefined;
    };
}, {
    type: "performance";
    record: {
        runId: string;
        name: string;
        durationMs: number;
        timestamp: string;
        attributes?: Record<string, string | number | boolean> | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"complete">;
}, "strip", z.ZodTypeAny, {
    type: "complete";
}, {
    type: "complete";
}>, z.ZodObject<{
    type: z.ZodLiteral<"failure">;
    error: z.ZodObject<{
        code: z.ZodEnum<["CONFIG_INVALID", "ADAPTER_FAILED", "COMPILE_FAILED", "ACTION_REJECTED", "CANCELLED"]>;
        message: z.ZodString;
        retryable: z.ZodBoolean;
        diagnostics: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
        message: string;
        retryable: boolean;
        diagnostics?: string[] | undefined;
    }, {
        code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
        message: string;
        retryable: boolean;
        diagnostics?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "failure";
    error: {
        code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
        message: string;
        retryable: boolean;
        diagnostics?: string[] | undefined;
    };
}, {
    type: "failure";
    error: {
        code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
        message: string;
        retryable: boolean;
        diagnostics?: string[] | undefined;
    };
}>]>;
declare const qChatActionSchema: z.ZodObject<{
    name: z.ZodEnum<["product.select", "product.add", "product.open"]>;
    sourceNodeId: z.ZodString;
    payload: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    conversationId: z.ZodString;
    runId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    conversationId: string;
    runId: string;
    name: "product.select" | "product.add" | "product.open";
    sourceNodeId: string;
    payload: Record<string, string | number | boolean>;
}, {
    conversationId: string;
    runId: string;
    name: "product.select" | "product.add" | "product.open";
    sourceNodeId: string;
    payload: Record<string, string | number | boolean>;
}>;
declare const qChatORPCContract: {
    run: _orpc_contract.ContractProcedureBuilderWithInputOutput<z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            role: z.ZodEnum<["user", "assistant", "system"]>;
            content: z.ZodString;
            createdAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            role: "user" | "assistant" | "system";
            content: string;
            createdAt: string;
        }, {
            id: string;
            role: "user" | "assistant" | "system";
            content: string;
            createdAt: string;
        }>, "many">;
        metadata: z.ZodObject<{
            conversationId: z.ZodString;
            runId: z.ZodString;
            userId: z.ZodOptional<z.ZodString>;
            locale: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodUnknown, z.objectOutputType<{
            conversationId: z.ZodString;
            runId: z.ZodString;
            userId: z.ZodOptional<z.ZodString>;
            locale: z.ZodOptional<z.ZodString>;
        }, z.ZodUnknown, "strip">, z.objectInputType<{
            conversationId: z.ZodString;
            runId: z.ZodString;
            userId: z.ZodOptional<z.ZodString>;
            locale: z.ZodOptional<z.ZodString>;
        }, z.ZodUnknown, "strip">>;
    }, "strip", z.ZodTypeAny, {
        messages: {
            id: string;
            role: "user" | "assistant" | "system";
            content: string;
            createdAt: string;
        }[];
        metadata: {
            conversationId: string;
            runId: string;
            userId?: string | undefined;
            locale?: string | undefined;
        } & {
            [k: string]: unknown;
        };
    }, {
        messages: {
            id: string;
            role: "user" | "assistant" | "system";
            content: string;
            createdAt: string;
        }[];
        metadata: {
            conversationId: string;
            runId: string;
            userId?: string | undefined;
            locale?: string | undefined;
        } & {
            [k: string]: unknown;
        };
    }>, _orpc_contract.Schema<AsyncIteratorObject<{
        type: "text.delta";
        delta: string;
    } | {
        type: "reasoning.status";
        label: string;
        elapsedMs?: number | undefined;
    } | {
        type: "tool.start";
        toolCallId: string;
        name: string;
    } | {
        type: "tool.result";
        toolCallId: string;
        summary: string;
    } | {
        message: string;
        type: "tool.error";
        toolCallId: string;
    } | {
        type: "ui.start";
    } | {
        type: "ui.delta";
        delta: string;
    } | {
        type: "ui.complete";
        document: {
            id: string;
            version: "1";
            layout: "container" | "scroll";
            children: ({
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            } | {
                type: "product-collection";
                id: string;
                direction: "horizontal" | "vertical";
                items: {
                    type: "product-card";
                    id: string;
                    title: string;
                    price: {
                        amount: number;
                        currency: string;
                    };
                    description?: string | undefined;
                    image?: {
                        src: string;
                        alt: string;
                    } | undefined;
                    tags?: string[] | undefined;
                    colors?: {
                        value: string;
                        label: string;
                        color?: string | undefined;
                        disabled?: boolean | undefined;
                    }[] | undefined;
                    sizes?: {
                        value: string;
                        label: string;
                        color?: string | undefined;
                        disabled?: boolean | undefined;
                    }[] | undefined;
                    primaryAction?: {
                        name: "product.select" | "product.add" | "product.open";
                        payload: Record<string, string | number | boolean>;
                        label: string;
                    } | undefined;
                    secondaryAction?: {
                        name: "product.select" | "product.add" | "product.open";
                        payload: Record<string, string | number | boolean>;
                        label: string;
                    } | undefined;
                }[];
                title?: string | undefined;
            } | {
                type: "status";
                id: string;
                title: string;
                variant: "empty" | "unavailable" | "error";
                description?: string | undefined;
            })[];
        };
    } | {
        type: "usage";
        usage: {
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
        };
    } | {
        type: "performance";
        record: {
            runId: string;
            name: string;
            durationMs: number;
            timestamp: string;
            attributes?: Record<string, string | number | boolean> | undefined;
        };
    } | {
        type: "complete";
    } | {
        type: "failure";
        error: {
            code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
            message: string;
            retryable: boolean;
            diagnostics?: string[] | undefined;
        };
    }, unknown, void>, _orpc_shared.AsyncIteratorClass<{
        type: "text.delta";
        delta: string;
    } | {
        type: "reasoning.status";
        label: string;
        elapsedMs?: number | undefined;
    } | {
        type: "tool.start";
        toolCallId: string;
        name: string;
    } | {
        type: "tool.result";
        toolCallId: string;
        summary: string;
    } | {
        message: string;
        type: "tool.error";
        toolCallId: string;
    } | {
        type: "ui.start";
    } | {
        type: "ui.delta";
        delta: string;
    } | {
        type: "ui.complete";
        document: {
            id: string;
            version: "1";
            layout: "container" | "scroll";
            children: ({
                type: "product-card";
                id: string;
                title: string;
                price: {
                    amount: number;
                    currency: string;
                };
                description?: string | undefined;
                image?: {
                    src: string;
                    alt: string;
                } | undefined;
                tags?: string[] | undefined;
                colors?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                sizes?: {
                    value: string;
                    label: string;
                    color?: string | undefined;
                    disabled?: boolean | undefined;
                }[] | undefined;
                primaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
                secondaryAction?: {
                    name: "product.select" | "product.add" | "product.open";
                    payload: Record<string, string | number | boolean>;
                    label: string;
                } | undefined;
            } | {
                type: "product-collection";
                id: string;
                direction: "horizontal" | "vertical";
                items: {
                    type: "product-card";
                    id: string;
                    title: string;
                    price: {
                        amount: number;
                        currency: string;
                    };
                    description?: string | undefined;
                    image?: {
                        src: string;
                        alt: string;
                    } | undefined;
                    tags?: string[] | undefined;
                    colors?: {
                        value: string;
                        label: string;
                        color?: string | undefined;
                        disabled?: boolean | undefined;
                    }[] | undefined;
                    sizes?: {
                        value: string;
                        label: string;
                        color?: string | undefined;
                        disabled?: boolean | undefined;
                    }[] | undefined;
                    primaryAction?: {
                        name: "product.select" | "product.add" | "product.open";
                        payload: Record<string, string | number | boolean>;
                        label: string;
                    } | undefined;
                    secondaryAction?: {
                        name: "product.select" | "product.add" | "product.open";
                        payload: Record<string, string | number | boolean>;
                        label: string;
                    } | undefined;
                }[];
                title?: string | undefined;
            } | {
                type: "status";
                id: string;
                title: string;
                variant: "empty" | "unavailable" | "error";
                description?: string | undefined;
            })[];
        };
    } | {
        type: "usage";
        usage: {
            inputTokens?: number | undefined;
            outputTokens?: number | undefined;
        };
    } | {
        type: "performance";
        record: {
            runId: string;
            name: string;
            durationMs: number;
            timestamp: string;
            attributes?: Record<string, string | number | boolean> | undefined;
        };
    } | {
        type: "complete";
    } | {
        type: "failure";
        error: {
            code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
            message: string;
            retryable: boolean;
            diagnostics?: string[] | undefined;
        };
    }, unknown, void>>, Record<never, never>, Record<never, never>>;
    action: _orpc_contract.ContractProcedureBuilderWithInputOutput<z.ZodObject<{
        name: z.ZodEnum<["product.select", "product.add", "product.open"]>;
        sourceNodeId: z.ZodString;
        payload: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        conversationId: z.ZodString;
        runId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        conversationId: string;
        runId: string;
        name: "product.select" | "product.add" | "product.open";
        sourceNodeId: string;
        payload: Record<string, string | number | boolean>;
    }, {
        conversationId: string;
        runId: string;
        name: "product.select" | "product.add" | "product.open";
        sourceNodeId: string;
        payload: Record<string, string | number | boolean>;
    }>, z.ZodDiscriminatedUnion<"status", [z.ZodObject<{
        status: z.ZodLiteral<"accepted">;
        message: z.ZodOptional<z.ZodString>;
        navigationUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "accepted";
        message?: string | undefined;
        navigationUrl?: string | undefined;
    }, {
        status: "accepted";
        message?: string | undefined;
        navigationUrl?: string | undefined;
    }>, z.ZodObject<{
        status: z.ZodLiteral<"rejected">;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        status: "rejected";
    }, {
        message: string;
        status: "rejected";
    }>]>, Record<never, never>, Record<never, never>>;
};
type QChatORPCContract = typeof qChatORPCContract;

export { type QChatORPCContract, qChatActionSchema, qChatEventSchema, qChatORPCContract };
