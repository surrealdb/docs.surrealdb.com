import { pictoSpectronGradient, pictoSurrealDBGradient } from "@surrealdb/ui";
import {
    PRODUCT_META,
    PRODUCT_ORDER as PRODUCT_ORDER_META,
    type ProductId,
    type ProductMeta,
} from "~/utils/product";

export type { ProductId } from "~/utils/product";
export { getProductFromPath } from "~/utils/product";

export const PRODUCT_ORDER: ProductId[] = [...PRODUCT_ORDER_META];

/**
 * Visual identity for a product. Navigation lives separately in
 * `nav.ts` and is passed in by each `+Layout.tsx`, so this config
 * stays focused on branding (icon, label, home link).
 */
export interface ProductConfig extends ProductMeta {
    picto: string;
}

export const PRODUCTS: Record<ProductId, ProductConfig> = {
    surrealdb: {
        ...PRODUCT_META.surrealdb,
        picto: pictoSurrealDBGradient,
    },
    "agent-memory": {
        ...PRODUCT_META["agent-memory"],
        picto: pictoSpectronGradient,
    },
};
