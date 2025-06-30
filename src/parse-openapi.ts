import SwaggerParser from "@apidevtools/swagger-parser";
import { OpenAPI } from "openapi-types";

export type NormalizedNode = {
    name: string;
    method: string;
    path: string;
    operationId: string;
    summary?: string;
    tag?: string;
    baseUrl: string;
    inputParams: string[];
    hasRequestBody: boolean;
};

export type ParsedOpenAPI = {
    version: string;
    nodes: NormalizedNode[];
};

function isOpenAPIv3(doc: any): doc is OpenAPI.Document {
    return typeof doc?.openapi === "string" && doc.openapi.startsWith("3");
}


export async function parseOpenAPISpec(fileOrUrl: string): Promise<ParsedOpenAPI> {
    const api = await SwaggerParser.dereference(fileOrUrl);
    let version = "";
    let baseUrl = "";

    // Handle OpenAPI v3.x
    if (isOpenAPIv3(api)) {
        version = (api as any).openapi;
        baseUrl = ((api as any).servers?.[0]?.url || "").replace(/\/+$/, "");
    }
    // Handle Swagger 2.0
    else if ((api as any).swagger === "2.0") {
        version = "2.0";
        const v2 = api as any;
        const scheme = (v2.schemes?.[0] || "http");
        const host = v2.host ?? "";
        const basePath = v2.basePath ?? "";
        baseUrl = `${scheme}://${host}${basePath}`.replace(/\/+$/, "");
    }
    const result: NormalizedNode[] = [];

    for (const path in api.paths) {
        const pathItem = api.paths[path]!;
        for (const method of Object.keys(pathItem)) {
            const op = (pathItem as any)[method];

            if (!op || typeof op !== "object") continue;

            const operationId = op.operationId || `${method}-${path.replace(/[\/{}]/g, "-")}`;
            const summary = op.summary;
            const tag = op.tags?.[0];
            const inputParams = (op.parameters || []).map((p: any) => p.name);
            const hasRequestBody = !!op.requestBody;

            result.push({
                name: `${method}-${path.replace(/[\/{}]/g, "-")}`.replace(/-+/g, "-").replace(/^-|-$/g, ""),
                method: method.toUpperCase(),
                path,
                operationId,
                summary,
                tag,
                baseUrl,
                inputParams,
                hasRequestBody,
            });
        }
    }

    return { version, nodes: result };
}
