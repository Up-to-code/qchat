import { z } from 'zod';

/** Public contracts shared by QChat adapters, servers, transports, and renderers. */
type QChatRole = "user" | "assistant" | "system";
interface QChatMessageAttachment {
    readonly kind: "image" | "file";
    readonly mediaType: string;
    readonly filename?: string;
    readonly previewUrl?: string;
}
interface QChatMessageRecord {
    readonly id: string;
    readonly role: QChatRole;
    readonly content: string;
    readonly createdAt: string;
    readonly attachments?: readonly QChatMessageAttachment[];
}
interface QChatToolDescriptor {
    readonly name: string;
    readonly description: string;
    readonly inputSchema?: Readonly<Record<string, unknown>>;
}
interface QChatRequestMetadata {
    readonly conversationId: string;
    readonly runId: string;
    readonly userId?: string;
    readonly locale?: string;
    readonly [key: string]: unknown;
}
interface QChatRunInput {
    readonly messages: readonly QChatMessageRecord[];
    readonly tools: readonly QChatToolDescriptor[];
    readonly systemPrompt: string;
    readonly metadata: QChatRequestMetadata;
    readonly signal: AbortSignal;
    readonly repair?: {
        readonly attempt: number;
        readonly diagnostics: readonly string[];
    };
}
interface QChatUsage {
    readonly inputTokens?: number;
    readonly outputTokens?: number;
}
interface QChatPerformanceRecord {
    readonly name: string;
    readonly durationMs: number;
    readonly runId: string;
    readonly timestamp: string;
    readonly attributes?: Readonly<Record<string, string | number | boolean>>;
}
interface QChatAction {
    readonly name: "product.select" | "product.add" | "product.open";
    readonly sourceNodeId: string;
    readonly payload: Readonly<Record<string, string | number | boolean>>;
    readonly conversationId: string;
    readonly runId: string;
}
type QChatActionResult = {
    readonly status: "accepted";
    readonly message?: string;
    readonly navigationUrl?: string;
} | {
    readonly status: "rejected";
    readonly message: string;
};
interface QChatErrorShape {
    readonly code: "CONFIG_INVALID" | "ADAPTER_FAILED" | "COMPILE_FAILED" | "ACTION_REJECTED" | "CANCELLED";
    readonly message: string;
    readonly retryable: boolean;
    readonly diagnostics?: readonly string[];
}

/** Serializable render-plan interfaces. Model output can never carry executable code. */

interface QChatChoiceOption {
    readonly value: string;
    readonly label: string;
    readonly color?: string;
    readonly disabled?: boolean;
}
interface QChatProductCardNode {
    readonly type: "product-card";
    readonly id: string;
    readonly title: string;
    readonly description?: string;
    readonly image?: {
        readonly src: string;
        readonly alt: string;
    };
    readonly price: {
        readonly amount: number;
        readonly currency: string;
    };
    readonly tags?: readonly string[];
    readonly colors?: readonly QChatChoiceOption[];
    readonly sizes?: readonly QChatChoiceOption[];
    readonly primaryAction?: Omit<QChatAction, "conversationId" | "runId" | "sourceNodeId"> & {
        readonly label: string;
    };
    readonly secondaryAction?: Omit<QChatAction, "conversationId" | "runId" | "sourceNodeId"> & {
        readonly label: string;
    };
}
interface QChatProductCollectionNode {
    readonly type: "product-collection";
    readonly id: string;
    readonly direction: "horizontal" | "vertical";
    readonly title?: string;
    readonly items: readonly QChatProductCardNode[];
}
interface QChatStatusNode {
    readonly type: "status";
    readonly id: string;
    readonly variant: "empty" | "unavailable" | "error";
    readonly title: string;
    readonly description?: string;
}
/** A bounded, industry-neutral result backed by host data rather than model-authored markup. */
interface QChatInfoCardNode {
    readonly type: "info-card";
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly facts?: readonly {
        readonly label: string;
        readonly value: string;
    }[];
    readonly source?: string;
}
type QChatUINode = QChatProductCollectionNode | QChatProductCardNode | QChatStatusNode | QChatInfoCardNode;
interface QChatUIDocument {
    readonly version: "1";
    readonly id: string;
    readonly layout: "container" | "scroll";
    readonly children: readonly QChatUINode[];
}

/** Canonical stream events produced by every QChat agent adapter. */

type QChatAgentEvent = {
    readonly type: "text.delta";
    readonly delta: string;
} | {
    readonly type: "reasoning.status";
    readonly label: string;
    readonly elapsedMs?: number;
} | {
    readonly type: "tool.start";
    readonly toolCallId: string;
    readonly name: string;
} | {
    readonly type: "tool.result";
    readonly toolCallId: string;
    readonly summary: string;
} | {
    readonly type: "tool.error";
    readonly toolCallId: string;
    readonly message: string;
} | {
    readonly type: "ui.start";
} | {
    readonly type: "ui.delta";
    readonly delta: string;
} | {
    readonly type: "ui.complete";
    readonly document: QChatUIDocument;
} | {
    readonly type: "usage";
    readonly usage: QChatUsage;
} | {
    readonly type: "performance";
    readonly record: QChatPerformanceRecord;
} | {
    readonly type: "complete";
} | {
    readonly type: "failure";
    readonly error: QChatErrorShape;
};

/** Host-supplied commerce facts. These are not generated UI instructions. */
interface QChatProductVariant {
    readonly id: string;
    readonly color: string;
    readonly size: string;
    readonly price: {
        readonly amount: number;
        readonly currency: string;
    };
    readonly available: boolean;
    readonly image?: {
        readonly src: string;
        readonly alt: string;
    };
}
type QChatProductVariantCatalog = Readonly<Record<string, readonly QChatProductVariant[]>>;

declare const qChatChoiceOptionSchema: z.ZodObject<{
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
}>;
declare const qChatProductCardSchema: z.ZodObject<{
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
    image?: {
        src: string;
        alt: string;
    } | undefined;
    description?: string | undefined;
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
    image?: {
        src: string;
        alt: string;
    } | undefined;
    description?: string | undefined;
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
}>;
declare const qChatProductCollectionSchema: z.ZodObject<{
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
}>;
declare const qChatStatusSchema: z.ZodObject<{
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
}>;
declare const qChatInfoCardSchema: z.ZodObject<{
    type: z.ZodLiteral<"info-card">;
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    facts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">>;
    source: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    type: "info-card";
    id: string;
    title: string;
    description: string;
    facts?: {
        value: string;
        label: string;
    }[] | undefined;
    source?: string | undefined;
}, {
    type: "info-card";
    id: string;
    title: string;
    description: string;
    facts?: {
        value: string;
        label: string;
    }[] | undefined;
    source?: string | undefined;
}>;
declare const qChatUIDocumentSchema: z.ZodObject<{
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
            image?: {
                src: string;
                alt: string;
            } | undefined;
            description?: string | undefined;
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
            image?: {
                src: string;
                alt: string;
            } | undefined;
            description?: string | undefined;
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
            image?: {
                src: string;
                alt: string;
            } | undefined;
            description?: string | undefined;
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
            image?: {
                src: string;
                alt: string;
            } | undefined;
            description?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
    }>, z.ZodObject<{
        type: z.ZodLiteral<"info-card">;
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        facts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">>;
        source: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        type: "info-card";
        id: string;
        title: string;
        description: string;
        facts?: {
            value: string;
            label: string;
        }[] | undefined;
        source?: string | undefined;
    }, {
        type: "info-card";
        id: string;
        title: string;
        description: string;
        facts?: {
            value: string;
            label: string;
        }[] | undefined;
        source?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
            image?: {
                src: string;
                alt: string;
            } | undefined;
            description?: string | undefined;
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
    } | {
        type: "info-card";
        id: string;
        title: string;
        description: string;
        facts?: {
            value: string;
            label: string;
        }[] | undefined;
        source?: string | undefined;
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
        image?: {
            src: string;
            alt: string;
        } | undefined;
        description?: string | undefined;
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
            image?: {
                src: string;
                alt: string;
            } | undefined;
            description?: string | undefined;
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
    } | {
        type: "info-card";
        id: string;
        title: string;
        description: string;
        facts?: {
            value: string;
            label: string;
        }[] | undefined;
        source?: string | undefined;
    })[];
}>;
type QChatUIDocumentInput = z.input<typeof qChatUIDocumentSchema>;

declare const qChatProductVariantSchema: z.ZodObject<{
    id: z.ZodString;
    color: z.ZodString;
    size: z.ZodString;
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
    available: z.ZodBoolean;
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
}, "strict", z.ZodTypeAny, {
    color: string;
    id: string;
    price: {
        amount: number;
        currency: string;
    };
    size: string;
    available: boolean;
    image?: {
        src: string;
        alt: string;
    } | undefined;
}, {
    color: string;
    id: string;
    price: {
        amount: number;
        currency: string;
    };
    size: string;
    available: boolean;
    image?: {
        src: string;
        alt: string;
    } | undefined;
}>;
/** Parse catalog facts before supplying them to QChatConfig. */
declare function createQChatProductVariantCatalog(value: unknown): QChatProductVariantCatalog;

export { type QChatAction, type QChatActionResult, type QChatAgentEvent, type QChatChoiceOption, type QChatErrorShape, type QChatInfoCardNode, type QChatMessageAttachment, type QChatMessageRecord, type QChatPerformanceRecord, type QChatProductCardNode, type QChatProductCollectionNode, type QChatProductVariant, type QChatProductVariantCatalog, type QChatRequestMetadata, type QChatRole, type QChatRunInput, type QChatStatusNode, type QChatToolDescriptor, type QChatUIDocument, type QChatUIDocumentInput, type QChatUINode, type QChatUsage, createQChatProductVariantCatalog, qChatChoiceOptionSchema, qChatInfoCardSchema, qChatProductCardSchema, qChatProductCollectionSchema, qChatProductVariantSchema, qChatStatusSchema, qChatUIDocumentSchema };
